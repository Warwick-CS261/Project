import React from 'react';
import Cookies from 'js-cookie';
import $ from 'jquery';
import {
  handleError,
  handleToken,
  handleJSON
} from '../util';
import { Redirect } from 'react-router-dom';

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
    let params = new URLSearchParams(this.state).toString();
    let route = "/session/"
    let url = route.concat(this.state.sessionID);
    $.ajax({
      url: url,
      type: 'POST',
      data: params,
      success: (data, status, jqXHR) => {
        let token = handleToken(data);
        if (token === null || token === undefined){
          this.setState({
            error: 'Timed out, please log in again',
          });
          return;
        }
        let session = handleJSON(data);
        if (session === null) {
          this.setState({
            error: 'Server response was invalid'
          });
        }
        console.log(session);
        // setting new tokens
        Cookies.set('token', token);
        this.props.updateToken(token);
        // handle session
        this.props.handleSession(session);
        this.setState({
          submitted: true,
          sessionID: session.id,
        });
        
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
          console.log('Session password is missing');
          this.setState({
            protected: true,
          });
        },
        // Session ended
        457: ()=>{
          console.log('Session has ended, only hosts can access it');
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
    return(
      <>
        {this.state.submitted ?
          <Redirect to={`/session/${this.state.sessionID}`} />
          :
          <>
            <h2>Join Session</h2>
            <form onSubmit={this.handleSubmit}>
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
                <button 
                  type="submit"
                  className="btn btn-primary"
                >
                  Join Session
                </button>
              </div>
            </form>
          </>
        }
      </>
    )
  }
}