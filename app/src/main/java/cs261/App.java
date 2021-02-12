package cs261;

import static spark.Spark.*;
import spark.*;
import java.util.*;

import cs261.Controllers.*;

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
            post("/login", AuthController.login);
            post("/register", AuthController.register);
            post("/logout", AuthController.logout);
        });

        path("/session", () -> {
            post("/create", SessionController.createSession);
            post("/user", SessionController.userSessions);

            path("/:id", () -> {
                post("/chat", SessionController.submitMessage);
                post("/addHost", SessionController.addHost);
                post("/join", SessionController.joinSession);
                post("/end", SessionController.endSession);
                post("/delete", SessionController.deleteSession);
                post("/refresh", SessionController.refreshSession);

                path("/question", () -> {
                    post("/create", QuestionController.createQuestion);
                    post("/submit", QuestionController.submitResponse);
                    post("/delete", QuestionController.deleteQuestion);
                    post("/end", QuestionController.endQuestion);
                    post("/push", QuestionController.pushQuestion);
                });
            });
        });
    }









}


