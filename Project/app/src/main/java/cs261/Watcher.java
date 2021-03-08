package cs261;

public class Watcher {

    String json = "";
    int type = 0;
    Boolean host = false;

    public String watch(String sessionID, Boolean host) throws Exception{
        this.host = host;
        App.getApp().getObservable().addToList(sessionID, this);
        App.getApp().getObservable().wait();
        return json;
    }

    public Boolean isHost(){
        return host;
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
