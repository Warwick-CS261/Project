package cs261;

import java.util.Queue;
import org.apache.commons.collections4.queue.CircularFifoQueue;

public class Cacher {
    DBConnection dbconn;
    Queue<HostSesh> recentSessions;


    public Cacher(DBConnection dbConn){
        this.dbconn = dbConn;
        recentSessions = new CircularFifoQueue<HostSesh>(100);
    }

    private HostSesh getHostSeshByID(String sessionID){
        for(HostSesh hs : recentSessions){
            if (hs.getId().equals(sessionID)){
                return hs;
            }
        }
        return null;
    }

    




}
