import React from 'react';
import Cookies from 'js-cookie';
import $ from 'jquery';
import { Redirect } from 'react-router-dom';

/**
 * Join component
 * Promps user for session id if the session is password protected
 * prompts for password
 */
export default class JoinSession extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionID: "",
      password: "",
      protected: false,
      error: false,
      submitted: false,
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  handleChange(event){
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  handleSubmit(event){
    let params = new URLSearchParams();
    params.append('password', this.state.password);
    $.ajax({
      url: `/session/${this.state.sessionID}`,
      type: 'POST',
      data: params.toString(),
      success: (data, status, jqXHR) => {
        let object = JSON.parse(data);
        let token = object.token;
        let watchToken = object.watchToken;
        if (token === null || token === undefined || watchToken === undefined || watchToken === null){
          this.setState({
            error: 'Timed out, please log in again',
          });
          return;
        }
        let session = object.session;
        if (session === null) {
          this.setState({
            error: 'Server response was invalid'
          });
        }
        console.log(session);
        // setting new tokens
        Cookies.set('token', token);
        Cookies.set('watchToken', watchToken);
        this.props.updateToken(token);
        this.props.updateWatchToken(watchToken);
        // handle session
        this.props.handleSession(session);
        this.setState({
          submitted: true,
          sessionID: session.id,
          error: false,
        });
        
      },
      statusCode: {
        // Invalid token
        450: ()=>{
          console.log('Token invalid');
          Cookies.remove('token');
          this.props.updateToken(null);
          this.setState({
            error: <Redirect to="/auth/login" />,
          });
        },
        // Invalid session
        454: ()=>{
          console.log('Invalid session');
          this.setState({
            error: `Session with id ${this.state.sessionID} not found`,
          });
        },
        // Password missing
        456: ()=>{
          console.log('Session password is missing');
          this.setState({
            protected: true,
          });
        },
        // Session ended
        457: ()=>{
          console.log('Session has ended, only hosts can access it');
          this.setState({
            error: 'Session has ended, only hosts can access it',
          });
        },
        458: ()=>{
          console.log('Session password is invalid');
          this.setState({
            error: 'Password is invalid',
          });
        }
      }
    });
    event.preventDefault();
  }

  render() {

    if (this.state.submitted){
      return (
        <Redirect to={`/session/${this.state.sessionID}`} />
      );
    }

    return(
      <>
      <section className="main blackbg">
        <div className="container-fluid">
          <div className="heading">
            <h1><i className="bi bi-box-arrow-in-right"></i> Join Session</h1>
          </div>
          <div className="sessionbox">
            <div className="box">
            <h3>Enter session code:</h3>
              <form onSubmit={this.handleSubmit}>
                {this.state.error !== false && 
                  <div className="alert alert-danger" role="alert">
                    {this.state.error}
                  </div>
                }
                {this.state.protected ?
                  <div className="mb-3">
                    <input
                      type="text"
                      name="password"
                      className="form-control"
                      value={this.state.password}
                      onChange={this.handleChange}
                      placeholder="Password"
                    />
                  </div> : 
                  <div className="mb-3">
                    <input 
                      type="text"
                      name="sessionID"
                      className="form-control"
                      value={this.state.sessionID}
                      onChange={this.handleChange}
                      autoFocus
                      required
                      placeholder="Session ID"
                    />
                  </div>
                }
                <div className="mb-3">
                  <div className="container">
                    <div className="row">
                      <div className="col text-center">
                        <button 
                          type="submit"
                          className="btn btn-dark btn-lg"
                        >
                          Join Session
                        </button>
                      </div>
                    </div>
                  </div>  
                  
                </div>
              </form>
            </div>
          </div>
          
        </div>
      </section>
        
      </>
    )
  }
}