package cs261;

import org.apache.velocity.app.*;
import spark.*;
import spark.template.velocity.*;

import java.util.*;

public class Util{
    public static String render(Map<String, Object> model, String templatePath) {
        // model.put("currentUser", getSessionCurrentUser(request));

        return strictVelocityEngine().render(new ModelAndView(model, templatePath));
    }

    private static VelocityTemplateEngine strictVelocityEngine() {
        VelocityEngine configuredEngine = new VelocityEngine();
        configuredEngine.setProperty("runtime.references.strict", true);
        configuredEngine.setProperty("resource.loader", "class");
        configuredEngine.setProperty("class.resource.loader.class", "org.apache.velocity.runtime.resource.loader.ClasspathResourceLoader");
        return new VelocityTemplateEngine(configuredEngine);
    }
    
}
//https://sparkjava.com