package cs261;

import java.io.*;
import javax.script.*;

public class Analyse {

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
        engine.eval(new FileReader("src/main/python/runner.py"));
    
        //System.out.println(writer.toString().trim());
    }

    public static String parseText(String str) throws Exception {
        return inv.invokeFunction("func1", str).toString();
    }

    public float newMoodCoefficient(float oldMean, float newValue, int numValues) {
        return ((oldMean * numValues) + newValue) / (numValues + 1);
    }

}