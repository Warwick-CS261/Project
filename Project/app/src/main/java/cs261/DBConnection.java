package cs261;

import java.sql.*;
import java.util.*;

public class DBConnection {

    private Connection connection;

    /**
     * A method to get the database connection
     * @param url the url of the connection
     * @throws SQLException
     */
    public DBConnection(String url) throws SQLException {

        this.connection = DriverManager.getConnection(url);

    }

    /**
     * A method to create a User
     * @param u the username
     * @param pword the password
     * @param salt the salt
     * @return returns true if the user is created succesfully
     * @throws SQLException
     */
    public Boolean createUser(User u, String pword, String salt) throws SQLException {
        String query = "INSERT INTO USER (fName, lName, email, phash, salt) VALUES(?,?,?,?,?)";
        PreparedStatement stmt = connection.prepareStatement(query);
        stmt.setString(1, u.getFname());
        stmt.setString(2, u.getLname());
        stmt.setString(3, u.getEmail());
        stmt.setString(4, pword);// must change
        stmt.setString(5, salt);// must change
        stmt.executeUpdate();
        return true;
    }

    /**
     * A method to verify the the password is correct
     * @param email the email given by the user
     * @param pword the password given by the user
     * @return the user if correct details are passed or null if not
     * @throws SQLException
     */
    public User verifyPassword(String email, String pword) throws SQLException {
        String query = "SELECT * FROM USER WHERE email = ? AND phash = ?";
        PreparedStatement stmt = connection.prepareStatement(query);
        stmt.setString(1, email);
        stmt.setString(2, pword);
        ResultSet rs = stmt.executeQuery();
        if (rs.next()) {
            return new User(rs.getInt("id"), rs.getString("fname"), rs.getString("lname"), rs.getString("email"));
        }
        return null;
    }

    /**
     * A method to create a session
     * @param s the session to create
     * @return the same session back
     * @throws SQLException
     */
    public HostSesh createSession(HostSesh s) throws SQLException {
        String query = "INSERT INTO SESH VALUES(?,?,?,?,?,?,0)";
        PreparedStatement stmt = connection.prepareStatement(query);
        stmt.setString(1, s.getId());
        stmt.setString(2, s.getSeriesID());
        stmt.setString(3, s.getSessionName());
        stmt.setFloat(4, s.getMood());
        stmt.setString(5, s.getSecure());
        stmt.setInt(6, s.getOwner().getId());
        stmt.executeUpdate();

        createMoodDate(s.getId(), new MoodDate((float) 0.0, new java.util.Date()));
        /*
         * for (Question q : s.getHiddenQuestions()) { createQuestion(q, s.getId()); }
         */
        return s;

    }

    /**
     * A method to create a series
     * @param seriesID the id of the series to create
     * @param user the owner of the series
     * @return true if it is created with no errors
     * @throws SQLException
     */
    public Boolean createSeries(String seriesID, User user) throws SQLException {
        String query = "INSERT INTO SERIES VALUES (?,?,?)";
        PreparedStatement stmt = connection.prepareStatement(query);
        stmt.setString(1, seriesID);
        stmt.setInt(2, user.getId());
        stmt.setString(3, "");
        stmt.executeUpdate();
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
        String query = "UPDATE SESH SET seriesID = ? WHERE id = ?";
        PreparedStatement stmt = connection.prepareStatement(query);
        stmt.setString(1, seriesID);
        stmt.setString(2, sessionID);
        stmt.executeUpdate();
        return true;
    }

    /**
     * A method to create a question
     * @param q the question to add
     * @param sessionID the session to add the question to
     * @return the same question back
     * @throws SQLException
     */
    public Question createQuestion(Question q, String sessionID) throws SQLException {
        int qs = numOfSessQuest(sessionID);
        String query = "INSERT INTO QUESTION VALUES(?,?,?,?,?,?)";
        PreparedStatement stmt = connection.prepareStatement(query);
        stmt.setInt(1, qs);
        stmt.setString(2, sessionID);
        stmt.setString(3, q.getQuestion());
        stmt.setBoolean(4, q.getPushed());
        stmt.setBoolean(5, q.getGeneral());
        stmt.setFloat(6, q.getMood());
        stmt.executeUpdate();
        q.setID(qs);
        return q;
    }

    /**
     * A method to create an answer
     * @param answer the answer to add
     * @param sessiondID the session to add the answer to
     * @param qID the question to add the answer to
     * @return the same answer back
     * @throws SQLException
     */
    public Answer createAnswer(Answer answer, String sessiondID, int qID) throws SQLException {
        String query = "INSERT INTO ANSWER VALUES(?, ?, ?, ?, ?, ?, ?)";
        PreparedStatement stmt = connection.prepareStatement(query);
        stmt.setInt(1, qID);
        stmt.setString(2, sessiondID);
        stmt.setInt(3, answer.getUser().getId());
        stmt.setInt(4, answer.getSmiley());
        stmt.setDate(5, new java.sql.Date(answer.getStamp().getTime()));
        stmt.setBoolean(6, answer.getAnon());
        stmt.setString(7, answer.getContext());
        stmt.executeUpdate();
        return answer;
    }

    /**
     * A method to create a message
     * @param message the message to add
     * @param sessionID the session to add the message to
     * @return the same message back
     * @throws SQLException
     */
    public Message createMessage(Message message, String sessionID) throws SQLException {
        String query = "INSERT INTO MESSAGES VALUES(?,?,?,?,?,?)";
        PreparedStatement stmt = connection.prepareStatement(query);
        stmt.setInt(1, message.getId());
        stmt.setString(2, sessionID);
        stmt.setString(3, message.getMsg());
        stmt.setInt(4, message.getUser().getId());
        stmt.setDate(5, new java.sql.Date(message.getStamp().getTime()));
        stmt.setBoolean(6, message.getAnon());
        stmt.executeUpdate();
        return message;
    }

    /**
     * A method to create a mood date
     * @param sessionID the session to add the mood date to
     * @param moodDate the mood date to add
     * @return the same mood date back
     * @throws SQLException
     */
    public MoodDate createMoodDate(String sessionID, MoodDate moodDate) throws SQLException {
        String query = "INSERT INTO MOOD_DATE VALUES(?, ?, ?)";
        PreparedStatement stmt = connection.prepareStatement(query);
        stmt.setString(1, sessionID);
        stmt.setDate(2, new java.sql.Date(moodDate.getDate().getTime()));
        stmt.setFloat(3, moodDate.getMood());
        stmt.executeUpdate();
        return moodDate;
    }

    /**
     * A method to push a question to attendees
     * @param sessionId the session the question is from
     * @param questionID the question to push
     * @return true if no errors are reported
     * @throws SQLException
     */
    public Boolean pushQuestion(String sessionId, int questionID) throws SQLException {
        String query = "UPDATE QUESTION SET pushed = 1 WHERE id = ? AND sessionID = ?";
        PreparedStatement stmt = connection.prepareStatement(query);
        stmt.setInt(1, questionID);
        stmt.setString(2, sessionId);
        stmt.executeUpdate();
        return true;
    }

    /**
     * A method to end a question
     * @param sessionId the session the question is from
     * @param questionID the question to delete
     * @return true if no errors are reported
     * @throws SQLException
     */
    public Boolean endQuestion(String sessionId, int questionID) throws SQLException {
        String query = "UPDATE QUESTION SET pushed = 0 WHERE id = ? AND sessionID = ?";
        PreparedStatement stmt = connection.prepareStatement(query);
        stmt.setInt(1, questionID);
        stmt.setString(2, sessionId);
        stmt.executeUpdate();
        return true;
    }

    /**
     * A method to get the sessions of a user
     * @param userID the id of the user to get the sessions from
     * @return a series of sessions that the user is in
     * @throws SQLException
     */
    public Series getUserSessions(int userID) throws SQLException { // needs to filter out duplicates
        String query = "SELECT id FROM SESH WHERE userID = ?";
        Series userSeries = new Series("000000", "userssesiions");
        PreparedStatement stmt = connection.prepareStatement(query);
        stmt.setInt(1, userID);
        ResultSet rs = stmt.executeQuery();
        while (rs.next()) {
            userSeries.addSession(getHostSessionByID(rs.getString("id")));
        }
        // now attendee
        query = "SELECT sessionID FROM ATTENDEE_SESSION WHERE userID = ?";
        PreparedStatement stmt2 = connection.prepareStatement(query);
        stmt2.setInt(1, userID);
        ResultSet rs2 = stmt2.executeQuery();
        while (rs2.next()) {
            userSeries.addSession(getHostSessionByID(rs2.getString("sessionID")).convertToSesh());
        }

        return userSeries;
    }

    /**
     * A method to get a question
     * @param sessionID the session the question belongs to
     * @param qID the id of the question
     * @return the question if found, null if not
     * @throws SQLException
     */
    public Question getQuestionByID(String sessionID, int qID) throws SQLException {
        String query = "SELECT * FROM QUESTION WHERE id = ? AND sessionID = ?";
        PreparedStatement stmt = connection.prepareStatement(query);
        stmt.setInt(1, qID);
        stmt.setString(2, sessionID);
        ResultSet rs = stmt.executeQuery();
        if (rs.next()) {
            return new Question(rs.getString("question"), loadAnswers(sessionID, qID), rs.getInt("id"),
                    rs.getBoolean("pushed"), rs.getBoolean("general"), rs.getFloat("mood"));
        }
        return null;
    }

    /**
     * A method to delete a question
     * @param sessionID the session the question belongs to
     * @param questionID the id of the question
     * @return true if the question is removed without errors
     * @throws SQLException
     */
    public Boolean deleteQuestion(String sessionID, int questionID) throws SQLException {
        String query = "DELETE FROM QUESTION WHERE id = ? AND sessionID = ?";
        PreparedStatement stmt = connection.prepareStatement(query);
        stmt.setInt(1, questionID);
        stmt.setString(2, sessionID);
        stmt.executeUpdate();
        return true;
    }

    /**
     * A method to get the number of messages in a session
     * @param sessionID the session to check
     * @return the number of messages in the session
     * @throws SQLException
     */
    public int numOfSessMsg(String sessionID) throws SQLException {
        String query = "SELECT COUNT(id) FROM MESSAGES WHERE sessionID = ?";
        PreparedStatement stmt = connection.prepareStatement(query);
        stmt.setString(1, sessionID);
        ResultSet rs = stmt.executeQuery();
        rs.next();
        return rs.getInt(1);
    }

    /**
     * A method to get the number of questions in a session
     * @param sessionID the session to check
     * @return the number of questions in the session
     * @throws SQLException
     */
    private int numOfSessQuest(String sessionID) throws SQLException {
        String query = "SELECT COUNT(id) FROM QUESTION WHERE sessionID = ?";
        PreparedStatement stmt = connection.prepareStatement(query);
        stmt.setString(1, sessionID);
        ResultSet rs = stmt.executeQuery();
        rs.next();
        return rs.getInt(1);
    }

    /**
     * A method to get the number of answers to questions in a session
     * @param sessionID the session to check
     * @param qID the question the answers relate to
     * @return the number of answers to the given question
     * @throws SQLException
     */
    public int numOfAnswersToQ(String sessionID, int qID) throws SQLException {
        String query = "SELECT COUNT(*) FROM ANSWER WHERE sessionID = ? AND qID = ?";
        PreparedStatement stmt = connection.prepareStatement(query);
        stmt.setString(1, sessionID);
        stmt.setInt(2, qID);
        ResultSet rs = stmt.executeQuery();
        rs.next();
        return rs.getInt(1);
    }

    /**
     * A method to get the current mood of the session
     * @param sessionID the session to get the mood from
     * @return the current mood of the session
     * @throws SQLException
     */
    public float getSessionMood(String sessionID) throws SQLException {
        String query = "SELECT mood FROM SESH WHERE id = ?";
        PreparedStatement stmt = connection.prepareStatement(query);
        stmt.setString(1, sessionID);
        ResultSet rs = stmt.executeQuery();
        rs.next();
        return rs.getFloat(1);
    }

    /**
     * A method to set the current mood of the session
     * @param sessionID the session to set the mood in
     * @param mood the value to set the mood to
     * @return true if it is set with no errors 
     * @throws SQLException
     */
    public Boolean setSessionMood(String sessionID, float mood) throws SQLException {
        String query = "UPDATE SESH SET mood = ? WHERE id =?";
        PreparedStatement stmt = connection.prepareStatement(query);
        stmt.setFloat(1, mood);
        stmt.setString(2, sessionID);
        stmt.executeUpdate();
        return true;
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
        String query = "UPDATE QUESTION SET mood = ? WHERE id =? AND sessionID =?";
        PreparedStatement stmt = connection.prepareStatement(query);
        stmt.setFloat(1, mood);
        stmt.setInt(2, qID);
        stmt.setString(3, sessionID);
        stmt.executeUpdate();
        return true;
    }

    /**
     * A method to get the number of general answers in a session
     * @param sessionID the session to check
     * @return the number of general answers found
     * @throws SQLException
     */
    public int numOfGeneralAnswers(String sessionID) throws SQLException {
        int count = 0;
        String query = "SELECT id FROM QUESTION WHERE sessionID = ? AND general = 1";
        PreparedStatement stmt = connection.prepareStatement(query);
        stmt.setString(1, sessionID);
        ResultSet rs = stmt.executeQuery();
        while (rs.next()) {
            query = "SELECT count(*) FROM ANSWER WHERE qID = ? AND sessionID = ?";
            PreparedStatement stmt2 = connection.prepareStatement(query);
            stmt2.setInt(1, rs.getInt(1));
            stmt2.setString(2, sessionID);
            ResultSet rs2 = stmt2.executeQuery();
            rs2.next();
            count = count + rs2.getInt(1);
        }
        return count;
    }

    /**
     * A method to create a new token
     * @param userID the user to create the token for
     * @return the newly created token
     * @throws SQLException
     */
    public String newToken(int userID) throws SQLException {
        String query = "SELECT * FROM USER_TOKEN WHERE userID = ?";
        PreparedStatement stmt = connection.prepareStatement(query);
        stmt.setInt(1, userID);
        ResultSet rs = stmt.executeQuery();
        String newToken = generateToken();
        if (rs.next()) {
            query = "UPDATE USER_TOKEN SET token = ? WHERE userID = ?";
            PreparedStatement stmt2 = connection.prepareStatement(query);
            stmt2.setString(1, newToken);
            stmt2.setInt(2, userID);
            stmt2.executeUpdate();
        } else {
            query = "INSERT INTO USER_TOKEN (token, userID) VALUES (?, ?)";
            PreparedStatement stmt2 = connection.prepareStatement(query);
            stmt2.setString(1, newToken);
            stmt2.setInt(2, userID);
            stmt2.executeUpdate();
        }
        return newToken;
    }

    /**
     * A method to create a new watch token
     * @param userID the user to create the token for
     * @return the newly created watch token
     * @throws SQLException
     */
    public String newWatchToken(int userID) throws SQLException {
        String query = "SELECT * FROM USER_TOKEN WHERE userID = ?";
        PreparedStatement stmt = connection.prepareStatement(query);
        stmt.setInt(1, userID);
        ResultSet rs = stmt.executeQuery();
        String newWatchToken = generateToken();
        if (rs.next()) {
            query = "UPDATE USER_TOKEN SET watchToken = ? WHERE userID = ?";
            PreparedStatement stmt2 = connection.prepareStatement(query);
            stmt2.setString(1, newWatchToken);
            stmt2.setInt(2, userID);
            stmt2.executeUpdate();
        } else {
            query = "INSERT INTO USER_TOKEN (watchToken, userID) VALUES (?, ?)";
            PreparedStatement stmt2 = connection.prepareStatement(query);
            stmt2.setString(1, newWatchToken);
            stmt2.setInt(2, userID);
            stmt2.executeUpdate();
        }
        return newWatchToken;
    }

    /**
     * A method to delete a token
     * @param token the token to delete
     * @return true if the token is deleted with no errors
     * @throws SQLException
     */
    public Boolean expireToken(String token) throws SQLException {
        String query = "DELETE FROM USER_TOKEN WHERE token = ?";
        PreparedStatement stmt = connection.prepareStatement(query);
        stmt.setString(1, token);
        stmt.executeUpdate();
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
        String query = "INSERT INTO MODERATOR_SESSION VALUES(?, ?)";
        PreparedStatement stmt = connection.prepareStatement(query);
        stmt.setInt(1, user.getId());
        stmt.setString(2, sessionID);
        stmt.executeUpdate();
        return true;
    }

    /**
     * A method to get the user by their token
     * @param token the token that belongs to the user
     * @return the user with the given token if found, otherwise null
     * @throws SQLException
     */
    public User getUserByToken(String token) throws SQLException {
        String query = "SELECT userID FROM USER_TOKEN WHERE token = ?";
        PreparedStatement stmt = connection.prepareStatement(query);
        stmt.setString(1, token);
        ResultSet rs = stmt.executeQuery();
        if (rs.next()) {
            query = "SELECT * FROM USER WHERE id = ?";
            PreparedStatement stmt2 = connection.prepareStatement(query);
            stmt2.setInt(1, rs.getInt("userID"));
            ResultSet rs2 = stmt2.executeQuery();
            if (rs2.next()) {
                return new User(rs2.getInt("id"), rs2.getString("fname"), rs2.getString("lname"),
                        rs2.getString("email"));
            }
        }
        return null;
    }

    /**
     * A method to get the user by their watch token
     * @param watchToken the watch token that belongs to the user
     * @return the user with the given watch token if found, otherwise null
     * @throws SQLException
     */
    public User getUserByWatchToken(String watchToken) throws SQLException {
        String query = "SELECT userID FROM USER_TOKEN WHERE watchToken = ?";
        PreparedStatement stmt = connection.prepareStatement(query);
        stmt.setString(1, watchToken);
        ResultSet rs = stmt.executeQuery();
        if (rs.next()) {
            query = "SELECT * FROM USER WHERE id = ?";
            PreparedStatement stmt2 = connection.prepareStatement(query);
            stmt2.setInt(1, rs.getInt("userID"));
            ResultSet rs2 = stmt2.executeQuery();
            if (rs2.next()) {
                return new User(rs2.getInt("id"), rs2.getString("fname"), rs2.getString("lname"),
                        rs2.getString("email"));
            }
        }
        return null;
    }

    /**
     * A method to get the user by their email
     * @param email the email that belongs to the user
     * @return the user with the given email if found, otherwise null
     * @throws SQLException
     */
    public User getUserByEmail(String email) throws SQLException {
        String query = "SELECT * FROM USER WHERE email = ?";
        PreparedStatement stmt = connection.prepareStatement(query);
        stmt.setString(1, email);
        ResultSet rs = stmt.executeQuery();
        if (rs.next()) {
            return new User(rs.getInt("id"), rs.getString("fname"), rs.getString("lname"), rs.getString("email"));
        }
        return null;
    }

    /**
     * A method to get the user by their id
     * @param id the id that belongs to the user
     * @return the user with the given id if found, otherwise null
     * @throws SQLException
     */
    public User getUserByID(int id) throws SQLException {
        String query = "SELECT * FROM USER WHERE id = ?";
        PreparedStatement stmt = connection.prepareStatement(query);
        stmt.setInt(1, id);
        ResultSet rs = stmt.executeQuery();
        if (rs.next()) {
            return new User(rs.getInt("id"), rs.getString("fname"), rs.getString("lname"), rs.getString("email"));
        }
        return null;
    }

    /**
     * A method to check if a user is a moderator
     * @param user the user to check
     * @param sessionID the session to check in
     * @return true if the user is a moderator, otherwise false
     * @throws SQLException
     */
    public Boolean userIsModerator(User user, String sessionID) throws SQLException {
        String query = "SELECT * FROM MODERATOR_SESSION WHERE userID = ? AND sessionID = ?";
        PreparedStatement stmt = connection.prepareStatement(query);
        stmt.setInt(1, user.getId());
        stmt.setString(2, sessionID);
        ResultSet rs = stmt.executeQuery();
        if (rs.next()) {
            return true;
        }
        return false;
    }

    /**
     * A method to get the moderators of a given session
     * @param sessionID the session to get the moderators from
     * @return a list of users that are moderators in the session
     * @throws SQLException
     */
    public ArrayList<User> getSessionModerators(String sessionID) throws SQLException {
        String query = "SELECT * FROM MODERATOR_SESSION WHERE sessionID = ?";
        PreparedStatement stmt = connection.prepareStatement(query);
        stmt.setString(1, sessionID);
        ResultSet rs = stmt.executeQuery();
        ArrayList<User> moderators = new ArrayList<User>();
        while (rs.next()) {
            moderators.add(getUserByID(rs.getInt("userID")));
        }
        return moderators;
    }

    /**
     * A method to check if a user is the session host
     * @param user the user to check
     * @param sessionID the session to check
     * @return true if the user is the session host, otherwise false
     * @throws SQLException
     */
    public Boolean userIsSessionHost(User user, String sessionID) throws SQLException {
        String query = "SELECT * FROM SESH WHERE id = ? AND userID = ?";
        PreparedStatement stmt = connection.prepareStatement(query);
        stmt.setString(1, sessionID);
        stmt.setInt(2, user.getId());
        ResultSet rs = stmt.executeQuery();
        if (rs.next()) {
            return true;
        }
        return false;
    }

    /**
     * A method to check if a session exists with the given id
     * @param sessionID the id to check
     * @return true if the session exists, otherwise false
     * @throws SQLException
     */
    public Boolean sessionExists(String sessionID) throws SQLException {
        String query = "SELECT * FROM SESH WHERE id = ?";
        PreparedStatement stmt = connection.prepareStatement(query);
        stmt.setString(1, sessionID);
        ResultSet rs = stmt.executeQuery();
        if (rs.next()) {
            return true;
        }
        return false;
    }

    /**
     * A method to check if a series exists with the given id
     * @param seriesID the id to check
     * @return true if the series exists, otherwise false
     * @throws SQLException
     */
    public Boolean seriesExists(String seriesID) throws SQLException {
        String query = "SELECT * FROM SERIES WHERE id = ?";
        PreparedStatement stmt = connection.prepareStatement(query);
        stmt.setString(1, seriesID);
        ResultSet rs = stmt.executeQuery();
        if (rs.next()) {
            return true;
        }
        return false;
    }

    /**
     * A method to end a session
     * @param sessionID the session to end
     * @return true if the session is ended without any errors
     * @throws SQLException
     */
    public Boolean endSession(String sessionID) throws SQLException {
        String query = "UPDATE SESH SET ended = ? WHERE id = ?";
        PreparedStatement stmt = connection.prepareStatement(query);
        stmt.setBoolean(1, true);
        stmt.setString(2, sessionID);
        stmt.executeUpdate();
        query = "DELETE FROM ATTENDEE_SESSION WHERE sessionID = ?";
        PreparedStatement stmt2 = connection.prepareStatement(query);
        stmt2.setString(1, sessionID);
        stmt2.executeUpdate();
        return true;
    }

    /**
     * A method to check if a session has ended
     * @param sessionID the session id to check
     * @return true if the session has ended, otherwise false
     * @throws SQLException
     */
    public Boolean sessionEnded(String sessionID) throws SQLException {
        String query = "SELECT ended FROM SESH WHERE id = ?";
        PreparedStatement stmt = connection.prepareStatement(query);
        stmt.setString(1, sessionID);
        ResultSet rs = stmt.executeQuery();
        if (rs.next()) {
            return rs.getBoolean("ended");
        }
        return true;
    }

    /**
     * A method to get a host session
     * @param sessionID the id of the session to get
     * @return the host session if it is found, otherwise null
     * @throws SQLException
     */
    public HostSesh getHostSessionByID(String sessionID) throws SQLException {
        String query = "SELECT * FROM SESH WHERE id = ?";
        PreparedStatement stmt = connection.prepareStatement(query);
        stmt.setString(1, sessionID);
        ResultSet rs = stmt.executeQuery();
        if (rs.next()) {
            return new HostSesh(sessionID, rs.getString("seriesID"), rs.getString("sname"), rs.getFloat("mood"),
                    getUserByID(rs.getInt("userID")), rs.getBoolean("ended"), loadPushedQuestions(sessionID),
                    loadChat(sessionID), rs.getString("secure"), loadHiddenQuestions(sessionID),
                    loadMoodDates(sessionID), getSessionModerators(sessionID));
        }
        return null;
    }

    /**
     * A method to get the mood dates of a session
     * @param sessionID the session to get the mood dates from
     * @return the mood dates of the session
     * @throws SQLException
     */
    private ArrayList<MoodDate> loadMoodDates(String sessionID) throws SQLException {
        ArrayList<MoodDate> mds = new ArrayList<MoodDate>();
        String query = "SELECT * FROM MOOD_DATE WHERE sessionID = ?";
        PreparedStatement stmt = connection.prepareStatement(query);
        stmt.setString(1, sessionID);
        ResultSet rs = stmt.executeQuery();
        MoodDate md;
        while (rs.next()) {
            md = new MoodDate(rs.getFloat("mood"), rs.getTimestamp("stamp"));
            mds.add(md);
        }
        return mds;
    }

    /**
     * A method to fetch chat messages in a session
     * @param sessionID the session to load the messages
     * @return the chat from the given session
     * @throws SQLException
     */
    private Chat loadChat(String sessionID) throws SQLException {
        Chat chat = new Chat();

        String query = "SELECT * FROM MESSAGES WHERE sessionID = ? ORDER BY stamp ASC";
        PreparedStatement stmt = connection.prepareStatement(query);
        stmt.setString(1, sessionID);
        ResultSet rs = stmt.executeQuery();
        Message m;
        Boolean anon;
        while (rs.next()) {
            anon = rs.getBoolean("anon");
            if (anon) {
                m = new Message(new User("anonymous", "anonymous", "a@a.a"), rs.getString("msg"),
                        rs.getTimestamp("stamp"), anon, rs.getInt("id"));
            } else {
                m = new Message(getUserByID(rs.getInt("userID")), rs.getString("msg"), rs.getTimestamp("stamp"), anon,
                        rs.getInt("id"));
            }
            chat.addMessage(m);
        }
        return chat;
    }

    /**
     * A method to load the hidden questions in a session
     * @param sessionID the session to load the hidden questions from
     * @return the hidden questions from the given session
     * @throws SQLException
     */
    private ArrayList<Question> loadHiddenQuestions(String sessionID) throws SQLException {
        ArrayList<Question> questions = new ArrayList<Question>();
        String query = "SELECT * FROM QUESTION WHERE sessionID =? AND pushed = ?";
        PreparedStatement stmt = connection.prepareStatement(query);
        stmt.setString(1, sessionID);
        stmt.setBoolean(2, false);
        ResultSet rs = stmt.executeQuery();
        int qID;
        while (rs.next()) {
            qID = rs.getInt("id");
            Question q = new Question(rs.getString("question"), loadAnswers(sessionID, qID), qID,
                    rs.getBoolean("pushed"), rs.getBoolean("general"), rs.getFloat("mood"));
            questions.add(q);
        }
        return questions;
    }

    /**
     * A method to load the pushed questions in a session
     * @param sessionID the session to load the pushed questions from
     * @return the pushed questions from the given session
     * @throws SQLException
     */
    private ArrayList<Question> loadPushedQuestions(String sessionID) throws SQLException {
        ArrayList<Question> questions = new ArrayList<Question>();
        String query = "SELECT * FROM QUESTION WHERE sessionID =? AND pushed = ?";
        PreparedStatement stmt = connection.prepareStatement(query);
        stmt.setString(1, sessionID);
        stmt.setBoolean(2, true);
        ResultSet rs = stmt.executeQuery();
        int qID;
        while (rs.next()) {
            qID = rs.getInt("id");
            Question q = new Question(rs.getString("question"), loadAnswers(sessionID, qID), qID,
                    rs.getBoolean("pushed"), rs.getBoolean("general"), rs.getFloat("mood"));
            questions.add(q);
        }
        return questions;
    }

    /**
     * A method to get the answers for a given question in a session
     * @param sessionID the session the question is from
     * @param qID the question to get the answers for
     * @return a list of the answers to the given question
     * @throws SQLException
     */
    private ArrayList<Answer> loadAnswers(String sessionID, int qID) throws SQLException {
        ArrayList<Answer> answers = new ArrayList<Answer>();
        String query = "SELECT * FROM ANSWER WHERE sessionID =? AND qID = ?";
        PreparedStatement stmt = connection.prepareStatement(query);
        stmt.setString(1, sessionID);
        stmt.setInt(2, qID);
        ResultSet rs = stmt.executeQuery();
        Answer a;
        Boolean anon;
        while (rs.next()) {

            anon = rs.getBoolean("anon");
            if (anon) {
                a = new Answer(new User("anonymous", "anonymous", "a@a.a"), rs.getInt("reaction"),
                        rs.getString("context"), rs.getTimestamp("stamp"), anon);
            } else {
                a = new Answer(getUserByID(rs.getInt("userID")), rs.getInt("reaction"), rs.getString("context"),
                        rs.getTimestamp("stamp"), anon);
            }
            answers.add(a);
        }
        return answers;
    }

    /**
     * A method to check if there is an account with the given email
     * @param email the email to check
     * @return true if the email has an account linked to it, otherwise false
     * @throws SQLException
     */
    public Boolean emailExists(String email) throws SQLException {
        String query = "SELECT * FROM USER WHERE email = ?";
        PreparedStatement stmt = connection.prepareStatement(query);
        stmt.setString(1, email);
        ResultSet rs = stmt.executeQuery();
        if (rs.next()) {
            return true;
        }
        return false;
    }

    /**
     * A method to add a user to a session
     * @param sessionID the session to add the user to
     * @param userID the user to add to the session
     * @return true if the user is added to the session with no errors
     * @throws SQLException
     */
    public Boolean addUserToSession(String sessionID, int userID) throws SQLException {
        String query = "INSERT INTO ATTENDEE_SESSION VALUES(?,?)";
        PreparedStatement stmt = connection.prepareStatement(query);
        stmt.setInt(1, userID);
        stmt.setString(2, sessionID);
        stmt.executeUpdate();
        return true;
    }

    /**
     * A method to check if a user is an attendee of a session
     * @param sessionID the session to check if the user is an attendee in
     * @param userID the user to check
     * @return true if the user is an attendee, othwerwise false
     * @throws SQLException
     */
    public Boolean userIsAttendee(String sessionID, int userID) throws SQLException {
        String query = "SELECT * FROM ATTENDEE_SESSION WHERE userID = ? AND sessionID = ?";
        PreparedStatement stmt = connection.prepareStatement(query);
        stmt.setInt(1, userID);
        stmt.setString(2, sessionID);
        ResultSet rs = stmt.executeQuery();
        if (rs.next()) {
            return true;
        }
        return false;
    }

    /**
     * A method to check if a question exists with the given id
     * @param sessionID the session to check for the question in
     * @param questionID the question to see if it exists
     * @return true if the question exists, otherwise false
     * @throws SQLException
     */
    public Boolean questionExists(String sessionID, int questionID) throws SQLException {
        String query = "SELECT * FROM QUESTION WHERE id =  ? AND sessionID = ?";
        PreparedStatement stmt = connection.prepareStatement(query);
        stmt.setInt(1, questionID);
        stmt.setString(2, sessionID);
        ResultSet rs = stmt.executeQuery();
        if (rs.next()) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * A method to get the password of a given session
     * @param sessionID the session to get the password for
     * @return the password of the session
     * @throws SQLException
     */
    public String getSessionPassword(String sessionID) throws SQLException {
        String query = "SELECT secure FROM SESH WHERE id = ?";
        PreparedStatement stmt = connection.prepareStatement(query);
        stmt.setString(1, sessionID);
        ResultSet rs = stmt.executeQuery();
        rs.next();
        return rs.getString("secure");
    }

    /**
     * A method to delete a session
     * @param sessionID the session to delete
     * @return true if the session is deleted without any errors
     * @throws SQLException
     */
    public Boolean deleteSession(String sessionID) throws SQLException {
        String query = "DELETE FROM SESH WHERE id = ?";
        PreparedStatement stmt = connection.prepareStatement(query);
        stmt.setString(1, sessionID);
        stmt.executeUpdate();
        return true;
    }

    /**
     * A method to generate a token
     * @return the newly generated token
     */
    private String generateToken() {

        Random r = new Random();

        String alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
        String token = "";
        for (int i = 0; i < 32; i++) {
            token = token + alphabet.charAt(r.nextInt(alphabet.length()));
        }

        return token;
    }

}