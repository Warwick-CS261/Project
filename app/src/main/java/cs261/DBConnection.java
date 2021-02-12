package cs261;
import java.sql.*;
import java.util.Random;

public class DBConnection {

    private Connection connection;

    public DBConnection(String url) throws SQLException {

        this.connection = DriverManager.getConnection(url);

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
        return rs.getInt(0);
    }

    public String ott(String token) throws SQLException{
        String query = "SELECT userID FROM USER_TOKEN WHERE token = ?";
        PreparedStatement stmt = connection.prepareStatement(query);
        stmt.setString(1, token);
        ResultSet rs = stmt.executeQuery();
        if(rs.next()){
            String newToken = generateToken();
            query = "UPDATE USER_TOKEN SET token = ? WHERE userID = ";
            PreparedStatement stmt2 = connection.prepareStatement(query);
            stmt2.setString(1, newToken);
            stmt2.setInt(2, rs.getInt("userID"));
            stmt2.executeUpdate();
            return newToken;
        }
        return null;
    }

    public User getUserByToken(String token) throws SQLException{
        String query = "SELECT userID FROM USER_TOKEN WHERE token = ?";
        PreparedStatement stmt = connection.prepareStatement(query);
        stmt.setString(1, token);
        ResultSet rs = stmt.executeQuery();
        if(rs.next()){
            query = "SELECT * FROM USER WHERE userID = ?";
            PreparedStatement stmt2 = connection.prepareStatement(query);
            stmt.setInt(1, rs.getInt("userID"));
            ResultSet rs2 = stmt2.executeQuery();
            if(rs2.next()){
                return new User(rs2.getInt("userID"), rs2.getString("fname"), rs2.getString("lname"), rs2.getString("email"));
            }
        }
        return null;
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