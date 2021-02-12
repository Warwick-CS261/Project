package cs261.Controllers;

import java.util.*;

import spark.*;
import cs261.*;

public class AuthController{

    public static Route login = (Request request, Response response) -> {
        Map<String, Object> model = new HashMap<>();
        return "logged in";
    };

    public static Route register =(Request request, Response response) -> {
        return "registered";
    };

    public static Route logout =(Request request, Response response) -> {
        return "logout";
    };

}