package cs261;

import java.io.*;
import org.apache.commons.exec.*;

public class Analyse {

    public float parseText(String str) throws Exception{
        String line = "python3 " + "src/main/python/main.py "+"'"+str+"'";
        CommandLine cmdLine = CommandLine.parse(line);
            
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        PumpStreamHandler streamHandler = new PumpStreamHandler(outputStream);
            
        DefaultExecutor executor = new DefaultExecutor();
        executor.setStreamHandler(streamHandler);

        int exitCode = executor.execute(cmdLine);
        return Float.parseFloat(outputStream.toString().trim());
    }

    public float newMoodCoefficient(float oldMean, float newValue, int numValues) {
        return ((oldMean * numValues) + newValue) / (numValues + 1);
    }

}