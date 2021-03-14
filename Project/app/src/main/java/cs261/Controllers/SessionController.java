package cs261.Controllers;

import java.util.*;

import spark.*;

import cs261.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.Gson;
import static org.apache.commons.lang.StringEscapeUtils.escapeHtml;

public class SessionController {

    private static Gson gson = new Gson();
    final static Logger logger = LoggerFactory.getLogger(AuthController.class);

    public static Route createSession = (Request request, Response response) -> {
        DBConnection dbConn = App.getApp().getDbConn();
        Cacher cacher = App.getApp().getCacher();
        // gets params
        String name = escapeHtml(request.queryParams("name"));
        String token = escapeHtml(request.cookie("token"));
        try {
            Boolean secure = Boolean.parseBoolean(request.queryParamOrDefault("secure", "false"));
            String seriesID = request.queryParams("series");

            // verifies user exists
            User user = dbConn.getUserByToken(token);
            // token is valid
            if (Objects.isNull(user)) {
                response.status(450);
                logger.warn("Session creation attempted with invalid token: {}", token);
                return "Invalid Token";
            }

            // generate new unique session ID
            String sessionID;
            do {
                sessionID = Sesh.generateID();
            } while (dbConn.sessionExists(sessionID));

            // creates the session
            HostSesh hostSession;
            if (secure) {
                // generates password if session should be secure
                hostSession = new HostSesh(sessionID, seriesID, name, user, Sesh.generateID());
            } else {
                // creates session with empty password if not secure
                hostSession = new HostSesh(sessionID, seriesID, name, user, "");
            }

            // add session to db
            dbConn.createSession(hostSession);
            // creates default question
            cacher.createQuestion(new Question("", true, true), sessionID);
            // adds host as moderator
            cacher.addModerator(user, sessionID);

            // returns new token, watch token and session json
            return "{\"token\":\"" + dbConn.newToken(user.getId()) + "\",\"watchToken\":\""
                    + dbConn.newWatchToken(user.getId()) + "\",\"session\":"
                    + gson.toJson(cacher.getHostSessionByID(sessionID)) + "}";
        } catch (Exception e) {
            logger.warn("Encountered an exception trying to create a session, message as follows: \n{}",
                    e.getMessage());
        }
        response.status(459);
        return "Couldn't peform this operation";
    };

    public static Route userSessions = (Request request, Response response) -> {
        DBConnection dbConn = App.getApp().getDbConn();

        // gets params
        String token = escapeHtml(request.cookie("token"));
        try {
            // gets user and verifies token
            User user = dbConn.getUserByToken(token);
            // token is valid
            if (Objects.isNull(user)) {
                response.status(450);
                logger.warn("Get user sessions attempted with invalid token: {}", token);
                return "Invalid Token";
            }

            // returns new token and series containing all the user's sessions, host and not
            // host
            return "{\"token\":\"" + dbConn.newToken(user.getId()) + "\",\"series\":"
                    + gson.toJson(dbConn.getUserSessions(user.getId())) + "}";
        } catch (Exception e) {
            logger.warn("Encountered an exception trying to get user sessions, message as follows: \n");
            e.printStackTrace();
        }
        response.status(459);
        return "Couldn't peform this operation";
    };

    public static Route submitMessage = (Request request, Response response) -> {
        DBConnection dbConn = App.getApp().getDbConn();
        Cacher cacher = App.getApp().getCacher();
        // gets params
        String sessionID = escapeHtml(request.params(":id"));
        String token = escapeHtml(request.cookie("token"));
        String msg = escapeHtml(request.queryParamOrDefault("message", ""));
        try {
            Boolean anon = Boolean.parseBoolean(request.queryParamOrDefault("anon", "false"));
            Date date = new Date();
            // checks message isn't empty
            if (msg.equals("")) {
                response.status(457);
                return "empty message";
            }

            // checks user exists
            User user = dbConn.getUserByToken(token);
            if (Objects.isNull(user)) {
                response.status(450);
                logger.warn("Message submit to session {} attempted with invalid token: {}", sessionID, token);
                return "Invalid Token";
            }

            // check user is authorised for session
            if (!dbConn.userIsAttendee(sessionID, user.getId()) && !cacher.userIsModerator(user, sessionID)) {
                response.status(401);
                return "not authorised for session";
            }

            // creates new message
            Message message = new Message(user, msg, date, anon);
            cacher.createMessage(message, sessionID);

            // notifies all watch
            App.getApp().getWatchable().notifyBoth(1, sessionID, gson.toJson(message));

            // returns new token
            return "{\"token\":\"" + dbConn.newToken(user.getId()) + "\"}";
        } catch (Exception e) {
            logger.warn("Encountered an exception trying to submit a message, message as follows: \n{}",
                    e.getMessage());
        }
        response.status(459);
        return "Couldn't peform this operation";
    };

    public static Route addHost = (Request request, Response response) -> {
        DBConnection dbConn = App.getApp().getDbConn();
        Cacher cacher = App.getApp().getCacher();

        // gets params
        String token = escapeHtml(request.cookie("token"));
        String sessionID = escapeHtml(request.params(":id"));
        String email = escapeHtml(request.queryParams("email"));
        try {
            // verifies token and gets user
            User user = dbConn.getUserByToken(token);
            if (Objects.isNull(user)) {
                response.status(450);
                logger.warn("Add Host to session {} attempted with invalid token: {}", sessionID, token);
                return "Invalid Token";
            }

            // verifies session exists
            if (!cacher.sessionExists(sessionID)) {
                response.status(454);
                logger.warn("User {} attempted to access session {} but it doesn't exist", user.getId(), sessionID);
                return "session doesn't exist";
            }

            // Checks if user requesting is host
            if (!cacher.userIsSessionHost(user, sessionID)) {
                response.status(401);
                return "No Permission";
            }

            // Gets new mod and checks if they exist
            User newMod = dbConn.getUserByEmail(email);
            if (Objects.isNull(newMod)) {
                response.status(454);
                return "No user with that email exists";
            }
            // checks they're not already a mod
            if (cacher.userIsModerator(newMod, sessionID)) {
                response.status(457);
                return "user is already a moderator";
            }

            // all checks passed and success
            cacher.addModerator(newMod, sessionID);
            // notifies all watchers
            App.getApp().getWatchable().notifyBoth(4, sessionID, gson.toJson(newMod));

            // returns new token
            return "{\"token\":\"" + dbConn.newToken(user.getId()) + "\"}";
        } catch (Exception e) {
            logger.warn("Encountered an exception trying to add a host, message as follows: \n{}", e.getMessage());
        }
        response.status(459);
        return "Couldn't peform this operation";
    };

    public static Route joinSession = (Request request, Response response) -> {
        DBConnection dbConn = App.getApp().getDbConn();
        Cacher cacher = App.getApp().getCacher();

        // gets params
        String token = escapeHtml(request.cookie("token"));
        String password = escapeHtml(request.queryParamOrDefault("password", ""));
        String sessionID = escapeHtml(request.params(":id"));
        try {
            // verifies token is valid and gets user
            User user = dbConn.getUserByToken(token);
            if (Objects.isNull(user)) {
                response.status(450);
                logger.warn("Join session {} attempted with invalid token: {}", sessionID, token);
                return "Invalid Token";
            }
            // verifies session exists and gets session
            HostSesh session = cacher.getHostSessionByID(sessionID);
            if (Objects.isNull(session)) {
                response.status(454);
                logger.warn("User {} attempted to access session {} but it doesn't exist", user.getId(), sessionID);
                return "Invalid session";
            }

            // verifies user is moderator
            if (cacher.userIsModerator(user, sessionID)) {
                return "{\"token\":\"" + dbConn.newToken(user.getId()) + "\",\"watchToken\":\""
                        + dbConn.newWatchToken(user.getId()) + "\",\"session\":" + gson.toJson(session) + "}";
            }

            // verifies session hasn't ended
            if (cacher.sessionEnded(sessionID)) {
                response.status(457);
                return "Session has ended";
            }

            // if user has previously joined session just send them session data and new
            // token nad new watch token
            if (dbConn.userIsAttendee(sessionID, user.getId())) {
                return "{\"token\":\"" + dbConn.newToken(user.getId()) + "\",\"watchToken\":\""
                        + dbConn.newWatchToken(user.getId()) + "\",\"session\":" + gson.toJson(session.convertToSesh())
                        + "}";
            }

            // if first time joining verify user has correct pasword then send session data,
            // new token and new watch token
            if (session.getSecure().equals(password)) {
                dbConn.addUserToSession(sessionID, user.getId());
                return "{\"token\":\"" + dbConn.newToken(user.getId()) + "\",\"watchToken\":\""
                        + dbConn.newWatchToken(user.getId()) + "\",\"session\":" + gson.toJson(session.convertToSesh())
                        + "}";
            }
            // verifies if password was wrong or if password is simply required
            if (password.equals("")) {
                response.status(456);
            } else {
                response.status(458);
            }

            // returns the password was wrong
            return "Wrong password";
        } catch (Exception e) {
            logger.warn("Encountered an exception trying to join a session, message as follows: \n{}", e.getMessage());
        }
        response.status(459);
        return "Couldn't peform this operation";
    };

    public static Route endSession = (Request request, Response response) -> {
        DBConnection dbConn = App.getApp().getDbConn();
        Cacher cacher = App.getApp().getCacher();

        // gets params
        String token = escapeHtml(request.cookie("token"));
        String sessionID = escapeHtml(request.params(":id"));
        try {
            // verifies token and gets user
            User user = dbConn.getUserByToken(token);
            if (Objects.isNull(user)) {
                response.status(450);
                logger.warn("End session {} attempted with invalid token: {}", sessionID, token);
                return "Invalid Token";
            }

            // verifies session exists
            if (!cacher.sessionExists(sessionID)) {
                response.status(454);
                logger.warn("User {} attempted to access session {} but it doesn't exist", user.getId(), sessionID);
                return "Invalid session";
            }

            // verifies user is a moderator
            if (!cacher.userIsModerator(user, sessionID)) {
                response.status(401);
                return "No permission";
            }

            // verifies session hasn't already been ended
            if (cacher.sessionEnded(sessionID)) {
                response.status(457);
                return "Already ended";
            }
            // ends session
            cacher.endSession(sessionID);

            // notifies all watchers that session has ended
            App.getApp().getWatchable().notifyBoth(0, sessionID, "");

            // returns new token
            return "{\"token\":\"" + dbConn.newToken(user.getId()) + "\"}";
        } catch (Exception e) {
            logger.warn("Encountered an exception trying to end a session, message as follows: \n{}", e.getMessage());
        }
        response.status(459);
        return "Couldn't peform this operation";
    };

    public static Route deleteSession = (Request request, Response response) -> {
        DBConnection dbConn = App.getApp().getDbConn();
        Cacher cacher = App.getApp().getCacher();
        // gets params
        String token = escapeHtml(request.cookie("token"));
        String sessionID = escapeHtml(request.params(":id"));
        try {
            // verifies token and gets user
            User user = dbConn.getUserByToken(token);
            if (Objects.isNull(user)) {
                response.status(450);
                logger.warn("Delete session {} attempted with invalid token: {}", sessionID, token);
                return "Invalid Token";
            }

            // verifies session exists
            if (!cacher.sessionExists(sessionID)) {
                response.status(454);
                logger.warn("User {} attempted to access session {} but it doesn't exist", user.getId(), sessionID);
                return "Session doesn't exist";
            }

            // verifies user is session host
            if (!cacher.userIsSessionHost(user, sessionID)) {
                response.status(401);
                return "No permission";
            }
            // deletes the session
            cacher.deleteSession(sessionID);

            // notifies watchers that sesison has been deleted

            App.getApp().getWatchable().notifyBoth(5, sessionID, "");

            // returns new token
            return "{\"token\":\"" + dbConn.newToken(user.getId()) + "\"}";
        } catch (Exception e) {
            logger.warn("Encountered an exception trying to delete a session, message as follows: \n{}",
                    e.getMessage());
        }
        response.status(459);
        return "Couldn't peform this operation";
    };
    public static Route copySession = (Request request, Response response) -> {
        DBConnection dbConn = App.getApp().getDbConn();
        Cacher cacher = App.getApp().getCacher();

        String token = escapeHtml(request.cookie("token"));
        String sessionID = escapeHtml(request.params(":id"));
        try {

            // verifies token and gets user
            User user = dbConn.getUserByToken(token);
            if (Objects.isNull(user)) {
                response.status(450);
                logger.warn("Clone session {} attempted with invalid token: {}", sessionID, token);
                return "Invalid Token";
            }

            HostSesh hs = cacher.getHostSessionByID(sessionID);
            // verifies session exists
            if (Objects.isNull(hs)) {
                response.status(454);
                logger.warn("User {} attempted to access session {} but it doesn't exist", user.getId(), sessionID);
                return "Session doesn't exist";
            }

            // verifies user is session host
            if (!cacher.userIsSessionHost(user, sessionID)) {
                response.status(401);
                return "No permission";
            }
            String seriesID;
            if (Objects.isNull(hs.getSeriesID())) {

                do {
                    seriesID = Sesh.generateID();
                } while (dbConn.seriesExists(seriesID));
            } else {
                seriesID = hs.getSeriesID();
            }

            cacher.setSessionSeries(sessionID, seriesID);

            String newSessionID;
            do {
                newSessionID = Sesh.generateID();
            } while (dbConn.sessionExists(newSessionID));

            String newSecure = "";
            if (!hs.getSecure().equals("")) {
                newSecure = Sesh.generateID();
            }
            HostSesh hs2 = new HostSesh(newSessionID, seriesID, new String(hs.getSessionName()), (float) 0, user, false,
                    new ArrayList<Question>(hs.getPushedQuestions()), new Chat(), newSecure,
                    new ArrayList<Question>(hs.getHiddenQuestions()), new ArrayList<MoodDate>(), new ArrayList<User>());
            dbConn.createSession(hs2);
            for (Question q : hs2.getPushedQuestions()) {
                dbConn.createQuestion(q, newSessionID);
            }
            for (Question q : hs2.getHiddenQuestions()) {
                q.setPushed(false);
                dbConn.createQuestion(q, newSessionID);
            }
            cacher.addModerator(user, newSessionID);

            return "{\"token\":\"" + dbConn.newToken(user.getId()) + "\",\"watchToken\":\""
                    + dbConn.newWatchToken(user.getId()) + "\",\"session\":" + gson.toJson(hs2) + "}";

        } catch (Exception e) {
            logger.warn("Encountered an exception trying to create a session, message as follows: \n{}",
                    e.getMessage());
        }
        response.status(459);
        return "Couldn't peform this operation";

    };

    public static Route watchSession = (Request request, Response response) -> {
        DBConnection dbConn = App.getApp().getDbConn();
        Cacher cacher = App.getApp().getCacher();
        // gets params
        String token = escapeHtml(request.cookie("token"));
        String watchToken = escapeHtml(request.cookie("watchToken"));
        String sessionID = escapeHtml(request.params(":id"));
        try {
            // verifies token and gets user
            User user = dbConn.getUserByWatchToken(watchToken);
            if (Objects.isNull(user)) {
                user = dbConn.getUserByToken(token);
                if (Objects.isNull(user)) {
                    response.status(450);
                    logger.warn("Watch session {} attempted with invalid token: {}", sessionID, watchToken);
                    return "Invalid Tokens";
                }
                response.status(250);
                logger.info("Watch token was invalid but token was not issuing two new tokens");
                return "{\"token\":\"" + dbConn.newToken(user.getId()) + "\",\"watchToken\":\""
                        + dbConn.newWatchToken(user.getId()) + "\"}";
            }

            // verifies sesison exists
            if (!cacher.sessionExists(sessionID)) {
                response.status(454);
                logger.warn("User {} attempted to access session {} but it doesn't exist", user.getId(), sessionID);
                return "Session doesn't exist";
            }

            // verifies user is authrised to watch this session
            if (!dbConn.userIsAttendee(sessionID, user.getId()) && !cacher.userIsModerator(user, sessionID)) {
                response.status(401);
                return "not authorised";
            }

            String newWatchToken = dbConn.newWatchToken(user.getId());

            // creates a new watcher
            Watcher w = new Watcher();
            String json;

            if (dbConn.userIsModerator(user, sessionID)) {
                // if user is moderaotr, watch from moderator perspective
                json = w.watch(sessionID, true);
            } else {
                // otherwise watch from attendee perspective
                json = w.watch(sessionID, false);
            }

            // set reponse type
            response.status(w.getType());

            // types of update
            String[] types = { "", ",\"message\":", ",\"question\":", ",\"answer\":", ",\"user\":", ",\"id\":",
                    ",\"question\":", ",\"qID\":" };

            // returns new watch token and the update
            return "{\"watchToken\":\"" + newWatchToken + "\"" + types[w.getType() - 230] + json + "}";
        } catch (Exception e) {
            logger.warn("Encountered an exception trying to create a session, message as follows: \n{}",
                    e.getMessage());
        }
        response.status(459);
        return "Couldn't peform this operation";
    };
}