import React from 'react';
import Cookies from 'js-cookie';
import $, { param } from 'jquery';
import {handleToken, handleError} from '../util';

/**
 * SignUp component 
 */
export default class SignUp extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      fname: '',
      lname: '',
      email: '',
      password: '',
      rpassword: '',
      terms: false,
      error: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.handleInvalid = this.handleInvalid.bind(this);
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  handleCheck(event) {
    this.setState({
      [event.target.name]: event.target.checked
    });
  }

  handleInvalid(event){
    event.target.classList.add('invalid');
  }

  handleSubmit(event) {
    let params = new URLSearchParams();
    params.append('fname', this.state.fname);
    params.append('lname', this.state.lname);
    params.append('email', this.state.email);
    params.append('password', this.state.password);
    params.append('rpassword', this.state.rpassword);
    params.append('terms', this.state.terms);
    $.ajax({
      url: '/auth/register',
      type: 'POST',
      data: params.toString(),
      success: (data, status, jqXHR) => {
        let token = handleToken(data);
        if (token === null || token === undefined){
          this.setState({
            error: 'Something went wrong please try again',
          });
        }
        Cookies.set('token', token);
        this.props.updateToken(token);
        console.log('Token');
        console.log(Cookies.get("token"));
      },
      error: (jqXHR, status, error) => {
        this.setState({
          error: 'Something went wrong',
        });
      }
    });
    event.preventDefault();
  }

  componentWillUnmount(){
    // TODO change to redirect
    history.pushState({route: '/'}, '', '/');
  }

  render(){
    return(
      <div>
        <h1>Register</h1>
        {this.state.error !== false && 
          <div className="alert alert-danger" role="alert">
            {this.state.error}
          </div>
        }
        <form onSubmit={this.handleSubmit}>
          <div className="mb-3">
            <input
              type="text" 
              name="fname" 
              value={this.state.value} 
              onChange={this.handleChange}
              onInvalid={this.handleInvalid}
              className="form-control"
              autoFocus
              autoComplete="given-name"
              required
            />
          </div>
          <div className="mb-3">
            <input 
              type="text" 
              name="lname" 
              value={this.state.value} 
              onChange={this.handleChange}
              onInvalid={this.handleInvalid}
              className="form-control"
              autoComplete="family-name"
              required
            />
          </div>
          <div className="mb-3">
            <input 
              type="email" 
              name="email" 
              value={this.state.value} 
              onChange={this.handleChange}
              onInvalid={this.handleInvalid}
              className="form-control"
              autoComplete="email"
              required
            />
          </div>
          <div className="mb-3">
            <input 
              type="password" 
              name="password" 
              value={this.state.value} 
              onChange={this.handleChange}
              onInvalid={this.handleInvalid}
              className="form-control"
              autoComplete="new-password"
              required
            />
          </div>
          <div className="mb-3">
            <input 
              type="password" 
              name="rpassword" 
              value={this.state.value} 
              onChange={this.handleChange}
              onInvalid={this.handleInvalid}
              className="form-control"
              autoComplete="new-password"
              required
            />
          </div>
          <div className="mb-3">
            <input 
              type="checkbox" 
              name="terms" 
              value={this.state.value} 
              onChange={this.handleCheck}
              className="form-check-input"
              required
            />
          </div>
          <div className="mb-3">
            <button type="submit" className="btn btn-primary">Register</button>
          </div>
        </form>
      </div>
    );
  }
}