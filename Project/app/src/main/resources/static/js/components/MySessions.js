import Cookies from 'js-cookie';
import React from 'react';
import $ from 'jquery';
import { handleJSON, handleToken } from '../util';

export default class MySessions extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      hostSessions: [],
      error: false
    }
  }

  componentDidMount(){
    $.ajax({
      url: '/session/user',
      type: 'POST',
      success: (data, status, jqXHR) =>{
        let series = handleJSON(data);
        console.log(series);
        let token = handleToken(data);
        if (token === null || token === undefined) {
          this.setState({
            error: 'Server response was invalid',
          });
          return;
        }
        Cookies.set('token', token);
        this.props.updateToken(token);
        let list = [];
        series.sessions.map((session) => {
          if (session.secure !== null && session.secure !== undefined)
          list.push(session);
        });
        this.setState({
          hostSessions: list,
        });
      },
      statusCode: {
        450: ()=>{
          this.setState({
            error: 'Timed out log in again'
          });
        }
      }
    })
  }

  render() {
    return (
      <>
        {this.state.hostSessions.map((session)=>{
          return (
            <div>
              <h6>{session.sessionName}</h6>
              <span>{session.id}</span>
              <span>{session.owner.fname} {session.owner.lname}</span>
            </div>
          );
        })}
      </>
    )
  }
}