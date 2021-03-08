package cs261;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.Objects;

public class Obserable {
    HashMap<String, LinkedList<Watcher>> map;

    public Obserable(){
        map = new HashMap<>();
    }

    public void addToList(String sessionID, Watcher w){
        if(Objects.isNull(map.get(sessionID))){
            map.put(sessionID, new LinkedList<Watcher>());
        }
        map.get(sessionID).add(w);
        return;
    }

    public void notifyAttendees(int type, String sessionID, String json){
        if(!Objects.isNull(map.get(sessionID))){ 
            for (Watcher w : map.get(sessionID)){
                    w.setJson(json);
                    w.setType(230+type);
                    w.notify();
                    map.get(sessionID).remove(w);
            }
        }
    }

    public void notifyModerators(int type, String sessionID, String json){
        if(!Objects.isNull(map.get(sessionID))){ 
            for (Watcher w : map.get(sessionID)){
                if(w.isHost()){
                    w.setJson(json);
                    w.setType(230+type);
                    w.notify();
                    map.get(sessionID).remove(w);
                };
            }
        }
    }

    public void notifyBoth(int type, String sessionID, String json){
        notifyAttendees(type, sessionID, json);
        notifyModerators(type, sessionID, json);
    }
}
