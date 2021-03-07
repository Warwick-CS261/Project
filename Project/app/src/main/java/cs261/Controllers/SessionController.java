package cs261.Controllers;

import java.util.*;

import spark.*;

import cs261.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.Gson;

public class SessionController{

    private static Gson gson = new Gson();
    final static Logger logger = LoggerFactory.getLogger(AuthController.class);

    public static Route createSession = (Request request, Response response) -> {
        DBConnection dbConn = App.getApp().getDbConn();

        String name = request.queryParams("name");
        String token = request.cookie("token");
        Boolean secure = Boolean.parseBoolean(request.queryParamOrDefault("secure", "false"));
        String seriesID =  request.queryParams("series");


        User user = dbConn.getUserByToken(token);
        //token is valid
        if(Objects.isNull(user)){
            response.status(450);
            logger.warn("Session creation attempted with invalid token: {}", token);
            return "Invalid Token";
        }
        String sessionID;
        //generate new unique session ID
        do{
            sessionID = Sesh.generateID();
        }while(dbConn.sessionExists(sessionID));
        HostSesh hostSession;
        if(secure){
            hostSession = new HostSesh(sessionID, seriesID, name, user, Sesh.generateID());
        }else{
            hostSession = new HostSesh(sessionID, seriesID, name, user, "");
        }

        
        //add session to db
        dbConn.createSession(hostSession);
        App.getApp().getCacher().addModerator(user, sessionID);
        return "token="+dbConn.newToken(user.getId())+","+gson.toJson(hostSession);
    };

    

    public static Route userSessions = (Request request, Response response) -> {
        DBConnection dbConn = App.getApp().getDbConn();

        String token = request.cookie("token");
        
        User user = dbConn.getUserByToken(token);
        //token is valid
        if(Objects.isNull(user)){
            response.status(450);
            logger.warn("Get user sessions attempted with invalid token: {}", token);
            return "Invalid Token";
        }
        return gson.toJson(dbConn.getUserSessions(user.getId()));

    };



    public static Route submitMessage = (Request request, Response response) -> {
        DBConnection dbConn = App.getApp().getDbConn();

        String sessionID = request.params(":id");
        String token = request.cookie("token");
        String msg = request.queryParamOrDefault("message", "");
        Boolean anon = Boolean.parseBoolean(request.queryParamOrDefault("anon", "false"));
        Date date = new Date();       

        if(msg.equals("")){
            response.status(457);
            return "empty message";
        }

        User user = dbConn.getUserByToken(token);
        if(Objects.isNull(user)){
            response.status(450);
            logger.warn("Message submit to session {} attempted with invalid token: {}",sessionID, token);
            return "Invalid Token";
        }
        if(!dbConn.userIsAttendee(sessionID, user.getId())&&!dbConn.userIsModerator(user,sessionID )){
            response.status(401);
            return "not authorised for session";
        }

        Message message = new Message(user, msg, date, anon);
        App.getApp().getCacher().createMessage(message, sessionID);
        App.getApp().getObservable().notifyWatchers( 1, sessionID, gson.toJson(message));
        
        return "token="+dbConn.newToken(user.getId());
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
            logger.warn("Add Host to session {} attempted with invalid token: {}", sessionID,token);
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
        App.getApp().getCacher().addModerator(newMod,sessionID);
        return "token="+dbConn.newToken(user.getId());
    };



    public static Route joinSession = (Request request, Response response) -> {
        DBConnection dbConn = App.getApp().getDbConn();

        String token = request.cookie("token");
        String password = request.queryParamOrDefault("password", "");
        String sessionID = request.params(":id");
        User user = dbConn.getUserByToken(token);
        //token is valid
        if(Objects.isNull(user)){
            response.status(450);
            logger.warn("Join session {} attempted with invalid token: {}", sessionID,token);
            return "Invalid Token";
        }
        //token exists
        HostSesh session = dbConn.getHostSessionByID(sessionID);
        if(Objects.isNull(session)){
            response.status(454);
            logger.warn("User {} attempted to access session {} but it doesn't exist", user.getId(), sessionID);
            return "Invalid session";
        }

        if(dbConn.userIsModerator(user, sessionID)){
            return "token="+dbConn.newToken(user.getId())+","+gson.toJson(session);
        }

        if(dbConn.sessionEnded(sessionID)){
            response.status(457);
            return "Session has ended";
        }

        if(dbConn.userIsAttendee(sessionID, user.getId())){
            return  "token="+dbConn.newToken(user.getId())+","+gson.toJson(session.convertToSesh());
        }
        
        if(session.getSecure().equals(password)){
            dbConn.addUserToSession(sessionID, user.getId());
            return "token="+dbConn.newToken(user.getId())+","+gson.toJson(session.convertToSesh());
        }
        if(password.equals("")){
            response.status(456);
        }else{
            response.status(458);
        }
        
        return "Wrong password";
    };



    public static Route endSession = (Request request, Response response) -> {
        DBConnection dbConn = App.getApp().getDbConn();
        
        String token = request.cookie("token");
        String sessionID = request.params(":id");

        User user = dbConn.getUserByToken(token);
        //token is valid
        if(Objects.isNull(user)){
            response.status(450);
            logger.warn("End session {} attempted with invalid token: {}", sessionID,token);
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
        String sessionID = request.params(":id");

        User user = dbConn.getUserByToken(token);
        //token is valid
        if(Objects.isNull(user)){
            response.status(450);
            logger.warn("Delete session {} attempted with invalid token: {}", sessionID,token);
            return "Invalid Token";
        }

        if(!dbConn.sessionExists(sessionID)){
            response.status(454);
            logger.warn("User {} attempted to access session {} but it doesn't exist", user.getId(), sessionID);
            return "Session doesn't exist";
        }

        if(!dbConn.userIsSessionHost(user.getId(), sessionID)){
            response.status(401);
            return "No permission";
        }
        return "token="+dbConn.newToken(user.getId());
    };

    //Could cause problems with tokens, however it shouldn't
    //but a token may be used twice (acceptable?)
    public static Route watchSession = (Request request, Response response) -> {
        DBConnection dbConn = App.getApp().getDbConn();

        String token = request.cookie("token");
        String sessionID = request.queryParams(":id");
        
        User user = dbConn.getUserByToken(token);
        //token is valid
        if(Objects.isNull(user)){
            response.status(450);
            logger.warn("Watch session {} attempted with invalid token: {}", sessionID,token);
            return "Invalid Token";
        }

        if(!dbConn.sessionExists(sessionID)){
            response.status(454);
            logger.warn("User {} attempted to access session {} but it doesn't exist", user.getId(), sessionID);
            return "Session doesn't exist";
        }

        if(!dbConn.userIsAttendee(sessionID, user.getId() )){
            response.status(2);
            return "not authorised";
        }

        
        Watcher w = new Watcher();
        String json = w.watch(sessionID); 

        //return json string
        return json;
    };
}