package cs261.Controllers;

import java.util.*;

import com.google.gson.Gson;

import spark.*;
import cs261.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import static org.apache.commons.lang.StringEscapeUtils.escapeHtml;
import org.apache.commons.exec.*;

public class AuthController {

    private static Gson gson = new Gson();
    final static Logger logger = LoggerFactory.getLogger(AuthController.class);

    public static Route login = (Request request, Response response) -> {
        DBConnection dbConn = App.getApp().getDbConn();

        String email = escapeHtml(request.queryParams("email"));
        String pword = escapeHtml(request.queryParams("password"));

        // REGEX EMAIL
        try {
            User user = dbConn.verifyPassword(email, pword);

            // cerifies that email password combination existed
            if (Objects.isNull(user)) {
                response.status(455);
                System.out.println(email + " " + pword);
                logger.warn("User with email: doesn't exist or incorrect password", email);
                return "Incorrect email or password";
            }

            // Success returns token
            logger.info("User with email: {} succefully logged in", email);
            return "{\"token\":\"" + dbConn.newToken(user.getId()) + "\",\"user\":" + gson.toJson(user) + "}";
        } catch (Exception e) {
            logger.warn("Encountered an exception trying to create a question, message as follows: \n{}",
                    e.getMessage());
        }
        response.status(459);
        return "Couldn't peform this operation";
    };

    public static Route register = (Request request, Response response) -> {
        DBConnection dbConn = App.getApp().getDbConn();
        // gets params
        String email = escapeHtml(request.queryParams("email"));
        String fname = escapeHtml(request.queryParams("fname"));
        String lname = escapeHtml(request.queryParams("lname"));
        String password = escapeHtml(request.queryParams("password"));
        String rpassword = escapeHtml(request.queryParams("rpassword"));

        // REGEX EMAIL
        // REGEX PASSWORD
        try {
            // verifies passwords match
            if (!password.equals(rpassword)) {
                response.status(453);
                logger.info("User with email {} attempted to make an account but their passwords did not match", email);
                return "No match";
            }

            // verifies unique email
            if (dbConn.emailExists(email)) {
                response.status(452);
                logger.info("User with email: {} already exists", email);
                return "Email already exists";
            }

            // success, create user and return token
            User user = new User(fname, lname, email);
            dbConn.createUser(user, password, "salt");
            user = dbConn.getUserByEmail(email);
            logger.info("Created bew user with email: {}", email);
            return "{\"token\":\"" + dbConn.newToken(user.getId()) + "\",\"user\":" + gson.toJson(user) + "}";

        } catch (Exception e) {
            logger.warn("Encountered an exception trying to create a question, message as follows: \n{}",
                    e.getMessage());
        }
        response.status(459);
        return "Couldn't peform this operation";

    };

    public static Route logout = (Request request, Response response) -> {
        DBConnection dbConn = App.getApp().getDbConn();
        // gets token
        String token = escapeHtml(request.cookie("token"));
        try {
            // expires token
            dbConn.expireToken(token);
            return "Token expired";
        } catch (Exception e) {
            logger.warn("Encountered an exception trying to create a question, message as follows: \n{}",
                    e.getMessage());
        }
        response.status(459);
        return "Couldn't peform this operation";
    };

    public static Route userDetails = (Request request, Response response) -> {
        DBConnection dbConn = App.getApp().getDbConn();
        // gets token
        String token = request.cookie("token");
        try {
            // verifies token and gets user
            User user = dbConn.getUserByToken(token);

            if (Objects.isNull(user)) {
                response.status(450);
                logger.warn("Tried to get user details with invalid token {}", token);
                return "Invalid Token";
            }

            // returns new token and user data
            return "{\"token\":\"" + dbConn.newToken(user.getId()) + "\",\"user\":" + gson.toJson(user) + "}";
        } catch (Exception e) {
            logger.warn("Encountered an exception trying to create a question, message as follows: \n{}",
                    e.getMessage());
        }
        response.status(459);
        return "Couldn't peform this operation";
    };

}