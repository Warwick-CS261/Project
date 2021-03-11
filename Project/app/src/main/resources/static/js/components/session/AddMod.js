import React from 'react';
import Cookies from 'js-cookie';
import $ from 'jquery';

export default class AddMod extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      email: '',
      error: false,
    };


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
    params.append("email", this.state.email);
    $.ajax({
      url: `/session/${this.props.sessionID}/addHost`,
      type: 'POST',
      data: params.toString(),
      success: (data, status, jqXHR) =>{
        let object = JSON.parse(data);
        let token = object.token;
        if (token === null || token === undefined) {
          this.setState({
            error: 'Server response was invalid'
          });
          return;
        }
        Cookies.set('token', token);
        // TODO disable sending empty msgs
        this.props.updateToken(token);
        this.setState({
          email: "",
        });
      },
      statusCode: {
        450: ()=>{
          // TODO display the reason for redirect
          Cookies.remove('token');
          this.props.updateToken(null);
          this.setState({
            error: <Redirect to="/auth/login" />,
          });
        },
        454: ()=> {
          console.log('Invalid session');
          this.setState({
            error: 'Session with that id is not found'
          });
        },
        457: ()=>{
          console.log('Empty message');
        }
      }
    });
    event.preventDefault();
  }

  render(){
    return(
      <>
        <form onSubmit={this.handleSubmit}>
          {this.state.error !== false && 
            <div className="alert alert-danger" role="alert">
              {this.state.error}
            </div>
          }
          <div className="mb-3">
            <input
              type="email"
              name="email"
              className="form-control"
              onChange={this.handleChange}
              value={this.state.email}
              placeholder="New Host Email"
            />  
          </div>
          <div className="mb-3">
            <button
              type="submit"
              className="btn btn-primary"
            >
              Add Host
            </button>
          </div>
        </form>
      </>
    );
  }
}