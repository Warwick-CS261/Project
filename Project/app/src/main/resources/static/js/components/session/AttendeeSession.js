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
        }, 60000);

        await $.ajax({
          url: `/session/${this.state.id}/watch`,
          type: "POST",
          timeout: 60000,
          success: (data, status, jqXHR) =>{
            let object = JSON.parse(data);
            let watchToken = object.watchToken;
            Cookies.set('watchToken', watchToken);
            this.props.updateWatchToken(watchToken);
            if (jqXHR.status == 231){
              this.setState((oldProps)=>{
                let newChat = oldProps.chat;
                newChat.messages.push(object.message);
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
    return (
      <>
        <h2>{this.state.sessionName}</h2>
        <h6>{this.state.id}</h6>
        {this.state.error !== false && (
          <div className="alert alert-danger" role="alert">
            {this.state.error}
          </div>
        )}
        <Chat
          sessionID={this.state.id}
          updateToken={this.props.updateToken}
          chat={this.state.chat}
        />
        <Questions
          pushedQuestions={this.state.pushedQuestions}
          sessionID={this.state.id}
          updateToken={this.props.updateToken}
          isHost={false}
        />
        {JSON.stringify(this.state)}
      </>
    );
  }
}

export default withRouter(AttendeeSession);
