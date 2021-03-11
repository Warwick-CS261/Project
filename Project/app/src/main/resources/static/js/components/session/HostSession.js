import React from 'react';
import Cookies from 'js-cookie';
import {
  Route,
  NavLink,
  Switch
} from 'react-router-dom';
import { Redirect } from 'react-router';
import $ from 'jquery';

import Chat from '../Chat';
import CreateQuestion from '../question/CreateQuestion';
import Questions from '../question/Questions';
import AddMod from './AddMod';

export default class HostSession extends React.Component {
  constructor(props) {
    super(props);
    let session = this.props.session;
    if (session !== null && session !== undefined){
      this.state = {
        secure: session.secure,
        hiddenQuestions: session.hiddenQuestions,
        moodHistory: session.moodHistory,
        mood: session.mood,
        id: session.id,
        seriesID: session.seriesID,
        sessionName: session.sessionName,
        owner: session.owner,
        finished: session.finished,
        pushedQuestions: session.pushedQuestions,
        chat: session.chat,
        error: false,
        subscribed: true,
      };
    } else {
      this.state = {
        secure: "",
        hiddenQuestions: [],
        moodHistory: [],
        mood: 0,
        id: "",
        seriesID: "",
        sessionName: "",
        owner: null,
        finished: null,
        pushedQuestions: [],
        chat: null,
        error: false,
        subscribed: true,
      };
    }
  }

  componentDidMount(){
    this.setState({
      subscribed: false,
    });
  }

  componentWillUnmount(){
    this.props.handleSession(null);
  }

  /*
    230 - session ended {""}
    231 - new message {message}
    232 - question changed {question}
    233 - response to question received {answer}
    234 - moderator added {user}
    235 - session deleted {id}
    236 - question created (need to read pushed value) {question}
    237 - question deleted {qID}
  */
  async componentDidUpdate(){
    try {
      if (!this.state.subscribed && this.state.id !== ""){
        console.log('Entering watch state setting flag subscribed');
        this.setState({
          subscribed: true,
        });
        setTimeout(()=>{
          console.log('5 min up, setting subscribed to false');
          this.setState({
            subscribed: false,
          });
        }, 60000);
        await $.ajax({
          url: `/session/${this.state.id}/watch`,
          type: "POST",
          timeout: 60000,
          success: (data, status, jqXHR) =>{
            console.log(jqXHR);
            let object = JSON.parse(data);
            let watchToken = object.watchToken;
            Cookies.set('watchToken', watchToken);
            this.props.updateWatchToken(watchToken);
            if (jqXHR.status == 231){
              this.setState((oldProps)=>{
                let newChat = oldProps.chat;
                newChat.messages.push(object.update);
                return {
                  chat: newChat,
                }
              });
            }
          }
        });

        this.setState({
          subscribed: false,
        });
      }
    } catch (error) {
      console.log(error);
    }
    
  }

  render() {
    // TODO display refresh page
    return (
      <>
        <h2>{this.state.sessionName}</h2>
        <h6>{this.state.id}</h6>
        {this.state.error !== false && 
          <div className="alert alert-danger" role="alert">
            {this.state.error}
          </div>
        }
        <Chat
          sessionID={this.state.id}
          updateToken={this.props.updateToken}
          chat={this.state.chat}
        />
        <CreateQuestion
          sessionID={this.state.id}
          updateToken={this.props.updateToken}
        />
        <Questions
          pushedQuestions={this.state.pushedQuestions}
          hiddenQuestions={this.state.hiddenQuestions}
          sessionID={this.state.id}
          updateToken={this.props.updateToken}
          isHost={true}
        />
        <button
          className="btn btn-warning"
          onClick={this.handleEnd}
        >
          End Session
        </button>
        <AddMod
          sessionID={this.state.id}
          updateToken={this.props.updateToken}
        />
        {JSON.stringify(this.state)}
      </>
    );
  }
}