import React from 'react';
import Cookies from 'js-cookie';
import {
  Route,
  NavLink,
  Switch
} from 'react-router-dom';
import { Redirect, withRouter } from 'react-router';
import { handleJSON, handleToken } from '../../util';
import $ from 'jquery';

import Chat from '../Chat';
import CreateQuestion from '../question/CreateQuestion';
import Questions from '../question/Questions';

class HostSession extends React.Component {
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
    230 - session ended
    231 - new message
    232 - question pushed
    233 - question pulled
    234 - response to question received
    235 - moderator added
    236 - session deleted
    237 - question created (need to read pushed value)
    238 - question deleted
  */
  async componentDidUpdate(){
    try {
      console.log('Function call update');
      console.log(this.state.subscribed);
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
        }, 300000);
        let res, {status, responseText} = await $.ajax({
          url: `/session/${this.state.id}/watch`,
          type: "POST",
          timeout: 300000,
        });
        console.log('Response received', responseText);
        let token = handleToken(responseText);
        if (token === null || token === undefined){
          this.setState({
            error: 'Server response was invalid'
          });
          return;
        }
        Cookies.set('token', token);
        let object = handleJSON(responseText);
        switch(status){
          case 230:
            console.log(230 + responseText);
            break;
          case 231:
            console.log(231 + responseText);
            break;
          case 232:
            console.log(232 + responseText);
            break;
          case 233:
            console.log(233 + responseText);
            break;
          case 234:
            console.log(234 + responseText);
            break;
          case 235:
            console.log(235 + responseText);
            break;
          case 236:
            console.log(236 + responseText);
            break;
          case 237:
            console.log(237 + responseText);
            break;
          case 401:
            console.log(responseText);
            break;
          case 450:
            console.log(responseText);
            break;
          case 454:
            console.log(responseText);
            break;
        }
        this.setState({
          subscribed: false,
        });
      }
    } catch (error) {
      console.log(error);
    }
    
  }

  render() {
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
        {JSON.stringify(this.state)}
      </>
    );
  }
}

export default withRouter(HostSession);