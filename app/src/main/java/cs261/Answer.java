package cs261;

import java.time.LocalDateTime;

public class Answer {
    User user;
    int smiley;
    String context;
    LocalDateTime stamp;
    Boolean anon;

    public Answer(User user, int smiley, String context, LocalDateTime stamp, Boolean anon){
        this.user = user;
        this.smiley = smiley;
        this.context = context;
        this.stamp = stamp;
        this.anon = anon;
    } 

    public Boolean getAnon() {
        return anon;
    }
    
    public void setAnon(Boolean anon) {
        this.anon = anon;
    }

    public String getContext() {
        return context;
    }
    
    public int getSmiley() {
        return smiley;
    }

    public LocalDateTime getStamp() {
        return stamp;
    }

    public User getUser() {
        return user;
    }

    public void setContext(String context) {
        this.context = context;
    }

    public void setSmiley(int smiley) {
        this.smiley = smiley;
    }

    public void setStamp(LocalDateTime stamp) {
        this.stamp = stamp;
    }
    
    public void setUser(User user) {
        this.user = user;
    }

}