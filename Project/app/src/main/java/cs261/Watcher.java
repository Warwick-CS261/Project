package cs261;

public class Watcher {

    String json = "";
    int type = 0;
    Boolean requiresMod = false;
    Boolean requiresAttendee = false;
    Boolean both = false;
    Boolean isMod = false;

    public String watch(String sessionID, Boolean isMod) throws Exception{
        this.isMod = isMod;
        Object o = App.getApp().getObservable().addToList(sessionID, this);
        synchronized(o){
            while(!(requiresMod && isMod)&&!(requiresAttendee && !isMod)&&!both){
                o.wait();
            }
        }
        App.getApp().getObservable().removeFromList(sessionID, this);
        return json;
    }

    public void both(){
        this.requiresAttendee = false;
        this.requiresMod = false;
        this.both = true;
    }

    public void requiresAttendee() {
        this.requiresMod = false;
        this.both = false;
        this.requiresAttendee = true;
    }

    public void requiresMod() {
        this.both = false;
        this.requiresAttendee = false;
        this.requiresMod = true;
    }

    public Boolean isMod(){
        return isMod;
    }

    public int getType(){
        return type;
    }

    public void setJson(String json){
        this.json = json;
    }

    public void setType(int type){
        this.type = type;
    }
}
