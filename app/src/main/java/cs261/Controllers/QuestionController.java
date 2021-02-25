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
            return "Invalid Token";
        }
        //need to check user is moderator or owner
        if(!dbConn.userIsModerator(user.getId(), sessionID)){
            response.status(6969);
            return "not authorised for session "+sessionID;
        }
        Question q = new Question(question);
        dbConn.createQuestion(q, sessionID);
        response.cookie("token", dbConn.newToken(user.getId()), 3600, true, true);
        return gson.toJson(question) + sessionID;
    };

    public static Route submitResponse = (Request request, Response response) -> {
        DBConnection dbConn = App.getApp().getDbConn();

        String token = request.cookie("token");
        String sessionID = request.queryParams(":id");
        String context = request.queryParams("asnwer");
        String anon = request.queryParams("anon");
        int smiley = Integer.parseInt(request.queryParams("smiley"));
        int qID =  Integer.parseInt(request.queryParams("qID"));
        Boolean anonymous;

        User user = dbConn.getUserByToken(token);
        if(Objects.isNull(user)){
            return "Invalid Token";
        }
        LocalDateTime stamp = LocalDateTime.now();
        if(anon.equals("true")){
            anonymous = true;
        }else if(anon.equals("false")){
            anonymous = false;
        }else{
            response.status(6969);
            return "fuck off(anon mad eno sense)";
        }

        if(!dbConn.sessionExists(sessionID)){
            response.status(696);
            return "Session doesn't exist"; 
        }
        //check session exists
        //check question exists
        Answer answer = new Answer(user, smiley, context, stamp, anonymous);

        return "token="+dbConn.newToken(user.getId());
    };

    public static Route deleteQuestion = (Request request, Response response) -> {
        Map<String, Object> model = new HashMap<>();
        return "Question deleted in session "+request.params(":id");
    };

    public static Route endQuestion = (Request request, Response response) -> {
        Map<String, Object> model = new HashMap<>();
        return "question ended in session "+request.params(":id");
    };

    public static Route pushQuestion = (Request request, Response response) -> {
        Map<String, Object> model = new HashMap<>();
        return "question pushed in session "+request.params(":id");
    };

}