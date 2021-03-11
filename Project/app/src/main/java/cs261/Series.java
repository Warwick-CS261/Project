package cs261;

import java.util.ArrayList;

public class Series {
    String id;
    String name;
    ArrayList<Sesh> sessions;

    public Series(String id, String name, ArrayList<Sesh> sessions) {
        this.id = id;
        this.name = name;
        this.sessions = sessions;
    }

    public Series(String id, String name) {
        this.id = id;
        this.name = name;
        sessions = new ArrayList<Sesh>();
    }

    public void addSession(Sesh s) {
        sessions.add(s);
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public ArrayList<Sesh> getSessions() {
        return sessions;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setSessions(ArrayList<Sesh> sessions) {
        this.sessions = sessions;
    }

}