package cs261;

import java.util.ArrayList;
import java.util.Objects;


public class HostSesh extends Sesh {
    
    String secure;
    ArrayList<Question> hiddenQuestions;
    ArrayList<MoodDate> moodHistory;
    float mood;


    public HostSesh(String id, String seriesID, String sessionName, float mood,
    User owner, Boolean finished, ArrayList<Question> pushedquestions, Chat chat, String secure, 
    ArrayList<Question> hiddenQuestions, ArrayList<MoodDate> moodHistory, ArrayList<User> moderators){
        super(id, seriesID, sessionName, owner, finished, chat, pushedquestions, moderators);
        if (Objects.isNull(secure)){
            this.secure = "";
        } else{
            this.secure = secure;
        }
        this.hiddenQuestions = hiddenQuestions;
        this.moodHistory = moodHistory;
        this.mood = mood;
    }

    public HostSesh(String id, String seriesID, String sessionName, User owner, String secure){
        super(id, seriesID, sessionName, owner);
        if (Objects.isNull(secure)){
            this.secure = "";
        } else{
            this.secure = secure;
        }
        this.mood = 0;
        this.hiddenQuestions = new ArrayList<Question>();
        this.moodHistory = new ArrayList<MoodDate>();
    }

    public Sesh convertToSesh(){
        return this;
    }


    public String getSecure() {
        return secure;
    }

    public ArrayList<Question> getHiddenQuestions() {
        return hiddenQuestions;
    }

    public ArrayList<MoodDate> getMoodHistory() {
        return moodHistory;
    }

    public void setSecure(String secure) {
        this.secure = secure;
    }

    public void setHiddenQuestions(ArrayList<Question> hiddenQuestions) {
        this.hiddenQuestions = hiddenQuestions;
    }

    public void setMoodHistory(ArrayList<MoodDate> moodHistory) {
        this.moodHistory = moodHistory;
    }

    public float getMood() {
        return mood;
    }

    public void setMood(float mood) {
        this.mood = mood;
    }
}