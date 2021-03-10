package cs261;

import java.util.HashMap;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;
import java.util.Objects;

public class Obserable{
    HashMap<Boolean, HashMap<String, List<Watcher>>> map;
    public Obserable(){
        map = new HashMap<Boolean, HashMap<String, List<Watcher>>>();
        map.put(true, new HashMap<String, List<Watcher>>());
        map.put(false, new HashMap<String, List<Watcher>>());
    }

    public List<Watcher> addToList(String sessionID, Watcher w, Boolean isMod){

        if(Objects.isNull(map.get(isMod).get(sessionID))){
            map.get(isMod).put(sessionID, Collections.synchronizedList(new LinkedList<Watcher>()));
        }
        map.get(isMod).get(sessionID).add(w);
        return map.get(isMod).get(sessionID);

    }


    public void removeFromList(String sessionID, Watcher w, Boolean isMod){

        map.get(isMod).get(sessionID).add(w);
        return;
}
    

    public void notifyAttendees(int type, String sessionID, String json){
        List<Watcher> wl;
        if(!Objects.isNull(wl = map.get(false).get(sessionID))){ 
            
            synchronized (wl){
                for (Watcher w : wl){
                        w.setJson(json);
                        w.setType(230+type);
                }
                map.get(false).get(sessionID).notifyAll();
            }
        }
    }

    public void notifyModerators(int type, String sessionID, String json){
        List<Watcher> wl;
        if(!Objects.isNull(wl = map.get(true).get(sessionID))){ 
            synchronized (wl){
                for (Watcher w : wl){
                    w.setJson(json);
                    w.setType(230+type);
                }
                map.get(true).get(sessionID).notifyAll();
            }
        }
    }

    public void notifyBoth(int type, String sessionID, String json){
        notifyAttendees(type, sessionID, json);
        notifyModerators(type, sessionID, json);
    }
}
