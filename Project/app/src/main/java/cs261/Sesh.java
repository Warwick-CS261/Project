package cs261;

import java.util.Random;
import java.util.ArrayList;

public class Sesh {
    String id;
    String seriesID;
    String sessionName;
    User owner;
    ArrayList<User> moderators;
    Boolean finished;
    ArrayList<Question> pushedQuestions;
    Chat chat;


    //constructor
    public Sesh(String id, String seriesID, String sessionName,
                User owner, Boolean finished, Chat chat, ArrayList<Question> pushedQuestions, ArrayList<User> moderators){
        this.id = id;
        this.seriesID = seriesID;
        this.sessionName = sessionName;
        this.owner = owner;
        this.finished = finished;
        this.pushedQuestions = pushedQuestions;
        this.chat = chat;
        this.moderators = moderators;
    }

    public Sesh(String id, String seriesID, String sessionName,
            User owner){
        this.id = id;
        this.seriesID = seriesID;
        this.sessionName = sessionName;
        this.owner = owner;
        this.finished = false;
        this.pushedQuestions = new ArrayList<Question>();
        this.chat = new Chat();
        }


    public static String generateID(){
    
        Random r = new Random();
    
        String alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
        String code ="";
        for (int i = 0; i < 6; i++) {
            code = code +alphabet.charAt(r.nextInt(alphabet.length()));
        }

        return code;
    }

/*
    public Boolean addQuestion(Question q){
        pushedQuestions.add(q);
        return true;
    }
*/
    public ArrayList<User> getModerators() {
        return moderators;
    }

    public void setModerators(ArrayList<User> moderators) {
        this.moderators = moderators;
    }

    public Chat getChat() {
        return chat;
    }

    public void setChat(Chat chat) {
        this.chat = chat;
    }

    public String getId() {
        return id;
    }

    public User getOwner() {
        return owner;
    }

    public String getSeriesID() {
        return seriesID;
    }

    public String getSessionName() {
        return sessionName;
    }

    public Boolean getFinished() {
        return finished;
    }

    public ArrayList<Question> getPushedQuestions() {
        return pushedQuestions;
    }

    public void setPushedQuestions(ArrayList<Question> pushedQuestions) {
        this.pushedQuestions = pushedQuestions;
    }

    public void setFinished(Boolean finished) {
        this.finished = finished;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    public void setSeriesID(String seriesID) {
        this.seriesID = seriesID;
    }

    public void setSessionName(String sessionName) {
        this.sessionName = sessionName;
    }

}