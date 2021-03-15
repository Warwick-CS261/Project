import Cookies from 'js-cookie';
import React from 'react';
import $ from 'jquery';
import { Redirect } from 'react-router';

/**
 * Displays all the host or attended sessions
 * Contains clone and delete session functionality
 */
export default class MySessions extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      modSessions: [],
      attendedSessions: [],
      error: false,
      sessionID: "",
      success: false,
    }

    this.handleClick = this.handleClick.bind(this);

    // requests user data if not present to display owner privileges
    if (this.props.user.email === ""){
      $.ajax({
        url: '/user',
        type: 'POST',
        async: false,
        dataType: 'json',
        success: (data, status, jqXHR)=>{
          console.log(data);
          let token = data.token;
          let user = data.user;
          if (token === undefined || token === null){
            this.setState({

            });
            console.log('JSON parsing failed');
            return;
          }
          this.props.setUser(user.fname, user.lname, user.email);
          Cookies.set('token', token);
          this.props.updateToken(token);
        },
        statusCode: {
          450: ()=>{
            console.log('Invalid token');
          }
        }
      })
    }
  }

  /**
   * Requests data of the user's sessions and stores it in the states
   */
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
  
  /**
   * Calls the session delete route
   * @param {String} id id of the session
   */
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
        let newModSessions = this.state.modSessions;
        newModSessions.filter(x => x.id !== id);
        this.setState({
          modSessions: newModSessions,
          success: true,
        });
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

  /**
   * Calls the session clone route 
   * @param {String} id id of the session
   */
  handleClone(id){
    $.ajax({
      url: `/session/${id}/clone`,
      type: 'POST',
      success: (data, status, jqXHR)=>{
        let object = JSON.parse(data);
        let token = object.token;
        if (token === undefined || token === null){
          this.setState({
            error: 'Server response was invalid',
          });
        }
        let session = object.session;
        Cookies.set('token', token);
        this.props.updateToken(token);
        this.props.handleSession(session);
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

  /**
   * If session is clicked redirects to the selected session
   * @param {String} id id of the session
   */
  handleClick(id){
    this.setState({
      sessionID: id,
    });
  }

  /**
   * Displays the sessions, hide delete functionality under bootstrap modal
   * @returns JSX
   */
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
            <div className="heading">
              <h1><i className="bi bi-calendar-event-fill"></i> My Sessions</h1>
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
                        {this.props.user !== undefined ?
                        this.props.user.email === session.owner.email &&
                          <>
                          <button type="button" className="btn btn-dark float-end" data-bs-toggle="modal" data-bs-target="#deleteSession" onClick={e => e.stopPropagation()}>
                            <i className="bi bi-trash-fill"></i>
                          </button>
                          <div className="modal fade" id="deleteSession" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="deleteSession" aria-hidden="true" onClick={e=>e.stopPropagation()}>
                            <div className="modal-dialog">
                              <div className="modal-content">
                                <div className="modal-header">
                                  <h5 className="modal-title" id="deleteSessionLabel">Delete session</h5>
                                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={e=>e.stopPropagation()}></button>
                                </div>
                                <div className="modal-body">
                                  {this.state.error !== false && 
                                    <div className="alert alert-danger" role="alert">
                                      {this.state.error}
                                    </div>
                                  }
                                  {this.state.success && 
                                    <div className="alert alert-success" role="alert">
                                      Session successfully delete
                                    </div>
                                  }
                                  <p>Are you sure you want to delete the session? This action is irreversible.</p>
                                </div>
                                <div className="modal-footer">
                                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={e=>e.stopPropagation()}>Close</button>
                                  <button
                                    className="btn btn-danger"
                                    onClick={e=>{
                                      e.stopPropagation();
                                      this.handleDelete(session.id)}
                                    }
                                  >
                                    Delete session
                                  </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <button
                              className="btn btn-dark float-end"
                              onClick={e=>{
                                e.stopPropagation();
                                this.handleClone(session.id)}
                              }
                            >
                              <i className="bi bi-clipboard-plus"></i>
                            </button>
                          </>
                          :
                          <></>
                        }
                        <i>#<span>{session.id}</span></i><br></br>
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