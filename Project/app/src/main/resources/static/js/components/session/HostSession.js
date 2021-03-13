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
import BarChart from '../BarChart';
import Timeline from '../Timeline';
import Indicator from '../Indicator';

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

    this.handleEnd = this.handleEnd.bind(this);
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
        }, 300000);
        await $.ajax({
          url: `/session/${this.state.id}/watch`,
          type: "POST",
          timeout: 300000,
          success: (data, status, jqXHR) =>{
            let object = JSON.parse(data);
            let watchToken = object.watchToken;
            Cookies.set('watchToken', watchToken);
            this.props.updateWatchToken(watchToken);
            switch(jqXHR.status){
              // Session ended
              case 230:
                this.setState({
                  finished: true,
                });
                break;
              // New message
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
              // Question changed
              case 232:
                this.setState((prevState)=>{
                  // BUG question doens't load into different array
                  let question = object.question;
                  let oldPushed = prevState.pushedQuestions;
                  let oldHidden = prevState.hiddenQuestions;
                  if (question.pushed){
                    let index = oldHidden.findIndex(x => x.id === question.id);
                    if (index > -1){
                      oldHidden.splice(index,1);
                      oldPushed.push(question);
                      return {
                        ...prevState,
                        hiddenQuestions: oldHidden,
                        pushedQuestions: oldPushed,
                      }
                    }
                  } else {
                    let index = oldPushed.findIndex(x => x.id === question.id);
                    if (index > -1){
                      oldPushed.splice(index,1);
                      oldHidden.push(question);
                      return {
                        ...prevState,
                        hiddenQuestions: oldHidden,
                        pushedQuestions: oldPushed,
                      };
                    }
                  }
                });
                break;
              // Response received
              case 233:
                this.setState((prevState)=>{
                  let answer = object.answer.answer;
                  let id = object.answer.qID;
                  let mood = object.answer.moodDate;
                  let index;
                  index = prevState.pushedQuestions.findIndex(x => x.id === id);
                  if (index > -1){
                    let newPushed = prevState.pushedQuestions;
                    newPushed[index].answers.push(answer);
                    if (mood !== null){
                      let newMoodHistory = prevState.moodHistory;
                      newMoodHistory.push(mood);
                      return{
                        ...prevState,
                        pushedQuestions: newPushed,
                        moodHistory: newMoodHistory,
                      }
                    } else{
                      return {
                        ...prevState,
                        pushedQuestions: newPushed,
                      };
                    }
                  };
                });
                break;
              // Moderator added to session
              case 234:
                this.setState((prevState)=>{
                  // TODO add user to mods
                });
                break;
              // Session deleted
              case 235:
                // TODO redirect to home and display error
                this.setState({
                  error: <Redirect to={{
                    pathname: '/',
                    state: { error: 'Session has ended' }
                  }} />,
                });
                break;
              // Created question
              case 236:
                this.setState((prevState)=>{
                  let question = object.question;
                  if (!question.pushed){
                    let newHidden = prevState.hiddenQuestions;
                    newHidden.push(question);
                    return {
                      ...prevState,
                      hiddenQuestions: newHidden,
                    };
                  } else {
                    let newPushed = prevState.pushedQuestions;
                    newPushed.push(question);
                    return {
                      ...prevState,
                      pushedQuestions: newPushed,
                    };
                  }
                });
                break;
              // Question deleted
              case 237:
                this.setState((prevState)=>{
                  let qID = object.qID
                  let index;
                  index = prevState.hiddenQuestions.findIndex(x => x.id === qID);
                  if (index > -1){
                    let newHidden = prevState.hiddenQuestions;
                    newHidden.splice(index,1);
                    return {
                      ...prevState,
                      hiddenQuestions: newHidden, 
                    };
                  } else {
                    index = prevState.pushedQuestions.findIndex(x => x.id === qID);
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
              // Token valid watchtoken invalid
              case 250:
                let token = object.token;
                let watchToken = object.watchToken;
                if (watchToken === undefined || watchToken === null || token === undefined || token === null){
                  console.log('Server response invalid');
                  return;
                }
                Cookies.set('watchToken', watchToken);
                Cookies.set('token', token);
                this.props.updateWatchToken(watchToken);
                this.props.updateToken(token);
            }
            this.setState({
              subscribed: false,
            });
          }
        });

      }
    } catch (error) {
      console.log(error);
    }
  }

  handleEnd(e){
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
        450: ()=>{

        },
        401: ()=>{
          
        }
      }
    });
    e.preventDefault();
  }

  render() {
    // TODO display refresh page
    return (
      <>
        <div className="heading">
          <h1><i className="bi bi-calendar-event-fill"></i>{this.state.sessionName}</h1>
        </div>
        <h6>#{this.state.id}</h6>
        {this.state.secure !== "" &&
        <h6>
          <i className="bi bi-shield-lock-fill"></i>
          {this.state.secure}
        </h6>
        }
        {this.state.error !== false && 
          <div className="alert alert-danger" role="alert">
            {this.state.error}
          </div>
        }
        <Indicator mood={this.state.mood} />
        <BarChart data={this.state.moodHistory} />
        <Timeline data={this.state.moodHistory} />
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
        <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#endModal">
          End Session
        </button>
        <div className="modal fade" id="endModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
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