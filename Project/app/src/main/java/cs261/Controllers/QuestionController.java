package cs261.Controllers;

import java.time.LocalDateTime;
import java.util.*;

import spark.*;

import cs261.*;

import com.google.gson.Gson;

public class QuestionController{

    private static Gson gson = new Gson();

    public static Route createQuestion = (Request request, Response response) -> {
        DBConnection dbConn = App.getApp().getDbConn();

        String sessionID = request.params(":id");
        String token = request.cookie("token");
        String question = request.queryParams("question");
        User user = dbConn.getUserByToken(token);
        if(Objects.isNull(user)){
            response.status(450);
            return "Invalid Token";
        }
        //need to check user is moderator or owner
        if(!dbConn.userIsModerator(user.getId(), sessionID)){
            response.status(401);
            return "not authorised for session "+sessionID;
        }
        Question q = new Question(question);
        dbConn.createQuestion(q, sessionID);
        response.cookie("token", dbConn.newToken(user.getId()), 3600, false, true);
        return gson.toJson(question) + sessionID;
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
            return "Invalid Token";
        }
        LocalDateTime stamp = LocalDateTime.now();
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
            return "Session doesn't exist"; 
        }
        //check session exists
        //check question exists
        Answer answer = new Answer(user, smiley, context, stamp, anonymous);
        dbConn.createAnswer(answer, sessionID, qID);

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
            return "Invalid Token";
        }

        if(!dbConn.sessionExists(sessionID)){
            response.status(1);
            return "session doesn't exist";
        }

        //session exits? maybe

        if(!dbConn.userIsModerator(user.getId(), sessionID)){
            response.status(1);
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
            return "Invalid Token";
        }

        if(!dbConn.sessionExists(sessionID)){
            response.status(1);
            return "session doesn't exist";
        }

        //session exits? maybe

        if(!dbConn.userIsModerator(user.getId(), sessionID)){
            response.status(1);
            return "not authorised";
        }

        String qText = dbConn.getQuestionMesasge(sessionID, qID);
        if(Objects.isNull(qText)){
            response.status(1);
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
            return "Invalid Token";
        }

        if(!dbConn.sessionExists(sessionID)){
            response.status(1);
            return "session doesn't exist";
        }

        //session exits? maybe

        if(!dbConn.userIsModerator(user.getId(), sessionID)){
            response.status(1);
            return "not authorised";
        }

        String qText = dbConn.getQuestionMesasge(sessionID, qID);
        if(Objects.isNull(qText)){
            response.status(1);
            return "no such question";
        }
        Question q = new Question(qText);

        dbConn.pushQuestion(sessionID, qID);
        App.getApp().getObservable().notifyWatchers(3, sessionID, gson.toJson(q));

        return "token="+dbConn.newToken(user.getId());
    };

}