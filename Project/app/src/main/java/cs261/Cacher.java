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

    public Boolean pushQuestion(String sessionID, int qID) throws Exception{
        HostSesh hs;
        if (!Objects.isNull(hs = searchCache(sessionID))){
            hs.pushQuestion(qID);
        }
        dbConn.pushQuestion(sessionID, qID);
        return true;
    }

    public Boolean endQuestion(String sessionID, int qID) throws Exception{
        HostSesh hs;
        if (!Objects.isNull(hs = searchCache(sessionID))){
            hs.getQuestionByID(qID).setEnded(false);
        }
        dbConn.endQuestion(sessionID, qID);
        return true;
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


    //TODO
    //Could do questions like this
    public Boolean createMessage(Message message, String sessionID) throws Exception{
        HostSesh hs;
        if (!Objects.isNull(hs = searchCache(sessionID))){
            message.setId(hs.getChat().getMessages().size());
            hs.getChat().addMessage(message);
        }else{
            message.setId(dbConn.numOfSessMsg(sessionID));
            System.out.println(dbConn.numOfSessMsg(sessionID));
        }
        System.out.println(message.getId());
        dbConn.createMessage(message, sessionID);
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
