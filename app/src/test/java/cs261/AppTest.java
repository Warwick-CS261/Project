/*
 * This Java source file was generated by the Gradle 'init' task.
 */
package cs261;
import java.sql.*;
import java.util.*;


import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class AppTest {

    @Test void testDB() throws SQLException {
        Connection connection = DriverManager.getConnection("jdbc:sqlite:database/database.db");
        DBConnection db = new DBConnection("jdbc:sqlite:database/database.db");
        User u = new User("jiayi","Xu","996616811@qq.com");
        db.createUser(new User("jiayi","Xu","996616811@qq.com"), "000", "111");
        String query = "SELECT * FROM USER WHERE email = '996616811@qq.com'"+
                        " AND phash = '000' AND fname = 'jiayi' AND lname = 'Xu' AND salt = '111'";
        PreparedStatement stmt = connection.prepareStatement(query);
        ResultSet rs = stmt.executeQuery();

        assertNotNull(rs, "DBConnection.createUser fail");
        assertNull(db.verifyPassword("996616811@qq.com", "111"),"DBConnection.verifyPassword fail");
        assertNull(db.verifyPassword("000000000@qq.com", "000"),"DBConnection.verifyPassword fail");
        assertNotNull(db.verifyPassword("996616811@qq.com", "000"),"DBConnectiondb.verifyPassword fail");
        HostSesh s = new HostSesh("ABCDEF", "1", "test", u, "ABCDEF");
        db.createSession(s);
        query = "SELECT userID FROM SESH WHERE id = 'ABCDEF'"+
                        " AND seriesID = 1 AND sname = 'test' AND secure = 'ABCDEF'";
        stmt = connection.prepareStatement(query);
        rs = stmt.executeQuery();
        assertNotNull(rs, "DBConnection.createUser fail");
        if(rs.next()){
            String query2 = "SELECT * FROM USER WHERE id = ?"+
                            " AND fname = 'jiayi' AND lname = 'Xu'";
            PreparedStatement stmt2 = connection.prepareStatement(query2);
            stmt2.setInt(1, rs.getInt(1));
            ResultSet rs2 = stmt2.executeQuery();
            assertNotNull(rs2, "DBConnection.createUser fail");
        }
    }

    @Test void appHasAGreeting() {
        App classUnderTest = new App();
        //assertNotNull(classUnderTest.getGreeting(), "app should have a greeting");
    }
}

