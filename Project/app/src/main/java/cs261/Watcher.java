package cs261;

public class Watcher {

    String json = "";
    int type = 0;
    Boolean isMod = false;

    /**
     * Watches a given session's linked list
     * 
     * @param sessionID the session to watch
     * @param isMod     wheter or not the user is a moderaor
     * @return the json string to return to the user
     * @throws Exception
     */
    public String watch(String sessionID, Boolean isMod) throws Exception {
        this.isMod = isMod;
        Object o = App.getApp().getWatchable().addToList(sessionID, this, isMod);
        synchronized (o) {
            o.wait();
        }
        App.getApp().getWatchable().removeFromList(sessionID, this, isMod);
        return json;
    }

    public Boolean isMod() {
        return isMod;
    }

    public int getType() {
        return type;
    }

    public void setJson(String json) {
        this.json = json;
    }

    public void setType(int type) {
        this.type = type;
    }
}
