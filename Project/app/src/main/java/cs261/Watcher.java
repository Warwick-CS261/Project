package cs261;

public class Watcher {

    String json = "";
    int type = 0;
    Boolean isMod = false;

    public String watch(String sessionID, Boolean isMod) throws Exception {
        this.isMod = isMod;
        Object o = App.getApp().getObservable().addToList(sessionID, this, isMod);
        synchronized (o) {
            o.wait();
        }
        App.getApp().getObservable().removeFromList(sessionID, this, isMod);
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
