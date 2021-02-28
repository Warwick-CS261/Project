import React from 'react';
import $ from 'jquery';
import {
  handleError,
  handleToken,
  handleJSON
} from '../util';

export default class JoinSession extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionID: "",
      password: "",
      protected: false,
      error: false,
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
    $.ajax({
      url: `/session/${this.state.sessionID}`,
      type: 'POST',
      data: params,
      success: (data, status, jqXHR) => {
        // In case session is protected rerender component with
        if (data == "Wrong password"){
          this.setState({
            protected: true,
          });
          return;
        }
        let token = handleToken(data);
        if (token === null || token === undefined){
          this.setState({
            error: data,
          });
          return;
        }
        let session = handleJSON(data);
        if (session === null) {
          this.setState({
            error: 'Server response was invalid'
          });
        }
        // TODO redirect to session
        Cookies.set('token', token);
        this.props.updateToken(token);
      },
      error: (jqXHR, status, error)=>{
        this.setState({
          error: 'Something went wrong',
        });
      }
    });
    event.preventDefault();
  }

  render() {
    return(
      <div>
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
              />
            </div> : 
            <div className="mb-3">
              <input 
                type="text"
                name="code"
                className="form-control"
                value={this.state.code}
                onChange={this.handleChange}
                autoFocus
                required
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
      </div>
    )
  }
}