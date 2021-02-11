package cs261;
import java.sql.*;

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

}