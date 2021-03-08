package cs261;

import java.util.HashMap;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;
import java.util.Objects;

public class Obserable{
    HashMap<String, List<Watcher>> map;

    public Obserable(){
        map = new HashMap<>();
    }

    public List<Watcher> addToList(String sessionID, Watcher w){
            if(Objects.isNull(map.get(sessionID))){
                map.put(sessionID, Collections.synchronizedList(new LinkedList<Watcher>()));
            }
            map.get(sessionID).add(w);
            return map.get(sessionID);
    }

    

    public void notifyAttendees(int type, String sessionID, String json){
        List<Watcher> wl;
        if(!Objects.isNull(wl = map.get(sessionID))){ 
            
            synchronized (wl){
                for (Watcher w : wl){
                        w.setJson(json);
                        w.setType(230+type);
                        map.get(sessionID).notifyAll();
                        map.get(sessionID).remove(w);
                }
            }
        }
    }

    public void notifyModerators(int type, String sessionID, String json){
        List<Watcher> wl;
        if(!Objects.isNull(wl = map.get(sessionID))){ 
            synchronized (wl){
                for (Watcher w : wl){
                    if(w.isHost()){
                        w.setJson(json);
                        w.setType(230+type);
                        map.get(sessionID).notifyAll();
                        map.get(sessionID).remove(w);
                    };
                }
            }
        }
    }

    public void notifyBoth(int type, String sessionID, String json){
        notifyAttendees(type, sessionID, json);
        notifyModerators(type, sessionID, json);
    }
}
