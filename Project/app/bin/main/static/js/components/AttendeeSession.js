import React from 'react';
import Cookies from 'js-cookie';
import {
  Route,
  NavLink,
  Switch
} from 'react-router-dom';


export default class AttendeeSession extends React.Component {
  constructor(props) {
    super(props);
    let session = this.props.session;
    this.state = {
      id: session.id,
      seriesID: session.seriesID,
      sessionName: session.sessionName,
      owner: JSON.parse(session.owner),
      pushedQuestions: session.pushedQuestions,
      chat: {
        messages: session.messages,
      }
    }
  }

  render() {
    return (
      <>
        {this.state}
      </>
    );
  }
}