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
        String token = request.cookie("token");
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
        return "token="+dbConn.newToken(user.getId())+","+gson.toJson(session);
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
        DBConnection dbConn = App.getApp().getDbConn();

        String token = request.cookie("token");
        String sessionID = request.queryParams(":id");
        String email = request.queryParams("email");

        User user = dbConn.getUserByToken(token);
        //token is valid
        if(Objects.isNull(user)){
            return "Invalid Token";
        }
        //Checks if user requesting is host
        if(!dbConn.userIsSessionHost(user.getId(), sessionID)){
            return "No Permission";
        }
        //Gets new mod and checks exists
        User newMod = dbConn.getUserByEmail(email);
        if(Objects.isNull(newMod)){
            return "No user with that email exists";
        }
        //all checks past and success
        dbConn.addModerator(newMod.getId(),sessionID);
        return "token="+dbConn.newToken(user.getId());
    };



    public static Route joinSession = (Request request, Response response) -> {
        DBConnection dbConn = App.getApp().getDbConn();

        String token = request.cookie("token");
        String password = request.queryParams("password");
        String sessionID = request.queryParams(":id");

        User user = dbConn.getUserByToken(token);
        //token is valid
        if(Objects.isNull(user)){
            return "Invalid Token";
        }
        //token exists
        Sesh session = dbConn.getSessionByID(sessionID);
        if(Objects.isNull(session)){
            return "Invalid session";
        }
        if(dbConn.sessionEnded(sessionID)){
            return "Session has ended";
        }
        if(!dbConn.getSessionPassword(sessionID).equals(password)){
            return "Wrong password";
        }
        if(!dbConn.userIsAttendee(sessionID, user.getId())){
            dbConn.addUserToSession(sessionID, user.getId());
        }
        return  "token="+dbConn.newToken(user.getId())+","+gson.toJson(session);
    };



    public static Route endSession = (Request request, Response response) -> {
        DBConnection dbConn = App.getApp().getDbConn();
        
        String token = request.cookie("token");
        String sessionID = request.queryParams(":id");

        User user = dbConn.getUserByToken(token);
        //token is valid
        if(Objects.isNull(user)){
            return "Invalid Token";
        }

        if(!dbConn.userIsSessionHost(user.getId(), sessionID)){
            return "No permission";
        }

        if(dbConn.sessionEnded(sessionID)){
            return "Already ended";
        }
        dbConn.endSession(sessionID);
        return "token="+dbConn.newToken(user.getId());
    };

    public static Route deleteSession = (Request request, Response response) -> {
        DBConnection dbConn = App.getApp().getDbConn();

        String token = request.cookie("token");
        String sessionID = request.queryParams(":id");

        if(!dbConn.sessionExists(sessionID)){
            return "Session doesn't exist";
        }

        User user = dbConn.getUserByToken(token);
        //token is valid
        if(Objects.isNull(user)){
            return "Invalid Token";
        }

        if(!dbConn.userIsSessionHost(user.getId(), sessionID)){
            return "No permission";
        }
        return "token="+dbConn.newToken(user.getId());
    };

    public static Route refreshSession = (Request request, Response response) -> {
        Map<String, Object> model = new HashMap<>();
        return "Session "+request.params(":id") +" refreshed";
    };

}