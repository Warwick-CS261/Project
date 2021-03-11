import React from 'react';
import Cookies from 'js-cookie';
import $ from 'jquery';
import { Redirect } from 'react-router-dom';
import SendMessage from './session/SendMessage';



export default class Chat extends React.Component {
  render(){
    let chat = this.props.chat;
    if (chat !== null) {
      chat = this.props.chat.messages;
    }
    return(
      <>
        <h3>Chat</h3>
        <ul>
        {chat === null || chat === undefined || chat.length == 0 ?
          <p>No messages so far</p>
          :
          chat.map((msg) => {
            console.log(msg);
            return (
              <li key={msg.id}>
                <span><i className="bi bi-person-circle"></i></span>
                {!msg.anon ?
                  <span>{msg.user.fname} {msg.user.lname}</span>
                  :
                  <span>Anonymous</span>
                }&#8212;
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
      </>
    );
  }
}