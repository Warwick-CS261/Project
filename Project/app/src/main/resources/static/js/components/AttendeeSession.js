import React from 'react';
import Cookies from 'js-cookie';
import {
  Route,
  NavLink,
  Switch
} from 'react-router-dom';
import { withRouter } from 'react-router';
import { handleJSON, handleToken } from '../util';
import $ from 'jquery';


class AttendeeSession extends React.Component {
  constructor(props) {
    super(props);
    let session = this.props.session;
    if (session !== null && session !== undefined){
      this.state = {
        id: session.id,
        seriesID: session.seriesID,
        sessionName: session.sessionName,
        owner: session.owner,
        pushedQuestions: session.pushedQuestions,
        chat: session.chat
      };
    } else {
      this.state = {
        id: "",
        seriesID: "",
        sessionName: "",
        owner: null,
        pushedQuestions: [],
        chat: null
      };
    }
  }

  componentDidMount(){
    if (this.state.id === ""){
      let id = this.props.match.params.id;
      $.ajax({
        url: `/session/${id}`,
        type: 'POST',
        success: (data, status, jqXHR) => {
          let token = handleToken(data);
          if (token === null || token === undefined) {
            this.setState({
              error: 'Timed out, please log in again'
            });
            return;
          }
          let session = handleJSON(data);
          if (session === null) {
            this.setState({
              error: 'Server response was invalid'
            });
          }
          // set cookies
          Cookies.set('token', token);
          this.props.updateToken(token);
          // handle session
          this.props.handleSession(session);
        },
        statusCode: {
          // Invalid token
          450: ()=>{
            console.log('Token invalid');
          },
          // Invalid session
          454: ()=>{
            console.log('Invalid session');
          },
          // Password missing
          456: ()=>{
            console.log('Password required to access session');
          },
          // Session ended
          457: ()=>{
            console.log('Session has ended, only hosts can access it');
          }
        }
      });
    }
  }

  render() {
    return (
      <>
        {JSON.stringify(this.state)}
      </>
    );
  }
}

export default withRouter(AttendeeSession);