package cs261;

public class WordMood {
    String word;
    float mood;
    int count;

    public WordMood(String word, float mood, int count){
        this.word = word;
        this.mood = mood;
        this.count = count;
    }

    public int getCount() {
        return count;
    }

    public float getMood() {
        return mood;
    }

    public String getWord() {
        return word;
    }

    public void setCount(int count) {
        this.count = count;
    }

    public void setMood(float mood) {
        this.mood = mood;
    }

    public void setWord(String word) {
        this.word = word;
    }
}