package cs261;

import java.util.ArrayList;

public class Question {
    String question;
    ArrayList<Answer> answers;

    public Question(String question, ArrayList<Answer> answers){
        this.question = question;
        this.answers = answers;
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