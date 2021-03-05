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


    public HostSesh getHostSessionByID(String sessionID) throws Exception{
        HostSesh hs;
        if (!Objects.isNull(hs = searchCache(sessionID))){
            return hs;
        }else if(!Objects.isNull(hs = dbConn.getHostSessionByID(sessionID))){
            recentSessions.add(hs);
            return hs;
        }
        return null;
    }

    public Boolean sessionExists(String sessionID) throws Exception{
        if(Objects.isNull(searchCache(sessionID))){
            return true;
        }else{
            return dbConn.sessionExists(sessionID);
        }
    }

    public Boolean createMessage(Message message, String sessionID) throws Exception{
        HostSesh hs;
        if (!Objects.isNull(hs = searchCache(sessionID))){
            hs.getChat().addMessage(message);
        }
        dbConn.createMessage(message, sessionID);
        return true;
    }

    public Boolean createQuestion(Question q, String sessionID) throws Exception{
        HostSesh hs;
        Question newQ = dbConn.createQuestion(q, sessionID);

        if (!Objects.isNull(hs = searchCache(sessionID))){
            hs.addQuestion(newQ);
        }
        
        return true;
    }

    public Boolean createAnswer(Answer a, String sessionID, int qID) throws Exception{
        HostSesh hs;
        if (!Objects.isNull(hs = searchCache(sessionID))){
            hs.getQuestionByID(qID).addAnswer(a);
        }
        dbConn.createAnswer(a, sessionID, qID);
        return true;
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
