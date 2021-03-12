import React from 'react';
import Cookies from 'js-cookie';
import {
  Route,
  NavLink,
  Switch
} from 'react-router-dom';
import { Redirect } from 'react-router';
import $ from 'jquery';

import Chat from './Chat';
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
    if (this.timeHandle){
      clearTimeout(this.timerHandle);
      this.timerHandle = 0;
    }
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
        this.timerHandle = setTimeout(()=>{
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
            switch(jqXHR.status){
              case 230:
                this.setState({
                  finished: true,
                });
                break;
              case 231:
                this.setState((prevState)=>{
                  let newChat = prevState.chat;
                  newChat.messages.push(object.message);
                  return {
                    ...prevState,
                    chat: newChat,
                  }
                });
                break;
              case 232:
                this.setState((prevState)=>{
                  // BUG question doens't load into different array
                  let question = object.question;
                  let oldPushed = prevState.pushedQuestions;
                  let oldHidden = prevState.hiddenQuestions;
                  if (question.pushed){
                    let index = oldHidden.indexOf(question);
                    if (index > -1){
                      let newHidden = oldHidden.splice(index,1);
                      let newPushed = oldPushed.push(question);
                      return {
                        ...prevState,
                        hiddenQuestions: newHidden,
                        pushedQuestions: newPushed,
                      }
                    }
                  } else {
                    let index = oldPushed.indexOf(question);
                    if (index > -1){
                      let newPushed = oldPushed.splice(index,1);
                      let newHidden = oldHidden.push(question);
                      return {
                        ...prevState,
                        hiddenQuestions: newHidden,
                        pushedQuestions: newPushed,
                      };
                    }
                  }
                });
                break;
              case 233:
                this.setState((prevState)=>{
                  let answer = object.answer.answer;
                  let qID = object.answer.qID;
                  let index;
                  index = prevState.pushedQuestions.indexOf(qID);
                  if (index > -1){
                    let newPushed = prevState.pushedQuestions;
                    newPushed[index].answers.push(answer);
                    return {
                      ...prevState,
                      pushedQuestions: newPushed,
                    };
                  };
                });
                break;
              case 234:
                this.setState((prevState)=>{
                  // TODO add user to mods
                });
                break;
              case 235:
                // TODO redirect to home and display error
                this.setState({
                  error: <Redirect to={{
                    pathname: '/',
                    state: { error: 'Session has ended' }
                  }} />,
                });
                break;
              case 236:
                this.setState((prevState)=>{
                  let question = object.question;
                  let newHidden = prevState.hiddenQuestions;
                  newHidden.push(question);
                  return {
                    ...prevState,
                    hiddenQuestions: newHidden,
                  };
                });
                break;
              case 237:
                this.setState((prevState)=>{
                  let qID = object.qID
                  let index;
                  index = prevState.hiddenQuestions.findIndex(x => x.qID === qID);
                  if (index > -1){
                    let newHidden = prevState.hiddenQuestions;
                    newHidden.splice(index,1);
                    return {
                      ...prevState,
                      hiddenQuestions: newHidden, 
                    };
                  } else {
                    index = prevState.pushedQuestions.findIndex(x => x.qID === qID);
                    if (index > -1){
                      let newPushed = prevState.pushedQuestions;
                      newPushed.splice(index,1);
                      return {
                        ...prevState,
                        pushedQuestions: newPushed,
                      };
                    }
                  }
                });
                break;
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

  handleEnd(){
    $.ajax({
      url: `/session/${this.state.id}/end`,
      type: 'POST',
      success: (data, status, jqXHR)=>{
        let object = JSON.parse(data);
        let token = object.token;
        if (token === undefined || token === null){
          this.setState({
            error: 'Server response was invalid',
          });
          return;
        }
        Cookies.set('token', token);
        this.props.updateToken(token);
        this.setState({
          finished: true,
        });
      },
      statusCode: {

      }
    });
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
        {!this.state.finished &&
          <CreateQuestion
            sessionID={this.state.id}
            updateToken={this.props.updateToken}
          />
        }
        <Questions
          pushedQuestions={this.state.pushedQuestions}
          hiddenQuestions={this.state.hiddenQuestions}
          sessionID={this.state.id}
          updateToken={this.props.updateToken}
          isHost={true}
          finished={this.state.finished}
        />
        {/* End session btn */}
        <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
          End Session
        </button>
        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">End Session</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                Are you sure you want to end the session? This will remove access for the attendees.
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={this.handleEnd}
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        </div>
        <AddMod
          sessionID={this.state.id}
          updateToken={this.props.updateToken}
        />
        {JSON.stringify(this.state)}
      </>
    );
  }
}