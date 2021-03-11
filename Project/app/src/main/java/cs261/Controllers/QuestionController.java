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
            App.getApp().getObservable().notifyAttendees(2, sessionID, gson.toJson(q));
            App.getApp().getObservable().notifyModerators(7, sessionID, gson.toJson(q));
        } else {
            // notifies mods as question is hidden
            App.getApp().getObservable().notifyModerators(7, sessionID, gson.toJson(q));
        }

        // returns new token and instance json of question
        return "{\"token\":\"" + dbConn.newToken(user.getId()) + "\", \"question\":" + gson.toJson(q) + "}";
    };

    public static Route submitResponse = (Request request, Response response) -> {
        DBConnection dbConn = App.getApp().getDbConn();
        Cacher cacher = App.getApp().getCacher();

        String token = request.cookie("token");
        String sessionID = request.params(":id");
        String context = request.queryParams("context");
        String anon = request.queryParams("anon");
        int smiley = Integer.parseInt(request.queryParams("smiley"));
        int qID = Integer.parseInt(request.queryParams("qID"));
        Boolean anonymous;

        User user = dbConn.getUserByToken(token);
        if (Objects.isNull(user)) {

            response.status(450);
            logger.warn("Submit response to question {} in session {} attempted with invalid token: {}", qID, sessionID,
                    token);
            return "Invalid Token";
        }

        anonymous = Boolean.parseBoolean(anon);

        if (!cacher.sessionExists(sessionID)) {
            response.status(454);
            logger.warn("User {} attempted to access session {} but it doesn't exist", user.getId(), sessionID);
            return "Session doesn't exist";
        }
        // check session exists
        // check question exists
        if (qID != -1) {
            if (!cacher.questionExists(sessionID, qID)) {
                response.status(457);
                return "No such question";
            }
        }

        Answer answer = new Answer(user, smiley, context, new Date(), anonymous);
        cacher.createAnswer(answer, sessionID, qID);
        cacher.setSessionMood(sessionID, App.getApp().getAnalyse().newMoodCoefficient(cacher.getSessionMood(sessionID),
                App.getApp().getAnalyse().parseText(answer.getContext()), dbConn.numOfAnswersToQ(sessionID, qID)));
        cacher.createMoodDate(sessionID, new MoodDate(cacher.getSessionMood(sessionID), new Date()));

        App.getApp().getObservable().notifyModerators(7, sessionID, gson.toJson(answer));// TODO this will need a
                                                                                         // question ID or it's useless
        return "{\"token\":\"" + dbConn.newToken(user.getId()) + "\"}";
    };

    public static Route deleteQuestion = (Request request, Response response) -> {
        DBConnection dbConn = App.getApp().getDbConn();
        Cacher cacher = App.getApp().getCacher();

        String token = request.cookie("token");
        String sessionID = request.params(":id");
        int qID = Integer.parseInt(request.queryParams("qID"));

        User user = dbConn.getUserByToken(token);
        // token is valid
        if (Objects.isNull(user)) {
            response.status(450);
            logger.warn("Delete question question {} in session {} attempted with invalid token: {}", qID, sessionID,
                    token);
            return "Invalid Token";
        }

        if (!cacher.sessionExists(sessionID)) {
            response.status(454);
            logger.warn("User {} attempted to access session {} but it doesn't exist", user.getId(), sessionID);
            return "session doesn't exist";
        }

        // session exits? maybe

        if (!cacher.userIsModerator(user, sessionID)) {
            response.status(401);
            logger.warn("User {} attempted to access session {} but is not authorised", user.getId(), sessionID);
            return "not authorised";
        }

        Question q = cacher.getQuestionByID(sessionID, qID);
        if (Objects.isNull(q)) {
            response.status(454);
            return "no such question";
        }

        cacher.deleteQuestion(sessionID, qID);

        App.getApp().getObservable().notifyBoth(7, sessionID, Integer.toString(qID));

        return "{\"token\":\"" + dbConn.newToken(user.getId()) + "\"}";
    };

    public static Route endQuestion = (Request request, Response response) -> {
        DBConnection dbConn = App.getApp().getDbConn();
        Cacher cacher = App.getApp().getCacher();

        String token = request.cookie("token");
        String sessionID = request.params(":id");
        int qID = Integer.parseInt(request.queryParams("qID"));

        User user = dbConn.getUserByToken(token);
        // token is valid
        if (Objects.isNull(user)) {
            response.status(450);
            logger.warn("End question {} in session {} attempted with invalid token: {}", qID, sessionID, token);
            return "Invalid Token";
        }

        if (!cacher.sessionExists(sessionID)) {
            response.status(454);
            logger.warn("User {} attempted to access session {} but it doesn't exist", user.getId(), sessionID);
            return "session doesn't exist";
        }

        // session exits? maybe

        if (!cacher.userIsModerator(user, sessionID)) {
            response.status(401);
            return "not authorised";
        }

        Question q = cacher.getQuestionByID(sessionID, qID);
        if (Objects.isNull(q)) {
            response.status(454);
            return "no such question";
        }

        cacher.endQuestion(sessionID, qID);
        App.getApp().getObservable().notifyBoth(3, sessionID, gson.toJson(q));// need to discuss how to do this

        return "{\"token\":\"" + dbConn.newToken(user.getId()) + "\"}";
    };

    public static Route pushQuestion = (Request request, Response response) -> {
        DBConnection dbConn = App.getApp().getDbConn();
        Cacher cacher = App.getApp().getCacher();

        String token = request.cookie("token");
        String sessionID = request.params(":id");
        int qID = Integer.parseInt(request.queryParams("qID"));

        User user = dbConn.getUserByToken(token);
        // token is valid
        if (Objects.isNull(user)) {
            response.status(450);
            logger.warn("Push question {} in session {} attempted with invalid token: {}", qID, sessionID, token);
            return "Invalid Token";
        }

        if (!cacher.sessionExists(sessionID)) {
            response.status(454);
            logger.warn("User {} attempted to access session {} but it doesn't exist", user.getId(), sessionID);
            return "session doesn't exist";
        }

        // session exits? maybe

        if (!cacher.userIsModerator(user, sessionID)) {
            response.status(401);
            return "not authorised";
        }

        Question q = cacher.getQuestionByID(sessionID, qID);
        if (Objects.isNull(q)) {
            response.status(454);
            return "no such question";
        }

        cacher.pushQuestion(sessionID, qID);
        App.getApp().getObservable().notifyAttendees(2, sessionID, gson.toJson(q));
        App.getApp().getObservable().notifyModerators(237, sessionID, gson.toJson(q));

        return "{\"token\":\"" + dbConn.newToken(user.getId()) + "\"}";
    };

}