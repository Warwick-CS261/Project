import React from "react";
import Cookies from "js-cookie";
import { Route, NavLink, Switch } from "react-router-dom";
import { Redirect, withRouter } from "react-router";
import { handleJSON, handleToken } from "../../util";
import $ from "jquery";

import Chat from "../Chat";
import Reaction from "../question/Reaction";

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
        subscribed: false,
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
        subscribed: false,
      };
    }
  }

  componentDidMount() {
    let id = this.props.match.params.id;
    if (this.state.id === "" || id != this.state.id) {
      $.ajax({
        url: `/session/${id}`,
        type: "POST",
        success: (data, status, jqXHR) => {
          let token = handleToken(data);
          if (token === null || token === undefined) {
            this.setState({
              error: "Server response was invalid",
            });
            return;
          }
          let session = handleJSON(data);
          if (session === null) {
            this.setState({
              error: "Server response was invalid",
            });
          }
          // set cookies
          Cookies.set("token", token);
          this.props.updateToken(token);
          // handle session
          this.props.handleSession(session);
          if (session.secure === null || session.secure === undefined) {
            this.setState({
              id: session.id,
              seriesID: session.seriesID,
              sessionName: session.sessionName,
              owner: session.owner,
              pushedQuestions: session.pushedQuestions,
              chat: session.chat,
              error: false,
            });
          }
        },
        statusCode: {
          // Invalid token
          450: () => {
            console.log("Token invalid");
            this.setState({
              error: <Redirect to="/auth/login" />,
            });
          },
          // Invalid session
          454: () => {
            console.log("Invalid session");
          },
          // Password missing
          456: () => {
            console.log("Password required to access session");
            this.setState({
              error: <Redirect to="/session/join" />,
            });
          },
          // Session ended
          457: () => {
            console.log("Session has ended, only hosts can access it");
          },
        },
      });
    }
  }

  async componentDidUpdate() {
    try {
      if (!this.state.subscribed && this.state.id !== ""){
        this.setState({
          subscribed: true,
        });
        setTimeout(()=>{
          this.setState({
            subscribed: false,
          });
        }, 300000);
        let res, {status, responseText} = await $.ajax({
          url: `/session/${this.state.id}/watch`,
          type: "POST",
          timeout: 300000,
        });
        switch(status){
          case 230:
            console.log(responseText);
            break;
          case 231:
            console.log(responseText);
            break;
          case 232:
            console.log(responseText);
            break;
          case 233:
            console.log(responseText);
            break;
          case 234:
            console.log(responseText);
            break;
          case 235:
            console.log(responseText);
            break;
          case 236:
            console.log(responseText);
            break;
          case 237:
            console.log(responseText);
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
        <Reaction
          sessionID={this.state.id}
          updateToken={this.props.updateToken}
        />
        {JSON.stringify(this.state)}
      </>
    );
  }
}

export default withRouter(AttendeeSession);
