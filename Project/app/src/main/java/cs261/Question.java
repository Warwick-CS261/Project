package cs261;

import java.util.ArrayList;

public class Question {
    int id;
    String question;
    ArrayList<Answer> answers;
    Boolean ended;

    public Question(String question, ArrayList<Answer> answers, int id, Boolean ended){
        this.question = question;
        this.answers = answers;
        this.id = id;
        this.ended = ended;
    }

    public Question(String question){
        this.question = question;
        this.answers = new ArrayList<Answer>();
        this.id = -1;
        ended = false;
    }

    public Question(String question, int id){
        this.question = question;
        this.answers = new ArrayList<Answer>();
        this.id = id;
        ended = false;
    }

    public void setEnded(Boolean ended) {
        this.ended = ended;
    }

    public Boolean getEnded() {
        return ended;
    }

    public void setID(int id) {
        this.id = id;
    }

    public int getID() {
        return id;
    }

    public Boolean addAnswer(Answer a){
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