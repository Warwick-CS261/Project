package cs261;

import java.sql.*;
import java.util.*;

public class DBConnection {

    private Connection connection;

    public DBConnection(String url) throws SQLException {

        this.connection = DriverManager.getConnection(url);

    }

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
        return s;
    }

    public Question createQuestion(Question q, String sessionID) throws SQLException {
        int qs = numOfSessQuest(sessionID);
        String query = "INSERT INTO QUESTION VALUES(?,?,?,?)";
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

    public MoodDate createMoodDate(String sessionID, MoodDate moodDate) throws SQLException {
        String query = "INSERT INTO MOOD_DATE VALUES(?, ?, ?)";
        PreparedStatement stmt = connection.prepareStatement(query);
        stmt.setString(1, sessionID);
        stmt.setDate(2, new java.sql.Date(moodDate.getDate().getTime()));
        stmt.setFloat(3, moodDate.getMood());
        stmt.executeUpdate();
        return moodDate;
    }

    public Boolean pushQuestion(String sessionId, int questionID) throws SQLException {
        String query = "UPDATE QUESTION SET pushed = 1 WHERE id = ? & sessionID = ?";
        PreparedStatement stmt = connection.prepareStatement(query);
        stmt.setInt(1, questionID);
        stmt.setString(2, sessionId);
        stmt.executeUpdate();
        return true;
    }

    public Boolean endQuestion(String sessionId, int questionID) throws SQLException {
        String query = "UPDATE QUESTION SET pushed = 0 WHERE id = ? & sessionID = ?";
        PreparedStatement stmt = connection.prepareStatement(query);
        stmt.setInt(1, questionID);
        stmt.setString(2, sessionId);
        stmt.executeUpdate();
        return true;
    }

    // needs to filter out duplicates
    public Series getUserSessions(int userID) throws SQLException {
        String query = "SELECT id FROM SESH WHERE userID = ?";
        Series userSeries = new Series(-1, "userssesiions");
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

    public Question getQuestionByID(String sessionID, int qID) throws SQLException {
        String query = "SELECT * FROM QUESTION id = ? & sessionID = ?";
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

    public Boolean deleteQuestion(String sessionID, int questionID) throws SQLException {
        String query = "DELETE FROM QUESTION WHERE id = ? AND sessionID = ?";
        PreparedStatement stmt = connection.prepareStatement(query);
        stmt.setInt(1, questionID);
        stmt.setString(2, sessionID);
        stmt.executeUpdate();
        return true;
    }

    public int numOfSessMsg(String sessionID) throws SQLException {
        String query = "SELECT COUNT(id) FROM MESSAGES WHERE sessionID = ?";
        PreparedStatement stmt = connection.prepareStatement(query);
        stmt.setString(1, sessionID);
        ResultSet rs = stmt.executeQuery();
        rs.next();
        return rs.getInt(1);
    }

    private int numOfSessQuest(String sessionID) throws SQLException {
        String query = "SELECT COUNT(id) FROM QUESTION WHERE sessionID = ?";
        PreparedStatement stmt = connection.prepareStatement(query);
        stmt.setString(1, sessionID);
        ResultSet rs = stmt.executeQuery();
        rs.next();
        return rs.getInt(1);
    }

    public int numOfAnswersToQ(String sessionID, int qID) throws SQLException {
        String query = "SELECT COUNT(id) FROM QUESTION WHERE sessionID = ? AND qID = ?";
        PreparedStatement stmt = connection.prepareStatement(query);
        stmt.setString(1, sessionID);
        stmt.setInt(2, qID);
        ResultSet rs = stmt.executeQuery();
        rs.next();
        return rs.getInt(1);
    }

    public float getSessionMood(String sessionID) throws SQLException {
        String query = "SELECT mood FROM SESH WHERE id = ?";
        PreparedStatement stmt = connection.prepareStatement(query);
        stmt.setString(1, sessionID);
        ResultSet rs = stmt.executeQuery();
        rs.next();
        return rs.getFloat(1);
    }

    public Boolean setSessionMood(String sessionID, float mood) throws SQLException {
        String query = "UPDATE SESH SET mood = ? WHERE id =?";
        PreparedStatement stmt = connection.prepareStatement(query);
        stmt.setFloat(1, mood);
        stmt.setString(2, sessionID);
        stmt.executeUpdate();
        return true;
    }

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

    public Boolean expireToken(String token) throws SQLException {
        String query = "DELETE FROM USER_TOKEN WHERE token = ?";
        PreparedStatement stmt = connection.prepareStatement(query);
        stmt.setString(1, token);
        stmt.executeUpdate();
        return true;
    }

    public Boolean addModerator(User user, String sessionID) throws SQLException {
        String query = "INSERT INTO MODERATOR_SESSION VALUES(?, ?)";
        PreparedStatement stmt = connection.prepareStatement(query);
        stmt.setInt(1, user.getId());
        stmt.setString(2, sessionID);
        stmt.executeUpdate();
        return true;
    }

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

    public Boolean endSession(String sessionID) throws SQLException {
        String query = "UPDATE SESH SET ended = ? WHERE id = ?";
        PreparedStatement stmt = connection.prepareStatement(query);
        stmt.setBoolean(1, true);
        stmt.setString(2, sessionID);
        stmt.executeUpdate();
        return true;
    }

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

    public Boolean addUserToSession(String sessionID, int userID) throws SQLException {
        String query = "INSERT INTO ATTENDEE_SESSION VALUES(?,?)";
        PreparedStatement stmt = connection.prepareStatement(query);
        stmt.setInt(1, userID);
        stmt.setString(2, sessionID);
        stmt.executeUpdate();
        return true;
    }

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

    public String getSessionPassword(String sessionID) throws SQLException {
        String query = "SELECT secure FROM SESH WHERE id = ?";
        PreparedStatement stmt = connection.prepareStatement(query);
        stmt.setString(1, sessionID);
        ResultSet rs = stmt.executeQuery();
        rs.next();
        return rs.getString("secure");
    }

    public Boolean deleteSession(String sessionID) throws SQLException {
        String query = "DELETE FROM SESSION WHERE sessionID = ?";
        PreparedStatement stmt = connection.prepareStatement(query);
        stmt.setString(1, sessionID);
        stmt.executeUpdate();
        return true;
    }

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