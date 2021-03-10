package cs261;

import java.util.Date;

public class MoodDate {
    float mood;
    Date date;

    public MoodDate(float mood, Date date){
        this.mood = mood;
        this.date = date;
    }

    public float getMood() {
        return mood;
    }

    public Date getDate() {
        return date;
    }

    public void setMood(float mood) {
        this.mood = mood;
    }

    public void setTime(Date date) {
        this.date = date;
    }

}