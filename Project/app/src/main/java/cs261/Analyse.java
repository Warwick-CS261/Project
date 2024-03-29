package cs261;

import java.io.*;
import org.apache.commons.exec.*;

public class Analyse {

    /**
     * A function that takes a string and passes it to the python semantic analysis script.
     * @param str the string to be passed to python
     * @return the float value the python script returns
     */
    public float parseText(String str) {
        try {
            String line = "python3 " + "src/main/python/main.py " + "\"" + str + "\"";
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

    /**
     * A function to calculate a new mean from float inputs
     * @param oldMean the old mean
     * @param newValue the new value to be added in
     * @param numValues the number of values currently in
     * @return the new mean
     */
    public float newMoodCoefficient(float oldMean, float newValue, int numValues) {
        return ((oldMean * numValues) + newValue) / (numValues + 1);
    }

    /**
     * A function that balances the sentiment between the text parser and the Smiley responce
     * @param smiley the value of the reaction
     * @param textValue the value of the text analysis
     * @return the overall sentiment
     */
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