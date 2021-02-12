package cs261;
import java.sql.*;
import java.util.Random;


public class DBConnection {

    private Connection connection;

    public DBConnection(String url) throws SQLException {

        this.connection = DriverManager.getConnection(url);

    }

    public Boolean createUser(User u,String pword, String salt) throws SQLException{
        String query = "INSERT INTO USER (fName, lName, email, phash, salt) VALUES(?,?,?,?,?)";
        PreparedStatement stmt = connection.prepareStatement(query);
        stmt.setString(1, u.getFname());
        stmt.setString(2, u.getLname());
        stmt.setString(3, u.getEmail());
        stmt.setString(4, pword);//must change
        stmt.setString(5, salt);//must change
        stmt.executeUpdate();
        return true;
    }

    public User verifyPassword(String email, String pword) throws SQLException{
        String query = "SELECT * FROM USER WHERE email = ? AND phash = ?";
        PreparedStatement stmt = connection.prepareStatement(query);
        stmt.setString(1, email);
        stmt.setString(2, pword);
        ResultSet rs = stmt.executeQuery();
        if(rs.next()){
            return new User(rs.getInt("id"), rs.getString("fname"), rs.getString("lname"), rs.getString("email"));
        }
        return null;
    } 

    public Boolean createSession(HostSesh s) throws SQLException{
        String query = "INSERT INTO SESH VALUES(?,?,?,?,?,?,0)";
        PreparedStatement stmt = connection.prepareStatement(query);
        stmt.setString(1, s.getId());
        stmt.setInt(2, s.getSeriesID());
        stmt.setString(3, s.getSessionName());
        stmt.setFloat(4, s.getMood());
        stmt.setString(5, s.getSecure());
        stmt.setInt(6, s.getOwner().getId());
        stmt.executeUpdate();
        return true;
    }

    public Boolean createQuestion(Question q, String sessionID) throws SQLException{
        int qs = numOfSessQuest(sessionID);
        String query = "INSERT INTO QUESTION VALUES(?,?,?,0)";
        PreparedStatement stmt = connection.prepareStatement(query);
        stmt.setInt(1, qs);
        stmt.setString(2, sessionID);
        stmt.setString(3, q.getQuestion());
        stmt.executeUpdate();
        return true;
    }

    private int numOfSessQuest(String sessionID)throws SQLException{
        String query = "SELECT COUNT(id) FROM QUESTION WHERE sessionID = ?";
        PreparedStatement stmt = connection.prepareStatement(query);
        stmt.setString(1, sessionID);
        ResultSet rs = stmt.executeQuery();
        rs.next();
        return rs.getInt(1);
    }

    public String newToken(int userID) throws SQLException{
        String query = "SELECT * FROM USER_TOKEN WHERE userID = ?";
        PreparedStatement stmt = connection.prepareStatement(query);
        stmt.setInt(1, userID);
        ResultSet rs = stmt.executeQuery();
        String newToken = generateToken();
        if(rs.next()){
            query = "UPDATE USER_TOKEN SET token = ? WHERE userID = ?";
            PreparedStatement stmt2 = connection.prepareStatement(query);
            stmt2.setString(1, newToken);
            stmt2.setInt(2, userID);
            stmt2.executeUpdate();
        }else{
            query = "INSERT INTO USER_TOKEN (token, userID) VALUES (?, ?)";
            PreparedStatement stmt2 = connection.prepareStatement(query);
            stmt2.setString(1, newToken);
            stmt2.setInt(2, userID);
            stmt2.executeUpdate();
        }
        return newToken;
    }

    public Boolean expireToken(String token) throws SQLException{
        String query = "DELETE FROM USER_TOKEN WHERE token = ?";
        PreparedStatement stmt = connection.prepareStatement(query);
        stmt.setString(1, token);
        stmt.executeUpdate();
        return true;
    }

    public Boolean addModerator(int userID, String sessionID) throws SQLException{
        String query = "INSERT INTO MODERATOR_SESSION VALUES(?, ?)";
        PreparedStatement stmt = connection.prepareStatement(query);
        stmt.setInt(1, userID);
        stmt.setString(1, sessionID);
        stmt.executeUpdate();
        return true;
    }

    public User getUserByToken(String token) throws SQLException{
        String query = "SELECT userID FROM USER_TOKEN WHERE token = ?";
        PreparedStatement stmt = connection.prepareStatement(query);
        stmt.setString(1, token);
        ResultSet rs = stmt.executeQuery();
        if(rs.next()){
            query = "SELECT * FROM USER WHERE id = ?";
            PreparedStatement stmt2 = connection.prepareStatement(query);
            stmt2.setInt(1, rs.getInt("userID"));
            ResultSet rs2 = stmt2.executeQuery();
            if(rs2.next()){
                return new User(rs2.getInt("id"), rs2.getString("fname"), rs2.getString("lname"), rs2.getString("email"));
            }
        }
        return null;
        //return new User(1, "Place", "Holder", "place@holder.com");
    }

    public User getUserByEmail(String email) throws SQLException{
        String query = "SELECT * FROM USER WHERE email = ?";
        PreparedStatement stmt = connection.prepareStatement(query);
        stmt.setString(1, email);
        ResultSet rs = stmt.executeQuery();
        if(rs.next()){
            return new User(rs.getInt("id"), rs.getString("fname"), rs.getString("lname"), rs.getString("email"));
        }
        return null;
    }

    public Boolean setModerator(int userID, String sessionID) throws SQLException{
        String query = "INSERT INTO MODERATOR_SESSION VALUES(?,?)";
        PreparedStatement stmt = connection.prepareStatement(query);
        stmt.setInt(1, userID);
        stmt.setString(2, sessionID);
        stmt.executeUpdate();
        return false;
    }

    public Boolean userIsModerator(int userID, String sessionID) throws SQLException{
        String query = "SELECT * FROM MODERATOR_SESSION WHERE userID = ? AND sessionID = ?";
        PreparedStatement stmt = connection.prepareStatement(query);
        stmt.setInt(1, userID);
        stmt.setString(2, sessionID);
        ResultSet rs = stmt.executeQuery();
        if(rs.next()){
            return true;
        }
        return false;
        
    }

    public Boolean userIsSessionHost(int userID, String sessionID) throws SQLException{
        String query = "SELECT * FROM SESH WHERE id = ? AND userID = ?";
        PreparedStatement stmt = connection.prepareStatement(query);
        stmt.setString(1, sessionID);
        stmt.setInt(2, userID);
        ResultSet rs = stmt.executeQuery();
        if(rs.next()){
            return true;
        }
        return false;
    }

    public Boolean sessionExists(String sessionID) throws SQLException{
        String query = "SELECT * FROM SESH WHERE id = ?";
        PreparedStatement stmt = connection.prepareStatement(query);
        stmt.setString(1, sessionID);
        ResultSet rs = stmt.executeQuery();
        if(rs.next()){
            return true;
        }
        return false;
    }

    public Boolean emailExists(String email) throws SQLException{
        String query = "SELECT * FROM USER WHERE email = ?";
        PreparedStatement stmt = connection.prepareStatement(query);
        stmt.setString(1, email);
        ResultSet rs = stmt.executeQuery();
        if(rs.next()){
            return true;
        }
        return false;
    }

    private String generateToken(){
    
        Random r = new Random();
    
        String alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890?<>{}[]()&%!/^;:+=-_";
        String token ="";
        for (int i = 0; i < 32; i++) {
            token = token +alphabet.charAt(r.nextInt(alphabet.length()));
        }

        return token;
    }

}