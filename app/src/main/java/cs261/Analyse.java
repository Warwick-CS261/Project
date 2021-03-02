package cs261;

import java.io.*;
import javax.script.*;

public class Analyse {
<<<<<<< Updated upstream

    public static void main(String[] args) {
        // For Testing
    }

    public float parseText(String data) {
        // Call Python Script
=======

    public static Invocable inv;

    public static void main(String[] args) {
        try {
            init();
        } catch(Exception e) {
            e.printStackTrace();
        }
    }

    public static void init() throws Exception {
        // All outputs from the python file are written to this StringWriter
        StringWriter writer = new StringWriter();
        ScriptContext context = new SimpleScriptContext();
        context.setWriter(writer);
    
        // The engine to interpret the python scripts
        ScriptEngine engine = new ScriptEngineManager().getEngineByName("python");
        engine.setContext(context);
    
        // An object to interact with python functions
        inv = (Invocable) engine;
    
        // Execute the python script
        engine.eval(new FileReader("main.py"));
    
        //System.out.println(writer.toString().trim());
    }

    public static String callScript(String str) throws Exception {
        return inv.invokeFunction("func1", str).toString();
    }

    public float parseText(String data) {
>>>>>>> Stashed changes

        return 0.5f;
    }

    public static String scriptRun() throws Exception {
        
        StringWriter writer = new StringWriter();
        ScriptContext context = new SimpleScriptContext();
        context.setWriter(writer);

        // The engine to interpret the python scripts
        ScriptEngine engine = new ScriptEngineManager().getEngineByName("python");
        engine.setContext(context);

        // An object to interact with python functions
        Invocable invocable = (Invocable) engine;

        // Execute the python script
        try {
            engine.eval(new FileReader("src/main/python/analyse.py"));
        } catch (Exception e) {
            e.printStackTrace();
        }

        return invocable.invokeFunction("func1", "Hello World!").toString();

    }

    public float newMoodCoefficient(float oldMean, float newValue, int numValues) {
        return ((oldMean * numValues) + newValue) / (numValues + 1);
    }

}