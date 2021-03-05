package cs261;

import java.util.Queue;
import java.util.Objects;
import org.apache.commons.collections4.queue.CircularFifoQueue;

public class Cacher {
    DBConnection dbConn;
    Queue<HostSesh> recentSessions;


    public Cacher(DBConnection dbConn){
        this.dbConn = dbConn;
        recentSessions = new CircularFifoQueue<HostSesh>(100);
    }


    public HostSesh getHostSeshByID(String sessionID) throws Exception{
        HostSesh hs;
        if (Objects.isNull(hs = searchCache(sessionID))){
            return hs;
        }else{
            return dbConn.getHostSessionByID(sessionID);
        }
    }

    

    private HostSesh searchCache (String sessionID){
        for(HostSesh hs : recentSessions){
            if (hs.getId().equals(sessionID)){
                return hs;
            }
        }
        return null;
    }



}
