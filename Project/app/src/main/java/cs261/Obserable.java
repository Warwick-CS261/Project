package cs261;

import java.util.HashMap;
import java.util.LinkedList;

public class Obserable {
    HashMap<String, LinkedList<Watcher>> map = new HashMap<>();

    public void addToList(String sessionID, Watcher w){
            map.get(sessionID).add(w);
            return;
    }

    public void notifyWatchers(int type, String sessionID, String json){
        for (Watcher w : map.get(sessionID)){
            w.setJson(json);
            w.setType(type);
            w.notify();
            map.get(sessionID).remove(w);
        }
    }

    public void notifyHosts(int type, String sessionID, String json){
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
