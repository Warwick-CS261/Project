package cs261;

import java.time.*;

public class Message {
    User user;
    String msg;
    LocalDateTime stamp;

    public Message(User user, String msg, LocalDateTime stamp){
        this.user = user;
        this.msg = msg;
        this.stamp = stamp;
    }

    public String getMsg() {
        return msg;
    }

    public LocalDateTime getStamp() {
        return stamp;
    }

    public User getUser() {
        return user;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public void setStamp(LocalDateTime stamp) {
        this.stamp = stamp;
    }

    public void setUser(User user) {
        this.user = user;
    }
}