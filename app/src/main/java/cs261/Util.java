package cs261;

import spark.*;
import spark.template.velocity.*;
import java.util.*;

public class Util{
    public static String render(Map<String, Object> model, String templatePath){
        return new VelocityTemplateEngine().render(new ModelAndView(model, templatePath));
    }
    
}
//https://sparkjava.com