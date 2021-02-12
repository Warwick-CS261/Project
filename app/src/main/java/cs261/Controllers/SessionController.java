package cs261.Controllers;

import java.util.*;

import spark.*;

import cs261.*;

import com.google.gson.Gson;

public class SessionController{

    private static Gson gson = new Gson();

    public static Route createSession = (Request request, Response response) -> {
        DBConnection dbConn = App.getApp().getDbConn();

        String name = request.queryParams("name");
        String token = request.queryParams("token");
        String secure = request.queryParams("secure");
        int seriesID =  Integer.parseInt(request.queryParams("series"));


        User user = dbConn.getUserByToken(token);
        //token is valid
        if(Objects.isNull(user)){
            return "Invalid Token";
        }
        String sessionID;
        //generate new unique session ID
        do{
            sessionID = Sesh.generateID();
        }while(dbConn.sessionExists(sessionID));

        if(secure.equals("true")){
            secure = Sesh.generateID();
        }else if(secure.equals("false")){
            secure = null;
        }else{
            return "fuck off(invalid secure)";
        }

        HostSesh session = new HostSesh(sessionID, seriesID, name, user, secure);
        //add session to db
        dbConn.createSession(session);
        dbConn.addModerator(user.getId(), sessionID);
        
        return gson.toJson(session)+"{\"token\":\""+dbConn.newToken(user.getId())+"\"}";
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
        DBConnection dbConn = App.getApp().getDbConn();

        String token = request.queryParams("token");
        String password = request.queryParams("password");
        String sessionID = request.queryParams(":id");

        Sesh session = dbConn.getSessionByID(sessionID);
        if(Objects.isNull(session)){
            return "invalid session";
        }

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