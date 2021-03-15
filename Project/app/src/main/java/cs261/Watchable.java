package cs261;

import java.util.HashMap;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;
import java.util.Objects;

public class Watchable {
    HashMap<Boolean, HashMap<String, List<Watcher>>> map;

    public Watchable() {
        map = new HashMap<Boolean, HashMap<String, List<Watcher>>>();
        map.put(true, new HashMap<String, List<Watcher>>());
        map.put(false, new HashMap<String, List<Watcher>>());
    }

    /**
     * Takes a watcher and adds it to the linked list for the relevant session
     * 
     * @param sessionID the session to be watched
     * @param w         the watcher itself
     * @param isMod     weather or not the watcher is watching for moderator
     *                  notifications
     * @return the list to watch
     */
    public List<Watcher> addToList(String sessionID, Watcher w, Boolean isMod) {

        if (Objects.isNull(map.get(isMod).get(sessionID))) {
            map.get(isMod).put(sessionID, Collections.synchronizedList(new LinkedList<Watcher>()));
        }
        map.get(isMod).get(sessionID).add(w);
        return map.get(isMod).get(sessionID);

    }

    /**
     * removes a given watcher from a given watch list
     * 
     * @param sessionID the session being watched
     * @param w         the watcher
     * @param isMod     Is the watcher watching for moderator notifications
     */
    public void removeFromList(String sessionID, Watcher w, Boolean isMod) {

        map.get(isMod).get(sessionID).add(w);
        return;
    }

    /**
     * notifies all attendees watching a given session
     * 
     * @param type      the type of notification
     * @param sessionID the session to be notified
     * @param json      the json string to send to watchers
     */
    public void notifyAttendees(int type, String sessionID, String json) {
        List<Watcher> wl;
        if (!Objects.isNull(wl = map.get(false).get(sessionID))) {

            synchronized (wl) {
                for (Watcher w : wl) {
                    w.setJson(json);
                    w.setType(230 + type);
                }
                map.get(false).get(sessionID).notifyAll();
            }
        }
    }

    /**
     * notifies all moderators watching a given session
     * 
     * @param type      the type of notification
     * @param sessionID the session to be notified
     * @param json      the json string to send to watchers
     */
    public void notifyModerators(int type, String sessionID, String json) {
        List<Watcher> wl;
        if (!Objects.isNull(wl = map.get(true).get(sessionID))) {
            synchronized (wl) {
                for (Watcher w : wl) {
                    w.setJson(json);
                    w.setType(230 + type);
                }
                map.get(true).get(sessionID).notifyAll();
            }
        }
    }

    /**
     * notifies all watching a given session
     * 
     * @param type      the type of notification
     * @param sessionID the session to be notified
     * @param json      the json string to send to watchers
     */
    public void notifyBoth(int type, String sessionID, String json) {
        notifyAttendees(type, sessionID, json);
        notifyModerators(type, sessionID, json);
    }
}
