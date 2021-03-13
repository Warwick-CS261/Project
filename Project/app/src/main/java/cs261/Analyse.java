package cs261;

import java.io.*;
import org.apache.commons.exec.*;

public class Analyse {

    public float parseText(String str) {
        try {
            String line = "python3 " + "src/main/python/main.py " + "'" + str + "'";
            CommandLine cmdLine = CommandLine.parse(line);

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            PumpStreamHandler streamHandler = new PumpStreamHandler(outputStream);

            DefaultExecutor executor = new DefaultExecutor();
            executor.setStreamHandler(streamHandler);

            int exitCode = executor.execute(cmdLine);
            if (exitCode != 0) {
                throw new Exception();
            }
            return Float.parseFloat(outputStream.toString().trim());
        } catch (Exception e) {
            e.printStackTrace();
        }
        return (float) 0.0;

    }

    public float newMoodCoefficient(float oldMean, float newValue, int numValues) {
        return ((oldMean * numValues) + newValue) / (numValues + 1);
    }

    public float analyseResponse(int smiley, float textValue) {

        int smileyValue = smiley - 2;

        /*
         * 
         * Case 1: Smiley positive and text very positive Case 2: Smiley positive and
         * text neutral to slightly positive Case 3: Smiley positive and text negative
         * 
         * Case 4: Smiley negative and text very negative Case 5: Smiley negative and
         * text neutral to slightly negative Case 6: Smiley negative and text positive
         * 
         * Case 7: Smiley neutral and text very positive case 8: Smiley neutral and text
         * very negative Case 9: Smiley neutral and text slightly positive case 10:
         * Smiley neutral and text slightly negative
         * 
         */

        // Case 1 + Case 4
        if ((smileyValue < 0 && textValue < -0.3) || (smileyValue > 0 && textValue > 0.3)) {
            return textValue;
        }

        // Case 2 + Case 5
        if ((smileyValue < 0 && textValue > -0.3 && textValue <= 0)
                || (smileyValue > 0 && textValue < 0.3 && textValue >= 0)) {
            return textValue * 2;
        }

        // Case 3 + 6
        if ((smileyValue < 0 && textValue > 0) || (smileyValue > 0 && textValue < 0)) {
            return smileyValue - textValue;
        }

        if (smileyValue == 0) {
            // Case 7 + 8
            if (textValue > 0.3 || textValue < -0.3)
                return textValue / 3;
            // Case 9 + 10
            else
                return textValue;
        }

        return 0;
    }

}