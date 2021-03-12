package cs261;

import java.util.ArrayList;
import java.util.Objects;

public class HostSesh extends Sesh {

    String secure;
    ArrayList<Question> hiddenQuestions;
    ArrayList<MoodDate> moodHistory;
    float mood;

    public HostSesh(String id, String seriesID, String sessionName, float mood, User owner, Boolean finished,
            ArrayList<Question> pushedquestions, Chat chat, String secure, ArrayList<Question> hiddenQuestions,
            ArrayList<MoodDate> moodHistory, ArrayList<User> moderators) {
        super(id, seriesID, sessionName, owner, finished, chat, pushedquestions, moderators);
        if (Objects.isNull(secure)) {
            this.secure = "";
        } else {
            this.secure = secure;
        }
        this.hiddenQuestions = hiddenQuestions;
        this.moodHistory = moodHistory;
        this.mood = mood;
    }

    public HostSesh(String id, String seriesID, String sessionName, User owner, String secure) {
        super(id, seriesID, sessionName, owner);
        if (Objects.isNull(secure)) {
            this.secure = "";
        } else {
            this.secure = secure;
        }
        this.mood = 0;
        this.hiddenQuestions = new ArrayList<Question>();
        this.moodHistory = new ArrayList<MoodDate>();
    }

    public Sesh convertToSesh() {
        Sesh s = new Sesh(id, seriesID, sessionName, owner, finished, chat, new ArrayList<Question>(pushedQuestions),
                moderators);
        for (Question q : s.getPushedQuestions()) {
            q.setAnswers(new ArrayList<Answer>());
        }
        return s;
    }

    public Boolean pushQuestion(int qID) {
        for (Question q : hiddenQuestions) {
            if (q.getID() == qID) {
                hiddenQuestions.remove(q);
                pushedQuestions.add(q);
                q.setPushed(false);
                return true;
            }
        }
        return false;

    }

    public Boolean pullQuestion(int qID) {
        for (Question q : pushedQuestions) {
            if (q.getID() == qID) {
                pushedQuestions.remove(q);
                hiddenQuestions.add(q);
                q.setPushed(true);
                return true;
            }
        }
        return false;

    }

    public Question getQuestionByID(int id) {
        for (Question q : pushedQuestions) {
            if (q.getID() == id) {
                return q;
            }
        }
        for (Question q : hiddenQuestions) {
            if (q.getID() == id) {
                return q;
            }
        }
        return null;
    }

    public Question deleteQuestionByID(int id) {
        for (Question q : pushedQuestions) {
            if (q.getID() == id) {
                pushedQuestions.remove(q);
                return q;
            }
        }
        for (Question q : hiddenQuestions) {
            if (q.getID() == id) {
                hiddenQuestions.remove(q);
                return q;
            }
        }
        return null;
    }

    public Boolean addQuestion(Question q) {
        if (q.getPushed()) {
            pushedQuestions.add(q);
        } else {
            hiddenQuestions.add(q);
        }
        return true;
    }

    public String getSecure() {
        return secure;
    }

    public ArrayList<Question> getHiddenQuestions() {
        return hiddenQuestions;
    }

    public ArrayList<MoodDate> getMoodHistory() {
        return moodHistory;
    }

    public void setSecure(String secure) {
        this.secure = secure;
    }

    public void setHiddenQuestions(ArrayList<Question> hiddenQuestions) {
        this.hiddenQuestions = hiddenQuestions;
    }

    public void setMoodHistory(ArrayList<MoodDate> moodHistory) {
        this.moodHistory = moodHistory;
    }

    public float getMood() {
        return mood;
    }

    public void setMood(float mood) {
        this.mood = mood;
    }
}