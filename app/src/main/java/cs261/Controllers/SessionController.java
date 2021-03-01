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
        String seriesID =  request.queryParams("series");


        User user = dbConn.getUserByToken(token);
        //token is valid
        if(Objects.isNull(user)){
            response.status(450);
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
            response.status(457);
            return "fuck off(invalid secure)";
        }

        HostSesh hostSession = new HostSesh(sessionID, seriesID, name, user, secure);
        //add session to db
        dbConn.createSession(hostSession);
        dbConn.addModerator(user.getId(), sessionID);
        return "token="+dbConn.newToken(user.getId())+","+gson.toJson(hostSession);
    };

    

    public static Route userSessions = (Request request, Response response) -> {
        DBConnection dbConn = App.getApp().getDbConn();

        String token = request.cookie("token");

        User user = dbConn.getUserByToken(token);
        //token is valid
        if(Objects.isNull(user)){
            response.status(450);
            return "Invalid Token";
        }
        return "x";

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
            response.status(450);
            return "Invalid Token";
        }
        //Checks if user requesting is host
        if(!dbConn.userIsSessionHost(user.getId(), sessionID)){
            response.status(401);
            return "No Permission";
        }
        //Gets new mod and checks exists
        User newMod = dbConn.getUserByEmail(email);
        if(Objects.isNull(newMod)){
            response.status(454);
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
            response.status(450);
            return "Invalid Token";
        }
        //token exists
        HostSesh session = dbConn.getHostSessionByID(sessionID);
        if(Objects.isNull(session)){
            response.status(454);
            return "Invalid session";
        }

        if(dbConn.userIsModerator(user.getId(), sessionID)){
            return "token="+dbConn.newToken(user.getId())+","+gson.toJson(session);
        }

        if(dbConn.sessionEnded(sessionID)){
            response.status(457);
            return "Session has ended";
        }

        if(dbConn.userIsAttendee(sessionID, user.getId())){
            return  "token="+dbConn.newToken(user.getId())+","+gson.toJson(session.convertToSesh());
        }

        if(session.getSecure().equals(password)||session.getSecure().equals("")){
            return "token="+dbConn.newToken(user.getId())+","+gson.toJson(session.convertToSesh());
        }

        response.status(456);
        return "Wrong password";
    };



    public static Route endSession = (Request request, Response response) -> {
        DBConnection dbConn = App.getApp().getDbConn();
        
        String token = request.cookie("token");
        String sessionID = request.queryParams(":id");

        User user = dbConn.getUserByToken(token);
        //token is valid
        if(Objects.isNull(user)){
            response.status(450);
            return "Invalid Token";
        }

        if(!dbConn.userIsSessionHost(user.getId(), sessionID)){
            response.status(401);
            return "No permission";
        }

        if(dbConn.sessionEnded(sessionID)){
            response.status(457);
            return "Already ended";
        }
        dbConn.endSession(sessionID);
        response.cookie("token", dbConn.newToken(user.getId()), 3600, false, true);
        return "Session Ended";
    };

    public static Route deleteSession = (Request request, Response response) -> {
        DBConnection dbConn = App.getApp().getDbConn();

        String token = request.cookie("token");
        String sessionID = request.queryParams(":id");

        if(!dbConn.sessionExists(sessionID)){
            response.status(454);
            return "Session doesn't exist";
        }

        User user = dbConn.getUserByToken(token);
        //token is valid
        if(Objects.isNull(user)){
            response.status(450);
            return "Invalid Token";
        }

        if(!dbConn.userIsSessionHost(user.getId(), sessionID)){
            response.status(401);
            return "No permission";
        }
        return "token="+dbConn.newToken(user.getId());
    };
}