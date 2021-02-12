package cs261.Controllers;

import java.util.*;

import spark.*;

import cs261.*;

import com.google.gson.Gson;

public class QuestionController{

    private static Gson gson = new Gson();

    public static Route createQuestion = (Request request, Response response) -> {
        DBConnection dbConn = App.getApp().getDbConn();

        String sessionID = request.params(":id");
        String token = request.queryParams("token");
        String question = request.queryParams("question");
        User user = dbConn.getUserByToken(token);
        if(Objects.isNull(user)){
            return "Invalid Token";
        }
        //need to check user is moderator or owner
        if(dbConn.userIsModerator(user.getId(), sessionID)){
            Question q = new Question(question);
            dbConn.createQuestion(q, sessionID);
            return gson.toJson(question) + sessionID;
        }
        return "not authorised for session "+sessionID;
    };

    public static Route submitResponse = (Request request, Response response) -> {
        Map<String, Object> model = new HashMap<>();
        return "response submitted to question in session "+request.params(":id");
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