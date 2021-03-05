import React from 'react';
import Cookies from 'js-cookie';
import {
  Route,
  NavLink,
  Switch
} from 'react-router-dom';


export default class HostSession extends React.Component {
  constructor(props) {
    super(props);
    let session = this.props.session;
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
      chat: session.chat
    }
  }

  componentWillUnmount(){
    this.props.handleSession(null);
  }

  render() {
    return (
      <>
        {JSON.stringify(this.state)}
      </>
    );
  }
}