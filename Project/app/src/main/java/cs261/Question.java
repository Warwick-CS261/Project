package cs261;

import java.util.ArrayList;

public class Question {
    int id;
    String question;
    ArrayList<Answer> answers;

    public Question(String question, ArrayList<Answer> answers){
        this.question = question;
        this.answers = answers;
        this.id = -1;
    }

    public Question(String question){
        this.question = question;
        this.answers = new ArrayList<Answer>();
        this.id = -1;
    }

    public Question(String question, int id){
        this.question = question;
        this.answers = new ArrayList<Answer>();
        this.id = id;
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