package cs261;

import java.io.*;
import javax.script.*;

public class Analyse {

    private Invocable inv;


    public Analyse(){
        try {
            init();
        } catch(Exception e) {
            e.printStackTrace();
        }
    }


    private void init() throws Exception {
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

    public float parseText(String str) throws Exception {
        String val = inv.invokeFunction("func1", str).toString();
        return Float.parseFloat(val);
    }

    public float newMoodCoefficient(float oldMean, float newValue, int numValues) {
        return ((oldMean * numValues) + newValue) / (numValues + 1);
    }

}