package cs261;

import java.util.Date;

public class Message {
    User user;
    String msg;
    Date stamp;
    Boolean anon;
    int id;

    public Message(User user, String msg, Date stamp, Boolean anon){
        this.user = user;
        this.msg = msg;
        this.stamp = stamp;
        this.anon = anon;
        id = -1;
    }

    public Message(User user, String msg, Date stamp, Boolean anon, int id){
        this.user = user;
        this.msg = msg;
        this.stamp = stamp;
        this.anon = anon;
        this.id = id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getId() {
        return id;
    }

    public Boolean getAnon() {
        return anon;
    }

    public void setAnon(Boolean anon) {
        this.anon = anon;
    }

    public String getMsg() {
        return msg;
    }

    public Date getStamp() {
        return stamp;
    }

    public User getUser() {
        return user;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public void setStamp(Date stamp) {
        this.stamp = stamp;
    }

    public void setUser(User user) {
        this.user = user;
    }
}