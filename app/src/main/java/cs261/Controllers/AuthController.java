package cs261.Controllers;

import java.util.*;

import spark.*;
import cs261.*;

public class AuthController{

    public static Route login = (Request request, Response response) -> {
        DBConnection dbConn = App.getApp().getDbConn();

        String email = request.queryParams("email");
        String pword = request.queryParams("password");
        User user = dbConn.verifyPassword(email, pword);
        if(Objects.isNull(user)){
            response.status(455);
            return "Incorrect email or password";
        }else{
            return "token="+dbConn.newToken(user.getId());
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
            return "no macth";
        }else if(dbConn.emailExists(email)){
            response.status(452);
            return "email already exists";
        }else{
            User user = new User(fname, lname, email);
            dbConn.createUser(user, password, "salt");
            user  = dbConn.getUserByEmail(email);
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