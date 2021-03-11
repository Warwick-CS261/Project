import React from 'react';
import Cookies from 'js-cookie';
import $ from 'jquery';
import { Redirect } from 'react-router-dom';

export default class CreateSession extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      secure: false,
      error: false,
      series: null,
      submitted: false,
      sessionID: null,
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  handleChange(event){
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  handleCheck(event){
    this.setState({
      [event.target.name]: event.target.checked,
    })
  }

  handleSubmit(event){
    let params = new URLSearchParams();
    params.append('name', this.state.name);
    params.append('secure', this.state.secure);
    params.append('series', this.state.series);
    $.ajax({
      url: '/session/create',
      type: 'POST',
      data: params.toString(),
      success: (data, status, jqXHR) => {
        let object = JSON.parse(data);
        let token = object.token;
        if (token === null || token === undefined ){
          this.setState({
            error: data,
          });
          return;
        }
        let session = object.session;
        if (session === null) {
          this.setState({
            error: 'Server response was invalid',
          });
          return;
        }
        console.log(session);
        // set new tokens
        Cookies.set('token', token);
        this.props.updateToken(token);
        // update main component
        this.props.handleSession(session);
        this.setState({
          submitted: true,
          sessionID: session.id,
        });
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
      <>
        {this.state.submitted ?
          <Redirect to={`/session/${this.state.sessionID}`} />
          :
          <>
          <section className="main">
            <div className="container-fluid">
              <div className="heading">
                <h1><i className="bi bi-box-arrow-in-right"></i>Create Session</h1>
              </div>
              <div className="sessionbox">
                <div className="box">
                  <h3>Enter session name:</h3>
                  {this.state.error !== false && 
                  <div className="alert alert-danger" role="alert">
                    {this.state.error}
                  </div>
                  }
                  <form onSubmit={this.handleSubmit}>
                    <div className="mb-3">
                      <input 
                        type="text"
                        name="name"
                        className="form-control"
                        value={this.state.name}
                        onChange={this.handleChange}
                        autoFocus
                        required
                      />
                    </div>
                    <div className="sessionprivate">
                      <input
                        type="checkbox"
                        name="secure"
                        className="form-check-input"
                        value={this.state.secure}
                        onChange={this.handleCheck}
                      />
                      <p className="private">Private</p>
                    </div>
                    
                    <div className="mb-3">
                      <button 
                        type="submit"
                        className="btn btn-primary"
                      >
                        Create Session
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </section>
            
            
            </>
        }
      </>
    )
  }
}