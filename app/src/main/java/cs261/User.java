package cs261;

public class User {
    int id;
    String fname;
    String lname;
    String email;

    public User(int id, String fname, String lname, String email){
        this.id = id;
        this.fname = fname;
        this.lname = lname;
        this.email = email;
    }

    public User(String fname, String lname, String email){
        this.id = -1;
        this.fname = fname;
        this.lname = lname;
        this.email = email;
    }

    public String getEmail() {
        return email;
    }

    public String getFname() {
        return fname;
    }

    public String getLname() {
        return lname;
    }

    public int getId() {
        return id;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setFname(String fname) {
        this.fname = fname;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setLname(String lname) {
        this.lname = lname;
    }
}