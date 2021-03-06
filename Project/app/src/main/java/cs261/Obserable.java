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
            map.get(sessionID).add(w);
            return;
    }

    public void notifyWatchers(int type, String sessionID, String json){
        if(!Objects.isNull(map.get(sessionID))){ 
            for (Watcher w : map.get(sessionID)){
                    w.setJson(json);
                    w.setType(type);
                    w.notify();
                    map.get(sessionID).remove(w);
            }
        }
    }

    public void notifyHosts(int type, String sessionID, String json){
        if(!Objects.isNull(map.get(sessionID))){ 
            for (Watcher w : map.get(sessionID)){
                if(w.isHost()){
                    w.setJson(json);
                    w.setType(type);
                    w.notify();
                    map.get(sessionID).remove(w);
                };
            }
        }
    }
}
