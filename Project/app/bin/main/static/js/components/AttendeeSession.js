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

  // componentDidCatch(e){
  //   console.log(e);
  // }

  async componentDidMount(){
    let id = this.props.match.params.id;
    console.log(id);
    let session = await $.ajax({
      url: `/session/${id}`,
      type: 'POST',
      success: (data, status, jqXHR) => {
        // TODO error checks
        console.log(data);
        let token = handleToken(data);
        let session = handleJSON(data);
        return session;
      },
      error: (jqXHR, status, error)=>{
        this.setState({
          
        });
      }
    });
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