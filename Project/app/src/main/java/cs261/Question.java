package cs261;

import java.util.ArrayList;

public class Question {
    int id;
    String question;
    ArrayList<Answer> answers;
    Boolean pushed;
    Boolean general;
    float mood;

    public Question(String question, ArrayList<Answer> answers, int id, Boolean pushed, Boolean general, float mood) {
        this.question = question;
        this.answers = answers;
        this.id = id;
        this.pushed = pushed;
        this.general = general;
        this.mood = mood;
    }

    public Question(String question, Boolean pushed, Boolean general) {
        this.question = question;
        this.answers = new ArrayList<Answer>();
        this.id = -1;
        this.pushed = pushed;
        this.general = general;
        this.mood = (float) 0;
    }

    public Question attendeeQuestion() {
        return new Question(question, new ArrayList<Answer>(), id, pushed, general, (float) 0.0);
    }

    public Boolean getGeneral() {
        return general;
    }

    public float getMood() {
        return mood;
    }

    public void setGeneral(Boolean general) {
        this.general = general;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setMood(float mood) {
        this.mood = mood;
    }

    public Question(int id, String question, Boolean pushed) {
        this.question = question;
        this.answers = new ArrayList<Answer>();
        this.id = id;
        this.pushed = pushed;
    }

    public Question(String question, int id) {
        this.question = question;
        this.answers = new ArrayList<Answer>();
        this.id = id;
        pushed = false;
    }

    public void setPushed(Boolean ended) {
        this.pushed = ended;
    }

    public Boolean getPushed() {
        return pushed;
    }

    public void setID(int id) {
        this.id = id;
    }

    public int getID() {
        return id;
    }

    public Boolean addAnswer(Answer a) {
        answers.add(a);
        return true;
    }

    public ArrayList<Answer> getAnswers() {
        return answers;
    }

    public String getQuestion() {
        return question;
    }

    public void setAnswers(ArrayList<Answer> answers) {
        this.answers = answers;
    }

    public void setQuestion(String question) {
        this.question = question;
    }
}