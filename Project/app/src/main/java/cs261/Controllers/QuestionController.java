package cs261.Controllers;

import java.time.LocalDateTime;
import java.util.*;

import spark.*;

import cs261.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.Gson;

public class QuestionController{

    private static Gson gson = new Gson();

    final static Logger logger = LoggerFactory.getLogger(AuthController.class);

    public static Route createQuestion = (Request request, Response response) -> {
        DBConnection dbConn = App.getApp().getDbConn();

        String sessionID = request.params(":id");
        String token = request.cookie("token");
        String question = request.queryParams("question");
        Boolean pushed = Boolean.parseBoolean(request.queryParamOrDefault("pushed", "false"));
        //add pushed variable
        User user = dbConn.getUserByToken(token);
        if(Objects.isNull(user)){
            response.status(450);
            logger.warn("Create question in session {} attempted with invalid token: {}", sessionID,token);
            return "Invalid Token";
        }
        //need to check user is moderator or owner
        if(!dbConn.userIsModerator(user.getId(), sessionID)){
            response.status(401);
            return "not authorised for session "+sessionID;
        }

        Question q = new Question(question, pushed);
        App.getApp().getCacher().createQuestion(q, sessionID);
        return "token="+dbConn.newToken(user.getId())+","+gson.toJson(q);
    };

    public static Route submitResponse = (Request request, Response response) -> {
        DBConnection dbConn = App.getApp().getDbConn();

        String token = request.cookie("token");
        String sessionID = request.params(":id");
        String context = request.queryParams("asnwer");
        String anon = request.queryParams("anon");
        int smiley = Integer.parseInt(request.queryParams("smiley"));
        int qID =  Integer.parseInt(request.queryParams("qID"));
        Boolean anonymous;

        User user = dbConn.getUserByToken(token);
        if(Objects.isNull(user)){
            
            response.status(450);
            logger.warn("Submit response to question {} in session {} attempted with invalid token: {}",qID, sessionID,token);
            return "Invalid Token";
        }
        if(anon.equals("true")){
            anonymous = true;
        }else if(anon.equals("false")){
            anonymous = false;
        }else{
            response.status(457);
            return "fuck off(anon made no sense)";
        }

        if(!dbConn.sessionExists(sessionID)){
            response.status(454);
            logger.warn("User {} attempted to access session {} but it doesn't exist", user.getId(), sessionID);
            return "Session doesn't exist"; 
        }
        //check session exists
        //check question exists
        Answer answer = new Answer(user, smiley, context, new Date(), anonymous);
        dbConn.createAnswer(answer, sessionID, qID);
        dbConn.setSessionMood(sessionID, App.getApp().getAnalyse().newMoodCoefficient(dbConn.getSessionMood(sessionID), App.getApp().getAnalyse().parseText(answer.getContext()), dbConn.numOfAnswersToQ(sessionID, qID)));
        dbConn.createMoodDate(sessionID, new Date(), dbConn.getSessionMood(sessionID));
        
        App.getApp().getObservable().notifyHosts(3, sessionID, gson.toJson(answer));
        return "token="+dbConn.newToken(user.getId());
    };

    public static Route deleteQuestion = (Request request, Response response) -> {
        DBConnection dbConn = App.getApp().getDbConn();

        String token = request.cookie("token");
        String sessionID = request.params(":id");
        int qID =  Integer.parseInt(request.queryParams("qID"));

        User user = dbConn.getUserByToken(token);
        //token is valid
        if(Objects.isNull(user)){
            response.status(450);
            logger.warn("Delete question question {} in session {} attempted with invalid token: {}",qID, sessionID,token);
            return "Invalid Token";
        }

        if(!dbConn.sessionExists(sessionID)){
            response.status(454);
            logger.warn("User {} attempted to access session {} but it doesn't exist", user.getId(), sessionID);
            return "session doesn't exist";
        }

        //session exits? maybe

        if(!dbConn.userIsModerator(user.getId(), sessionID)){
            response.status(401);
            logger.warn("User {} attempted to access session {} but is not authorised", user.getId(), sessionID);
            return "not authorised";
        }

        dbConn.deleteQuestion(sessionID, qID);

        return "token="+dbConn.newToken(user.getId());
    };

    public static Route endQuestion = (Request request, Response response) -> {
        DBConnection dbConn = App.getApp().getDbConn();

        String token = request.cookie("token");
        String sessionID = request.params(":id");
        int qID =  Integer.parseInt(request.queryParams("qID"));

        User user = dbConn.getUserByToken(token);
        //token is valid
        if(Objects.isNull(user)){
            response.status(450);
            logger.warn("End question {} in session {} attempted with invalid token: {}",qID, sessionID,token);
            return "Invalid Token";
        }

        if(!dbConn.sessionExists(sessionID)){
            response.status(454);
            logger.warn("User {} attempted to access session {} but it doesn't exist", user.getId(), sessionID);
            return "session doesn't exist";
        }

        //session exits? maybe

        if(!dbConn.userIsModerator(user.getId(), sessionID)){
            response.status(1);
            return "not authorised";
        }

        Question q = dbConn.getQuestionByID(sessionID, qID);
        if(Objects.isNull(q)){
            response.status(454);
            return "no such question";
        }  

        dbConn.endQuestion(sessionID, qID);
        //App.getApp().getObservable().notifyWatchers(3, sessionID, gson.toJson(q));

        return "token="+dbConn.newToken(user.getId());
    };

    public static Route pushQuestion = (Request request, Response response) -> {
        DBConnection dbConn = App.getApp().getDbConn();

        String token = request.cookie("token");
        String sessionID = request.params(":id");
        int qID =  Integer.parseInt(request.queryParams("qID"));

        User user = dbConn.getUserByToken(token);
        //token is valid
        if(Objects.isNull(user)){
            response.status(450);
            logger.warn("Push question {} in session {} attempted with invalid token: {}",qID, sessionID,token);
            return "Invalid Token";
        }

        if(!dbConn.sessionExists(sessionID)){
            response.status(454);
            logger.warn("User {} attempted to access session {} but it doesn't exist", user.getId(), sessionID);
            return "session doesn't exist";
        }

        //session exits? maybe

        if(!dbConn.userIsModerator(user.getId(), sessionID)){
            response.status(401);
            return "not authorised";
        }

        Question q = dbConn.getQuestionByID(sessionID, qID);
        if(Objects.isNull(q)){
            response.status(454);
            return "no such question";
        }

        dbConn.pushQuestion(sessionID, qID);
        App.getApp().getObservable().notifyWatchers(3, sessionID, gson.toJson(q));

        return "token="+dbConn.newToken(user.getId());
    };

}