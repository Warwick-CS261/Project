import React from "react";
import Cookies from "js-cookie";
import { Route, NavLink, Switch } from "react-router-dom";
import { withRouter } from "react-router";
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

        let res = await $.ajax({
          url: `/session/${this.state.id}/watch`,
          type: "POST",
          timeout: 300000,
          success: (data, status, jqXHR) =>{
            let object = JSON.parse(data);
            console.log(data);
            console.log(status);
            console.log(jqXHR);
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
