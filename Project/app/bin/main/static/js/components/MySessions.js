import Cookies from 'js-cookie';
import React from 'react';
import $ from 'jquery';
import { handleJSON, handleToken } from '../util';
import { Redirect } from 'react-router';

export default class MySessions extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      modSessions: [],
      attendedSessions: [],
      error: false,
      sessionID: "",
    }

    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount(){
    $.ajax({
      url: '/session/user',
      type: 'POST',
      success: (data, status, jqXHR) =>{
        let token = handleToken(data);
        if (token === null || token === undefined) {
          this.setState({
            error: 'Server response was invalid',
          });
          return;
        }
        let series = handleJSON(data);
        let modList = [];
        let attendedList = [];
        series.sessions.map((session) => {
          if (session.secure !== null && session.secure !== undefined){
            modList.push(session);
          } else {
            attendedList.push(session);
          }
        });
        Cookies.set('token', token);
        this.props.updateToken(token);
        this.setState({
          modSessions: modList,
          attendedSessions: attendedList,
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

  handleClick(id){
    this.setState({
      sessionID: id,
    });
  }

  render() {
    if (this.state.sessionID !== ""){
      return(
        <Redirect to={`/session/${this.state.sessionID}`} />
      );
    }

    if (this.props.isMod){
      return (
        <section className="main">
          <div className="container-fluid">
            {this.state.modSessions.map((session)=>{
              return (
                <div
                  key={session.id}
                  onClick={()=>this.handleClick(session.id)}
                >
                  <h6>{session.sessionName}</h6>
                  <span>{session.id}</span>
                  <span>{session.owner.fname} {session.owner.lname}</span>
                </div>
              );
            })}
          </div>
        </section>
      )
    }

    return (
      <section className="main">
          <div className="container-fluid">
            {this.state.attendedSessions.map((session)=>{
            return (
              <div
                key={session.id}
                onClick={()=>this.handleClick(session.id)}
              >
                <h6>{session.sessionName}</h6>
                <span>{session.id}</span>
                <span>{session.owner.fname} {session.owner.lname}</span>
              </div>
            );
          })}
          </div>
      </section>
    )
  }
}