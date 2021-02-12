package cs261.Controllers;

import java.util.*;

import spark.*;

import cs261.*;

public class QuestionController{

    public static Route createQuestion = (Request request, Response response) -> {
        String sessionID = request.params(":id");
        String token = request.queryParams("token");
        String question = request.queryParams("question");
        App.getApp().getDbConn().createQuestion(new Question(question), sessionID);
        return "Question created in session "+sessionID;
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