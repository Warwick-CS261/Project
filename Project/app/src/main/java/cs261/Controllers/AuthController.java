package cs261.Controllers;

import java.util.*;

import spark.*;
import cs261.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class AuthController{

    final static Logger logger = LoggerFactory.getLogger(AuthController.class);


    public static Route login = (Request request, Response response) -> {
        DBConnection dbConn = App.getApp().getDbConn();

        String email = request.queryParams("email");
        String pword = request.queryParams("password");
        User user = dbConn.verifyPassword(email, pword);
        if(Objects.isNull(user)){
            response.status(455);
            System.out.println(email+" "+pword);
            logger.warn("User with email: doesn't exist or incorrect password", email);
            return "Incorrect email or password";
        }else{
            String token = dbConn.newToken(user.getId());
            logger.info("User with email: {} succefully logged in", email);
            return "token=" + token;
        }
    };

    public static Route register =(Request request, Response response) -> {
        DBConnection dbConn = App.getApp().getDbConn();
        String email = request.queryParams("email");//verify formart
        String fname = request.queryParams("fname");
        String lname = request.queryParams("lname");
        String password = request.queryParams("password");
        String rpassword = request.queryParams("rpassword");
        
        if(!password.equals(rpassword)){
            response.status(453);
            logger.info("User with email {} attempted to make an account bu their passwords did not match", email);
            return "no macth";
        }else if(dbConn.emailExists(email)){
            response.status(452);
            logger.info("User with email: {} already exists", email);
            return "email already exists";
        }else{
            User user = new User(fname, lname, email);
            dbConn.createUser(user, password, "salt");
            user  = dbConn.getUserByEmail(email);
            logger.info("Created bew user with email: {}", email);
            return "token="+dbConn.newToken(user.getId());
        }
    };

    public static Route logout =(Request request, Response response) -> {
        DBConnection dbConn = App.getApp().getDbConn();
        String token = request.cookie("token");
        dbConn.expireToken(token);
        return "Token expired";
    };

}