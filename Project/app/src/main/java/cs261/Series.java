package cs261;

import java.util.ArrayList;

public class Series {
    int id;
    String name;
    ArrayList<Sesh> sessions;

    public Series(int id, String name, ArrayList<Sesh> sessions){
        this.id = id;
        this.name = name;
        this.sessions = sessions;

    }

    public Series(int id, String name){
        this.id = id;
        this.name = name;
        sessions = new ArrayList<Sesh>();
    }

    public void addSession(Sesh s){
        sessions.add(s);
    }



    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public ArrayList<Sesh> getSessions() {
        return sessions;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setSessions(ArrayList<Sesh> sessions) {
        this.sessions = sessions;
    }


}