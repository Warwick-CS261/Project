package cs261;

import java.sql.SQLException;
import java.util.*;

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

    public Boolean createMoodDate(String sessionID, MoodDate moodDate)throws Exception{
        HostSesh hs;
        if (!Objects.isNull(hs = searchCache(sessionID))){
            hs.getMoodHistory().add(moodDate);
        }
        dbConn.createMoodDate(sessionID, moodDate);
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
            hs.getQuestionByID(qID).setPushed(false);
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

    public Question getQuestionByID(String sessionID, int qID) throws Exception{
        HostSesh hs;
        if (!Objects.isNull(hs = searchCache(sessionID))){
            return hs.getQuestionByID(qID);
        }
        return dbConn.getQuestionByID(sessionID, qID);
    }

    public Boolean deleteQuestion(String sessionID, int qID) throws Exception{
        HostSesh hs;
        if (!Objects.isNull(hs = searchCache(sessionID))){
            hs.deleteQuestionByID(qID);
        }
        dbConn.deleteQuestion(sessionID, qID);
        return true;
    }

    public float getSessionMood(String sessionID)throws SQLException{
        HostSesh hs;
        if (!Objects.isNull(hs = searchCache(sessionID))){
            return hs.getMood();
        }
        return dbConn.getSessionMood(sessionID);
    }

    public Boolean setSessionMood(String sessionID, float mood) throws Exception{
        HostSesh hs;
        if (!Objects.isNull(hs = searchCache(sessionID))){
            hs.setMood(mood);
        }
        dbConn.setSessionMood(sessionID, mood);
        return true;
    }

    public Boolean addModerator(User user, String sessionID) throws Exception{
        HostSesh hs;
        if (!Objects.isNull(hs = searchCache(sessionID))){
            hs.getModerators().add(user);
        }
        dbConn.addModerator(user, sessionID);
        return true;
    }

    public Boolean userIsModerator(User user, String sessionID) throws SQLException{
        HostSesh hs;
        if (!Objects.isNull(hs = searchCache(sessionID))){
            for(User u : hs.getModerators()){
                if (u.getId() == user.getId()){
                    return true;
                }
            }
        }
        return dbConn.userIsModerator(user, sessionID);
    }

    public ArrayList<User> getSessionModerators (String sessionID)throws Exception{
        HostSesh hs;
        if (!Objects.isNull(hs = searchCache(sessionID))){
            return hs.getModerators();
        }
        return dbConn.getSessionModerators(sessionID);

    }

    public Boolean userIsSessionHost(User user, String sessionID) throws Exception{
        HostSesh hs;
        if (!Objects.isNull(hs = searchCache(sessionID))){
            return hs.getOwner().getId() == user.getId();
        }
        return dbConn.userIsSessionHost(user, sessionID);
    }


    public Boolean sessionExists(String sessionID) throws Exception{
        if(!Objects.isNull(searchCache(sessionID))){
            return true;
        }else{
            return dbConn.sessionExists(sessionID);
        }
    }

    public Boolean endSession(String sessionID) throws SQLException{
        HostSesh hs;
        if (!Objects.isNull(hs = searchCache(sessionID))){
            hs.setFinished(true);
        }
        dbConn.endSession(sessionID);
        return true;
    }

    public Boolean sessionEnded(String sessionID) throws Exception{
        HostSesh hs;
        if (!Objects.isNull(hs = searchCache(sessionID))){
            return hs.getFinished();
        }
        return dbConn.sessionEnded(sessionID);
    }

    public Boolean questionExists(String sessionID, int qID) throws Exception{
        HostSesh hs;
        if (!Objects.isNull(hs = searchCache(sessionID))){
            if(!Objects.isNull(hs.getQuestionByID(qID))){
                return true;
            }
        }
        return dbConn.questionExists(sessionID, qID);
    
    }

    public String getSessionPassword(String sessionID) throws SQLException{
        HostSesh hs;
        if (!Objects.isNull(hs = searchCache(sessionID))){
            return hs.getSecure();
        }
        return dbConn.getSessionPassword(sessionID);
    }

    public Boolean deleteSession(String sessionID) throws Exception{
        HostSesh hs;
        if (!Objects.isNull(hs = searchCache(sessionID))){
            recentSessions.remove(hs);
        }
        return dbConn.deleteSession(sessionID);
    }


    //add attendess to session and check?

    private HostSesh searchCache (String sessionID){
        for(HostSesh hs : recentSessions){
            if (hs.getId().equals(sessionID)){
                return hs;
            }
        }
        return null;
    }



}
