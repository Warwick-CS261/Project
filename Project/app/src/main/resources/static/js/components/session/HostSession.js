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
      };
    }
  }

  componentDidMount(){
    let { id }  = this.props.match.params;
    console.log(id);
  }

  componentWillUnmount(){
    this.props.handleSession(null);
  }

  async componentDidUpdate(){
    try {
      let { field, data } = await $.ajax({
        url: `/session/${this.state.id}/watch`,
        type: 'POST',
        timeout: 300000,
        statusCode: {
          230: (data)=>{
            console.log(data);
          },
          231: (data)=>{
            console.log(data);
          },
          232: (data)=>{
            console.log(data);
          },
          233: (data)=>{
            console.log(data);
          },
          234: (data)=>{
            console.log(data);
          },
          235: (data)=>{
            console.log(data);
          },
          236: (data)=>{
            console.log(data);
          },
          237: (data)=>{
            console.log(data);
          },
          401: ()=> {
            console.log(data);
          },
          450: ()=>{
            console.log(data);
          },
          454: ()=>{
            console.log(data);
          }
        }
      });
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