package cs261;

import static spark.Spark.*;
import spark.*;
import java.util.*;

import cs261.Controllers.*;

public class App {

    static int port = 4000;
    static String address = "86.30.228.94";
    private DBConnection dbConn;
    private Obserable observable;
    private Analyse analyse;
    private Cacher cacher;
    public static App app;

    public Analyse getAnalyse() {
        return analyse;
    }

    public DBConnection getDbConn() {
        return dbConn;
    }

    public static App getApp() {
        return app;
    }

    public Obserable getObservable() {
        return observable;
    }

    public Cacher getCacher() {
        return cacher;
    }

    public int getPort() {
        return port;
    }

    public static void main(String[] args) throws Exception {
        app = new App();

        app.run();
    }

    private void run() throws Exception {

        staticFiles.location("/static");
        port(port);
        Class.forName("org.sqlite.JDBC");
        dbConn = new DBConnection("jdbc:sqlite:database/database.db");
        observable = new Obserable();
        analyse = new Analyse();
        // System.out.println(analyse.parseText("this app is better than facebook"));
        cacher = new Cacher(dbConn);

        get("/", returnPage);
        get("/user", returnPage);
        post("/user", AuthController.userDetails);

        path("/auth", () -> {
            post("/login", AuthController.login);
            post("/register", AuthController.register);
            post("/logout", AuthController.logout);
            get("/login", returnPage);
            get("/register", returnPage);
        });

        path("/session", () -> {
            post("/create", SessionController.createSession);
            post("/user", SessionController.userSessions);

            get("/create", returnPage);
            get("/user", returnPage);
            get("/join", returnPage);
            get("/session/host", returnPage);
            post("/:id", SessionController.joinSession);
            get("/:id", returnPage);

            path("/:id", () -> {
                post("/chat", SessionController.submitMessage);
                post("/addHost", SessionController.addHost);
                // post("/join", SessionController.joinSession);
                post("/end", SessionController.endSession);
                post("/delete", SessionController.deleteSession);
                post("/watch", SessionController.watchSession);
                post("/clone", SessionController.copySession);
                // get("/join", returnPage);

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

    public static Route returnPage = (Request request, Response response) -> {
        Map<String, Object> model = new HashMap<>();
        model.put("address", address + ":" + port);
        return Util.render(model, "velocity/index.vm");
    };
}
