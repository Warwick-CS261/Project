import React from "react";
import Cookies from "js-cookie";
import { Route, NavLink, Switch } from "react-router-dom";
import { withRouter } from "react-router";
import $ from "jquery";

import Chat from "./Chat";
import Reaction from "../question/Reaction";
import Questions from "../question/Questions";

class AttendeeSession extends React.Component {
  constructor(props) {
    super(props);
    let session = this.props.session;
    if (session !== null && session !== undefined) {
      this.state = {
        id: session.id,
        seriesID: session.seriesID,
        sessionName: session.sessionName,
        owner: session.owner,
        pushedQuestions: session.pushedQuestions,
        chat: session.chat,
        error: false,
        subscribed: true,
      };
    } else {
      this.state = {
        id: "",
        seriesID: "",
        sessionName: "",
        owner: null,
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

  async componentDidUpdate() {
    try {
      if (!this.state.subscribed && this.state.id !== ""){
        console.log('Entering watch state setting flag subsrcibed');
        this.setState({
          subscribed: true,
        });
        setTimeout(()=>{
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
                  if (question.pushed){
                    oldPushed.push(question);
                    return {
                      ...prevState,
                      pushedQuestions: oldPushed,
                    }
                  } else {
                    let index = oldPushed.findIndex(x => x.id === question.id);
                    if (index > -1){
                      oldPushed.splice(index,1);
                      return {
                        ...prevState,
                        pushedQuestions: oldPushed,
                      };
                    }
                  }
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
              // Question deleted
              case 237:
                this.setState((prevState)=>{
                  let qID = object.qID
                  let index;
                  index = prevState.pushedQuestions.findIndex(x => x.id === qID);
                  if (index > -1){
                    let newPushed = prevState.pushedQuestions;
                    newPushed.splice(index,1);
                    return {
                      ...prevState,
                      pushedQuestions: newPushed,
                    };
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
                break;
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

  render() {
    return (
      <>
        <div className="heading">
          <h1><i className="bi bi-calendar-event-fill"></i>{this.state.sessionName}</h1>
        </div>
        <h6>Session Code: {this.state.id}</h6>
        {this.state.error !== false && (
          <div className="alert alert-danger" role="alert">
            {this.state.error}
          </div>
        )}
        <div className="att-layout">
          <div className="q">
          <Questions
            pushedQuestions={this.state.pushedQuestions}
            sessionID={this.state.id}
            updateToken={this.props.updateToken}
            isHost={false}
          />
          </div>
          <div className="c">
          <Chat
            sessionID={this.state.id}
            updateToken={this.props.updateToken}
            chat={this.state.chat}
          />
          </div>
        </div>
        
      </>
    );
  }
}

export default withRouter(AttendeeSession);
