import React from 'react';
import Cookies from 'js-cookie';
import $ from 'jquery';
import { Redirect } from 'react-router-dom';
import SendMessage from './SendMessage';



export default class Chat extends React.Component {
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
            chat.map((msg) => {
              return (
                <li key={msg.id} className="chat-msg">
                  <span><i className="bi bi-person-circle"></i></span>
                  {!msg.anon ?
                    <span>{msg.user.fname} {msg.user.lname}</span>
                    :
                    <span>Anonymous</span>
                  } &#8212;
                  <span>{msg.stamp}</span>
                  <p>{msg.msg}</p>
                </li>
              );
            })
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