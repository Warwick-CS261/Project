package cs261;

import static spark.Spark.*;
import spark.*;
import java.util.*;

import cs261.Controllers.AuthController;

import java.io.File;
import java.io.OutputStream;
import java.nio.file.Files;

import java.net.*;

public class App {

    private DBConnection dbConn;
    public static App app;


    public DBConnection getDbConn(){
        return dbConn;
    }

    public static App getApp(){
        return app;
    }

    public static void main(String[] args) throws Exception{
        app = new App();
        
        app.run();
    }

    private void run() throws Exception{
        staticFiles.location("/static");
        port(6969);
        Class.forName("org.sqlite.JDBC");
        dbConn = new DBConnection("jdbc:sqlite:database/database.db");
        get("/", (request, reponse) -> "Landing Page");

        path("/auth", () -> {
            post("/login", login);
            post("/register", register);
            post("/logout", logout);
        });

        path("/session", () -> {
            post("/create", createSession);
            post("/user", userSessions);

            path("/:id", () -> {
                post("/chat", submitMessage);
                post("/addHost", addHost);
                post("/join", joinSession);
                post("/end", endSession);
                post("/delete", deleteSession);
                post("/refresh", refreshSession);

                path("/question", () -> {
                    post("/create", createQuestion);
                    post("/submit", submitResponse);
                    post("/delete", deleteQuestion);
                    post("/end", endQuestion);
                    post("/push", pushQuestion);
                });
            });
        });
    }

    public static Route login = (Request request, Response response) -> {
        Map<String, Object> model = new HashMap<>();
        return "logged in";
    };

    public static Route register =(Request request, Response response) -> {
        return "registered";
    };

    public static Route logout =(Request request, Response response) -> {
        return "logout";
    };

    public static Route createSession = (Request request, Response response) -> {
        String name = request.queryParams("name");
        String token = request.queryParams("token");
        String secure = request.queryParams("secure");
        int seriesID =  Integer.parseInt(request.queryParams("series")); 
        User user =  new User(1, "f", "l", "m@m");

          getApp().getDbConn().createSession(new HostSesh(Sesh.generateID(), seriesID, name,
            user, secure));

        return "Session created";
    };

    public static Route userSessions = (Request request, Response response) -> {
        Map<String, Object> model = new HashMap<>();
        return "The User's session";
    };

    public static Route submitMessage = (Request request, Response response) -> {
        Map<String, Object> model = new HashMap<>();
        return "Message Submitted to session "+request.params(":id");
    };

    public static Route addHost = (Request request, Response response) -> {
        Map<String, Object> model = new HashMap<>();
        return "Host Added to session "+request.params(":id");
    };

    public static Route joinSession = (Request request, Response response) -> {
        Map<String, Object> model = new HashMap<>();
        return "Session "+request.params(":id") +" joined";
    };

    public static Route endSession = (Request request, Response response) -> {
        Map<String, Object> model = new HashMap<>();
        return "Session Ended";
    };

    public static Route deleteSession = (Request request, Response response) -> {
        Map<String, Object> model = new HashMap<>();
        return "Session "+request.params(":id") +" Deleted";
    };

    public static Route refreshSession = (Request request, Response response) -> {
        Map<String, Object> model = new HashMap<>();
        return "Session "+request.params(":id") +" refreshed";
    };

    public static Route createQuestion = (Request request, Response response) -> {
        Map<String, Object> model = new HashMap<>();
        return "Question created in session "+request.params(":id");
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


