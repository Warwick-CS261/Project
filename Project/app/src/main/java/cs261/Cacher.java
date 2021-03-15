package cs261;

import java.sql.SQLException;
import java.util.*;

import org.apache.commons.collections4.queue.CircularFifoQueue;

public class Cacher {
    DBConnection dbConn;
    Queue<HostSesh> recentSessions;

    /**
     * A constructer method to get the database connection and to create a new queue
     * @param dbConn
     */
    public Cacher(DBConnection dbConn) {
        this.dbConn = dbConn;
        recentSessions = new CircularFifoQueue<HostSesh>(1);
    }
    
    /**
     * A method to create a question
     * @param q the question to add
     * @param sessionID the session to add the question to
     * @return true if the question is added without any errors
     * @throws SQLException
     */
    public Boolean createQuestion(Question q, String sessionID) throws SQLException {
        HostSesh hs;
        Question newQ = dbConn.createQuestion(q, sessionID);

        if (!Objects.isNull(hs = searchCache(sessionID))) {
            hs.addQuestion(newQ);
        }
        return true;
    }

    /**
     * A method to create an answer
     * @param a the answer to add
     * @param sessiondID the session to add the answer to
     * @param qID the question to add the answer to
     * @return true if the answer is added without any errors
     * @throws SQLException
     */
    public Boolean createAnswer(Answer a, String sessionID, int qID) throws SQLException {
        HostSesh hs;

        if (!Objects.isNull(hs = searchCache(sessionID))) {
            hs.getQuestionByID(qID).addAnswer(a);
        }
        dbConn.createAnswer(a, sessionID, qID);

        return true;
    }

    /**
     * A method to get the mood of a given question
     * @param sessionID the session the question belongs to
     * @param qID the question to get the mood from
     * @return the mood of the given question
     * @throws SQLException
     */
    public float getQuestionMood(String sessionID, int qID) throws SQLException {
        HostSesh hs;
        if (!Objects.isNull(hs = searchCache(sessionID))) {
            return hs.getQuestionByID(qID).getMood();
        }

        return dbConn.getQuestionByID(sessionID, qID).getMood();
    }

    /**
     * A method to check if a question is general
     * @param sessionID the session the question belongs to
     * @param qID the question to check
     * @return true if the question is general, otherwise false
     * @throws SQLException
     */
    public Boolean questionIsGeneral(String sessionID, int qID) throws SQLException {
        return getQuestionByID(sessionID, qID).getGeneral();
    }

    /**
     * A method to set the mood of a question
     * @param sessionID the session the question is in
     * @param qID the question to set the mood for
     * @param mood the value to set the mood to
     * @return true if it is set with no errors
     * @throws SQLException
     */
    public Boolean setQuestionMood(String sessionID, int qID, float mood) throws SQLException {
        HostSesh hs;
        if (!Objects.isNull(hs = searchCache(sessionID))) {
            hs.getQuestionByID(qID).setMood(mood);
        }
        dbConn.setQuestionMood(sessionID, qID, mood);
        return true;
    }

    /**
     * A method to create a message
     * @param message the message to add
     * @param sessionID the session to add the message to
     * @return true if the message is created with no errors
     * @throws SQLException
     */
    public Boolean createMessage(Message message, String sessionID) throws SQLException {
        HostSesh hs;
        if (!Objects.isNull(hs = searchCache(sessionID))) {
            message.setId(hs.getChat().getMessages().size());
            hs.getChat().addMessage(message);
        } else {
            message.setId(dbConn.numOfSessMsg(sessionID));
        }
        dbConn.createMessage(message, sessionID);
        return true;
    }

    /**
     * A method to create a mood date
     * @param sessionID the session to add the mood date to
     * @param moodDate the mood date to add
     * @return true if the mood date is created with no errors
     * @throws SQLException
     */
    public Boolean createMoodDate(String sessionID, MoodDate moodDate) throws SQLException {
        HostSesh hs;
        if (!Objects.isNull(hs = searchCache(sessionID))) {
            hs.getMoodHistory().add(moodDate);
        }
        dbConn.createMoodDate(sessionID, moodDate);
        return true;
    }

    /**
     * A method to push a question in a session
     * @param sessionID the session the question is in
     * @param qID the question to push
     * @return true if the question is pushed with no errors
     * @throws SQLException
     */
    public Boolean pushQuestion(String sessionID, int qID) throws SQLException {
        HostSesh hs;
        if (!Objects.isNull(hs = searchCache(sessionID))) {
            System.out.println("found, pushing");
            hs.pushQuestion(qID);
        }
        dbConn.pushQuestion(sessionID, qID);
        return true;
    }

    /**
     * A method to end a question
     * @param sessionID the session the question is in
     * @param qID the question to end
     * @return true if the question is ended with no errors
     * @throws SQLException
     */
    public Boolean endQuestion(String sessionID, int qID) throws SQLException {
        HostSesh hs;
        if (!Objects.isNull(hs = searchCache(sessionID))) {
            hs.pullQuestion(qID);
        }
        dbConn.endQuestion(sessionID, qID);
        return true;
    }

    /**
     * A method to get a host session
     * @param sessionID the id of the session to get
     * @return the host session if it is found, otherwise null
     * @throws SQLException
     */
    public HostSesh getHostSessionByID(String sessionID) throws SQLException {
        HostSesh hs;
        if (!Objects.isNull(hs = searchCache(sessionID))) {
            return hs;
        } else if (!Objects.isNull(hs = dbConn.getHostSessionByID(sessionID))) {
            recentSessions.add(hs);
            recentSessions.add(new HostSesh("afa", "w", "lol", new User("aq", "afd", "qd"), "nope"));
            return hs;
        }
        return null;
    }

    /**
     * A method to get a question
     * @param sessionID the session the question belongs to
     * @param qID the id of the question
     * @return the question if found, null if not
     * @throws SQLException
     */
    public Question getQuestionByID(String sessionID, int qID) throws SQLException {
        HostSesh hs;
        if (!Objects.isNull(hs = searchCache(sessionID))) {
            return hs.getQuestionByID(qID);
        }
        return dbConn.getQuestionByID(sessionID, qID);
    }

    /**
     * A method to delete a question
     * @param sessionID the session the question belongs to
     * @param qID the id of the question
     * @return true if the question is removed without errors
     * @throws SQLException
     */
    public Boolean deleteQuestion(String sessionID, int qID) throws SQLException {
        HostSesh hs;
        if (!Objects.isNull(hs = searchCache(sessionID))) {
            hs.deleteQuestionByID(qID);
        }
        dbConn.deleteQuestion(sessionID, qID);
        return true;
    }

    /**
     * A method to get the current mood of the session
     * @param sessionID the session to get the mood from
     * @return the current mood of the session
     * @throws SQLException
     */
    public float getSessionMood(String sessionID) throws SQLException {
        HostSesh hs;
        if (!Objects.isNull(hs = searchCache(sessionID))) {
            return hs.getMood();
        }
        return dbConn.getSessionMood(sessionID);
    }

    /**
     * A method to set the current mood of the session
     * @param sessionID the session to set the mood in
     * @param mood the value to set the mood to
     * @return true if it is set with no errors 
     * @throws SQLException
     */
    public Boolean setSessionMood(String sessionID, float mood) throws SQLException {
        HostSesh hs;
        if (!Objects.isNull(hs = searchCache(sessionID))) {
            hs.setMood(mood);
        }
        dbConn.setSessionMood(sessionID, mood);
        return true;
    }

    /**
     * A method to set a session to a series
     * @param sessionID the id of the session
     * @param seriesID the id of the series
     * @return true if the session is added to the series with no errors
     * @throws SQLException
     */
    public Boolean setSessionSeries(String sessionID, String seriesID) throws SQLException {
        HostSesh hs;
        if (!Objects.isNull(hs = searchCache(sessionID))) {
            hs.setSeriesID(seriesID);
        }
        dbConn.setSessionSeries(sessionID, seriesID);
        return true;
    }

    /**
     * A method to add a moderator to a session
     * @param user the user to become a moderator
     * @param sessionID the session they will become a moderator in
     * @return true if the user is made a moderator with no issues
     * @throws SQLException
     */
    public Boolean addModerator(User user, String sessionID) throws SQLException {
        HostSesh hs;
        if (!Objects.isNull(hs = searchCache(sessionID))) {
            hs.getModerators().add(user);
        }
        dbConn.addModerator(user, sessionID);
        return true;
    }

    /**
     * A method to check if a user is a moderator
     * @param user the user to check
     * @param sessionID the session to check in
     * @return true if the user is a moderator, otherwise false
     * @throws SQLException
     */
    public Boolean userIsModerator(User user, String sessionID) throws SQLException {
        HostSesh hs;
        if (!Objects.isNull(hs = searchCache(sessionID))) {
            for (User u : hs.getModerators()) {
                if (u.getId() == user.getId()) {
                    return true;
                }
            }
        }
        return dbConn.userIsModerator(user, sessionID);
    }

    /**
     * A method to get the moderators of a given session
     * @param sessionID the session to get the moderators from
     * @return a list of users that are moderators in the session
     * @throws SQLException
     */
    public ArrayList<User> getSessionModerators(String sessionID) throws SQLException {
        HostSesh hs;
        if (!Objects.isNull(hs = searchCache(sessionID))) {
            return hs.getModerators();
        }
        return dbConn.getSessionModerators(sessionID);

    }

    /**
     * A method to check if a user is the session host
     * @param user the user to check
     * @param sessionID the session to check
     * @return true if the user is the session host, otherwise false
     * @throws SQLException
     */
    public Boolean userIsSessionHost(User user, String sessionID) throws SQLException {
        HostSesh hs;
        if (!Objects.isNull(hs = searchCache(sessionID))) {
            return hs.getOwner().getId() == user.getId();
        }
        return dbConn.userIsSessionHost(user, sessionID);
    }

    /**
     * A method to check if a session exists with the given id
     * @param sessionID the id to check
     * @return true if the session exists, otherwise false
     * @throws SQLException
     */
    public Boolean sessionExists(String sessionID) throws SQLException {
        if (!Objects.isNull(searchCache(sessionID))) {
            return true;
        } else {
            return dbConn.sessionExists(sessionID);
        }
    }

    /**
     * A method to end a session
     * @param sessionID the session to end
     * @return true if the session is ended without any errors
     * @throws SQLException
     */
    public Boolean endSession(String sessionID) throws SQLException {
        HostSesh hs;
        if (!Objects.isNull(hs = searchCache(sessionID))) {
            hs.setFinished(true);
        }
        dbConn.endSession(sessionID);
        return true;
    }

    /**
     * A method to check if a session has ended
     * @param sessionID the session id to check
     * @return true if the session has ended, otherwise false
     * @throws SQLException
     */
    public Boolean sessionEnded(String sessionID) throws SQLException {
        HostSesh hs;
        if (!Objects.isNull(hs = searchCache(sessionID))) {
            return hs.getFinished();
        }
        return dbConn.sessionEnded(sessionID);
    }

    /**
     * A method to check if a question exists with the given id
     * @param sessionID the session to check for the question in
     * @param qID the question to see if it exists
     * @return true if the question exists, otherwise false
     * @throws SQLException
     */
    public Boolean questionExists(String sessionID, int qID) throws SQLException {
        HostSesh hs;
        if (!Objects.isNull(hs = searchCache(sessionID))) {
            if (!Objects.isNull(hs.getQuestionByID(qID))) {
                return true;
            }
        }
        return dbConn.questionExists(sessionID, qID);

    }

    /**
     * A method to get the password of a given session
     * @param sessionID the session to get the password for
     * @return the password of the session
     * @throws SQLException
     */
    public String getSessionPassword(String sessionID) throws SQLException {
        HostSesh hs;
        if (!Objects.isNull(hs = searchCache(sessionID))) {
            return hs.getSecure();
        }
        return dbConn.getSessionPassword(sessionID);
    }

    /**
     * A method to delete a session
     * @param sessionID the session to delete
     * @return true if the session is deleted without any errors
     * @throws SQLException
     */
    public Boolean deleteSession(String sessionID) throws SQLException {
        HostSesh hs;
        if (!Objects.isNull(hs = searchCache(sessionID))) {
            recentSessions.remove(hs);
        }
        return dbConn.deleteSession(sessionID);
    }

    /**
     * Searches the cache for sessions and returns it if there's a match
     * @param sessionID the session to look for
     * @return the session if it exists
     */
    private HostSesh searchCache(String sessionID) {
        for (HostSesh hs : recentSessions) {
            if (hs.getId().equals(sessionID)) {
                return hs;
            }
        }
        return null;
    }

}
