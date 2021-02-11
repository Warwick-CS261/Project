package cs261;

import java.util.ArrayList;

public class Chat {
    ArrayList<Message> messages;

    public Chat(ArrayList<Message> messages){
        this.messages = messages;
    }

    public Chat(){
        this.messages = new ArrayList<Message>();
    }

    public Boolean addMessage(Message m){
        messages.add(m);
        return true;
    }

    public ArrayList<Message> getMessages() {
        return messages;
    }

    public void setMessages(ArrayList<Message> messages) {
        this.messages = messages;
    }
}