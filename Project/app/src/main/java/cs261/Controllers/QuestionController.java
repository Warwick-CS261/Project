package cs261.Controllers;

import java.util.*;

import spark.*;

import cs261.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.Gson;

public class QuestionController {

    private static Gson gson = new Gson();

    final static Logger logger = LoggerFactory.getLogger(AuthController.class);

    public static Route createQuestion = (Request request, Response response) -> {
        DBConnection dbConn = App.getApp().getDbConn();
        Cacher cacher = App.getApp().getCacher();

        // gets params
        String sessionID = request.params(":id");
        String token = request.cookie("token");
        String question = request.queryParams("question");
        try {
            Boolean pushed = Boolean.parseBoolean(request.queryParamOrDefault("pushed", "false"));
            Boolean general = Boolean.parseBoolean(request.queryParamOrDefault("general", "false"));

            User user = dbConn.getUserByToken(token);
            // verifies valid token
            if (Objects.isNull(user)) {
                response.status(450);
                logger.warn("Create question in session {} attempted with invalid token: {}", sessionID, token);
                return "Invalid Token";
            }

            if (!cacher.sessionExists(sessionID)) {
                response.status(454);
                logger.warn("User {} attempted to access session {} but it doesn't exist", user.getId(), sessionID);
                return "session doesn't exist";
            }

            // verify user is moderator or owner
            if (!cacher.userIsModerator(user, sessionID)) {
                response.status(401);
                return "not authorised for session " + sessionID;
            }

            // creates question
            Question q = new Question(question, pushed, general);
            App.getApp().getCacher().createQuestion(q, sessionID);

            if (pushed) {
                // notifies attendees and mods as question is pushed
                App.getApp().getObservable().notifyAttendees(2, sessionID, gson.toJson(q.attendeeQuestion()));
                App.getApp().getObservable().notifyModerators(6, sessionID, gson.toJson(q));
            } else {
                App.getApp().getObservable().notifyModerators(6, sessionID, gson.toJson(q));
            }

            // returns new token and instance json of question
            return "{\"token\":\"" + dbConn.newToken(user.getId()) + "\", \"question\":" + gson.toJson(q) + "}";
        } catch (Exception e) {
            logger.warn("Encountered an exception trying to create a question, message as follows: \n{}",
                    e.getMessage());
        }
        response.status(459);
        return "Couldn't peform this operation";
    };

    public static Route submitResponse = (Request request, Response response) -> {
        DBConnection dbConn = App.getApp().getDbConn();
        Cacher cacher = App.getApp().getCacher();

        // gets params
        String token = request.cookie("token");
        String sessionID = request.params(":id");
        String context = request.queryParams("context");
        String anon = request.queryParams("anon");
        try {
            int smiley = Integer.parseInt(request.queryParams("smiley"));
            int qID = Integer.parseInt(request.queryParams("qID"));
            Boolean anonymous = Boolean.parseBoolean(anon);

            // verifies valid token

            User user = dbConn.getUserByToken(token);
            if (Objects.isNull(user)) {

                response.status(450);
                logger.warn("Submit response to question {} in session {} attempted with invalid token: {}", qID,
                        sessionID, token);
                return "Invalid Token";
            }

            // verifies sessions exists
            if (!cacher.sessionExists(sessionID)) {
                response.status(454);
                logger.warn("User {} attempted to access session {} but it doesn't exist", user.getId(), sessionID);
                return "Session doesn't exist";
            }

            // checks session exists
            if (!cacher.questionExists(sessionID, qID)) {
                response.status(457);
                return "No such question";
            }

            // creates new answer
            Answer answer = new Answer(user, smiley, context, new Date(), anonymous);
            float textMood = App.getApp().getAnalyse().parseText(answer.getContext());
            // checks if the question should be used for the general mood of the session
            if (cacher.questionIsGeneral(sessionID, qID)) {
                // sets session mood
                cacher.setSessionMood(sessionID, App.getApp().getAnalyse().newMoodCoefficient(
                        cacher.getSessionMood(sessionID), textMood, dbConn.numOfGeneralAnswers(sessionID)));
                // creates new mood date
                cacher.createMoodDate(sessionID, new MoodDate(cacher.getSessionMood(sessionID), new Date()));
            }

            // sets new question mood
            cacher.setQuestionMood(sessionID, qID, App.getApp().getAnalyse().newMoodCoefficient(
                    cacher.getQuestionMood(sessionID, qID), textMood, dbConn.numOfAnswersToQ(sessionID, qID)));

            // creates new answer
            cacher.createAnswer(answer, sessionID, qID);

            // notifies mods and provides new answer
            App.getApp().getObservable().notifyModerators(3, sessionID,
                    "{\"qID\":" + qID + ",\"answer\":" + gson.toJson(answer) + "}");

            // returns new token
            return "{\"token\":\"" + dbConn.newToken(user.getId()) + "\"}";
        } catch (Exception e) {
            logger.warn("Encountered an SQLEXcpeption trying to submit a response, message as follows: \n{}",
                    e.getMessage());
        }
        response.status(459);
        return "Couldn't peform this operation";
    };

    public static Route deleteQuestion = (Request request, Response response) -> {
        DBConnection dbConn = App.getApp().getDbConn();
        Cacher cacher = App.getApp().getCacher();

        // gets params
        String token = request.cookie("token");
        String sessionID = request.params(":id");
        try {
            int qID = Integer.parseInt(request.queryParams("qID"));

            // verifies toke is valid and gets user
            User user = dbConn.getUserByToken(token);

            if (Objects.isNull(user)) {
                response.status(450);
                logger.warn("Delete question question {} in session {} attempted with invalid token: {}", qID,
                        sessionID, token);
                return "Invalid Token";
            }

            // verifies session exists
            if (!cacher.sessionExists(sessionID)) {
                response.status(454);
                logger.warn("User {} attempted to access session {} but it doesn't exist", user.getId(), sessionID);
                return "session doesn't exist";
            }

            // verifies question exists

            Question q = cacher.getQuestionByID(sessionID, qID);
            if (Objects.isNull(q)) {
                response.status(454);
                return "no such question";
            }

            // verifies user is a moderator
            if (!cacher.userIsModerator(user, sessionID)) {
                response.status(401);
                logger.warn("User {} attempted to access session {} but is not authorised", user.getId(), sessionID);
                return "not authorised";
            }

            // deletes question
            cacher.deleteQuestion(sessionID, qID);

            // notifies all watchers that a question has been deleted
            App.getApp().getObservable().notifyBoth(7, sessionID, Integer.toString(qID));

            return "{\"token\":\"" + dbConn.newToken(user.getId()) + "\"}";
        } catch (Exception e) {
            logger.warn("Encountered an exception trying to delete a question, message as follows: \n{}",
                    e.getMessage());
        }
        response.status(459);
        return "Couldn't peform this operation";
    };

    public static Route endQuestion = (Request request, Response response) -> {
        DBConnection dbConn = App.getApp().getDbConn();
        Cacher cacher = App.getApp().getCacher();

        // gets param
        String token = request.cookie("token");
        String sessionID = request.params(":id");
        try {
            int qID = Integer.parseInt(request.queryParams("qID"));

            User user = dbConn.getUserByToken(token);
            // token is valid
            if (Objects.isNull(user)) {
                response.status(450);
                logger.warn("End question {} in session {} attempted with invalid token: {}", qID, sessionID, token);
                return "Invalid Token";
            }

            // verifies session exists
            if (!cacher.sessionExists(sessionID)) {
                response.status(454);
                logger.warn("User {} attempted to access session {} but it doesn't exist", user.getId(), sessionID);
                return "session doesn't exist";
            }

            // verifies question exists
            Question q = cacher.getQuestionByID(sessionID, qID);
            if (Objects.isNull(q)) {
                response.status(454);
                return "no such question";
            }

            // verifies user is moderator
            if (!cacher.userIsModerator(user, sessionID)) {
                response.status(401);
                return "not authorised";
            }

            // ends questions
            cacher.endQuestion(sessionID, qID);
            q.setPushed(false);

            // notifies everyone
            App.getApp().getObservable().notifyBoth(2, sessionID, gson.toJson(q.attendeeQuestion()));// need to discuss
                                                                                                     // how to do this

            // returns new token
            return "{\"token\":\"" + dbConn.newToken(user.getId()) + "\"}";
        } catch (Exception e) {
            logger.warn("Encountered an exception trying to end a question, message as follows: \n{}", e.getMessage());
        }
        response.status(459);
        return "Couldn't peform this operation";
    };

    public static Route pushQuestion = (Request request, Response response) -> {
        DBConnection dbConn = App.getApp().getDbConn();
        Cacher cacher = App.getApp().getCacher();

        // gets params
        String token = request.cookie("token");
        String sessionID = request.params(":id");
        try {
            int qID = Integer.parseInt(request.queryParams("qID"));

            // verifies token and gets user
            User user = dbConn.getUserByToken(token);

            if (Objects.isNull(user)) {
                response.status(450);
                logger.warn("Push question {} in session {} attempted with invalid token: {}", qID, sessionID, token);
                return "Invalid Token";
            }

            // verifies session exists
            if (!cacher.sessionExists(sessionID)) {
                response.status(454);
                logger.warn("User {} attempted to access session {} but it doesn't exist", user.getId(), sessionID);
                return "session doesn't exist";
            }

            // verifies question exists
            Question q = cacher.getQuestionByID(sessionID, qID);
            if (Objects.isNull(q)) {
                response.status(454);
                return "no such question";
            }

            // verifies user is moderator
            if (!cacher.userIsModerator(user, sessionID)) {
                response.status(401);
                return "not authorised";
            }

            // pushes questions
            cacher.pushQuestion(sessionID, qID);
            q.setPushed(true);

            // notifies all watchers question has ended
            App.getApp().getObservable().notifyBoth(2, sessionID, gson.toJson(q.attendeeQuestion()));

            // returns new token
            return "{\"token\":\"" + dbConn.newToken(user.getId()) + "\"}";
        } catch (Exception e) {
            logger.warn("Encountered an exception trying to push a question, message as follows: \n{}", e.getMessage());
        }
        response.status(459);
        return "Couldn't peform this operation";
    };

}