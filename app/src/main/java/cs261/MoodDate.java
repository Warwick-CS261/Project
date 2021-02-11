package cs261;

import java.time.LocalDateTime;

public class MoodDate {
    float mood;
    LocalDateTime time;

    public MoodDate(float mood, LocalDateTime time){
        this.mood = mood;
        this.time = time;
    }

    public float getMood() {
        return mood;
    }

    public LocalDateTime getTime() {
        return time;
    }

    public void setMood(float mood) {
        this.mood = mood;
    }

    public void setTime(LocalDateTime time) {
        this.time = time;
    }

}