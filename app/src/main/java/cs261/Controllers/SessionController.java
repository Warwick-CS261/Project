package cs261.Controllers;

import java.util.*;

import spark.*;

import cs261.*;

public class SessionController{

    public static Route createSession = (Request request, Response response) -> {
        String name = request.queryParams("name");
        String token = request.queryParams("token");
        String secure = request.queryParams("secure");
        int seriesID =  Integer.parseInt(request.queryParams("series")); 
        User user =  new User(1, "f", "l", "m@m");

        App.getApp().getDbConn().createSession(new HostSesh(Sesh.generateID(), seriesID, name,
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

}