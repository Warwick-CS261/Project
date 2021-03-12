import Cookies from 'js-cookie';
import React from 'react';
import $ from 'jquery';
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
        let object = JSON.parse(data);

        let token = object.token;
        if (token === null || token === undefined) {
          this.setState({
            error: 'Server response was invalid',
          });
          return;
        }
        let series = object.series;
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
  
  handleDelete(id){
    $.ajax({
      url: `/session/${id}/delete`,
      type: 'POST',
      success: (data, status, jqXHR)=>{
        let object = JSON.parse(data);
        let token = object.token;
        if (token === undefined || token === null){
          this.setState({
            error: 'Server response was invalid',
          });
        }
        Cookies.set('token', token);
        this.props.updateToken(token);
      },
      statusCode: {
        450: ()=>{
          console.log('Invalid token');
        },
        454: ()=>{
          console.log('Session not found');
        },
        401: ()=>{
          this.setState({
            error: 'Unauthorized action',
          });
        }
      }
    });
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
      // TODO remove session
      return (
        <section className="main">
          <div className="container-fluid">
            <div className="heading">
              <h1><i className="bi bi-calendar-event-fill"></i>Sessions</h1>
            </div>
            <div className="sessiongridcontainer">
              <div className="sessiongrid">
                {this.state.modSessions.map((session)=>{
                  return (
                    <div
                      key={session.id}
                      onClick={()=>this.handleClick(session.id)}
                    >
                      <div className="sessiongridchild">
                        <h3>{session.sessionName}</h3>
                        <i>#<span>{session.id}</span></i><br></br>
                        <h5>Host: <span>{session.owner.fname} {session.owner.lname}</span></h5>
                        {this.props.user !== undefined ?
                        this.props.user.email === session.owner.email &&
                          <button
                            className="btn btn-danger"
                            onClick={(e)=> {
                              e.stopPropagation(); 
                              this.handleDelete(session.id)
                            }}
                          >
                            <i className="bi bi-trash-fill"></i>
                          </button>
                          :
                          <></>
                        }
                      </div>
                      
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )
    }

    return (
      <section className="main">
          <div className="container-fluid">
            <div className="heading">
                <h1><i className="bi bi-calendar-event-fill"></i>Sessions</h1>
              </div>
              <div className="sessiongridcontainer">
                <div className="sessiongrid">
                  {this.state.attendedSessions.map((session)=>{
                    return (
                      <div
                        key={session.id}
                        onClick={()=>this.handleClick(session.id)}
                      >
                        <div className="sessiongridchild">
                          <h3>{session.sessionName}</h3>
                          <i>#<span>{session.id}</span></i>
                          <h5>Host: <span>{session.owner.fname} {session.owner.lname}</span></h5>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
          </div>
      </section>
    )
  }
}