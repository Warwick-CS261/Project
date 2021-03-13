import React from 'react';
import Cookies from 'js-cookie';
import $ from 'jquery';
import { Redirect } from 'react-router-dom';
import SendMessage from './SendMessage';
import ReactDOM from 'react-dom';


export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {scroll: false};
  }
  

  scrollToBottom(){
    const node = ReactDOM.findDOMNode(this.messagesEnd);
    if (node !== undefined && node !== null){
      node.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }

  componentDidMount() {
    this.scrollToBottom();
    this.setState({
      scroll: true,
    });
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  render(){
    let chat = this.props.chat;
    if (chat !== null && chat !== undefined) {
      chat = this.props.chat.messages;
    }
    return(
      <>
      <div className="chat-container">
        <h3>Chat</h3>
          <ul className="list-unstyled chat-scroll">
          {chat === null || chat === undefined || chat.length == 0 ?
            <p>No messages so far</p>
            :
            <>
            {chat.map((msg) => {
              return (
                <li key={msg.id} className="chat-msg">
                  {!msg.anon ?
                    <span><span className="user-profile"><i className="bi bi-person-circle"></i> </span>{msg.user.fname} {msg.user.lname}</span>
                    :
                    <span><span className="user-profile"><i className="bi bi-person-circle"></i> </span>Anonymous</span>
                  }
                  <span className="stamp">{msg.stamp}</span>
                  <p>{msg.msg}</p>
                </li>
              );
            })}
            <div style={{ float:"left", clear: "both" }}
             ref={(el) => { this.messagesEnd = el; }}>
            </div>
            </>
          }
          </ul>
          <SendMessage
            chat={this.props.chat}
            updateToken={this.props.updateToken}
            sessionID={this.props.sessionID}
          />
      </div>
        
      </>
    );
  }
}