import React from 'react';
import Cookies from 'js-cookie';
import $ from 'jquery';
import { Redirect } from 'react-router';

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
      success: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.handleInvalid = this.handleInvalid.bind(this);
  }

  /**
   * Controlled component, sets the state to the value entered
   * @param {Object} event Trigger event
   */
  handleChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  /**
   * Controlled component, sets the state to the value entered
   * @param {Object} event Trigger event
   */
  handleCheck(event) {
    this.setState({
      [event.target.name]: event.target.checked
    });
  }

  handleInvalid(event){
    event.target.classList.add('invalid');
  }

  /**
   * Submits user data to the server
   * @param {Object} event Trigger event
   */
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
        let object = JSON.parse(data);
        let token = object.token;
        if (token === null || token === undefined){
          this.setState({
            error: 'Something went wrong please try again',
          });
        }
        this.setState({
          success: true,
        });
        Cookies.set('token', token);
        this.props.updateToken(token);
        this.props.setUser(object.user.fname, object.user.lname, object.user.email);
      },
      statusCode: {
        453: ()=>{
          this.setState({
            error: 'Passwords don\'t match',
          });
        },
        452: ()=>{
          this.setState({
            error: `User with email "${this.state.email}" already exists`,
          });
        }
      }
    });
    event.preventDefault();
  }

  render(){
    if (this.state.success){
      // If looged in redirect to home page
      return(
        <Redirect to="/" />
      );
    }
    
    // Sign Up view
    return(
      <div className="blackbg">
        <div className="registerBackground">
        <p className="h1 text-center title-text"><i className="bi bi-person-fill"></i> Create User</p>
          {this.state.error !== false && 
            <div className="alert alert-danger" role="alert">
              {this.state.error}
            </div>
          }
          <div className="container form-container">
            <form onSubmit={this.handleSubmit} className="formwidth">
              <div className="row register-box">
                <div className="col-6">
                    <label htmlFor="fn" className="form-label">First Name</label>
                    <input
                      type="text" 
                      name="fname" 
                      value={this.state.value} 
                      onChange={this.handleChange}
                      onInvalid={this.handleInvalid}
                      className="form-control"
                      placeholder="John"
                      autoFocus
                      autoComplete="given-name"
                      required
                    />
                    <label htmlFor="fn" className="form-label mt-2">Last Name</label>
                    <input 
                      type="text" 
                      name="lname" 
                      value={this.state.value} 
                      onChange={this.handleChange}
                      onInvalid={this.handleInvalid}
                      className="form-control"
                      placeholder="Doe"
                      autoComplete="family-name"
                      required
                    />
                    <label htmlFor="fn" className="form-label mt-2">Email</label>
                    <input 
                      type="email" 
                      name="email" 
                      value={this.state.value} 
                      onChange={this.handleChange}
                      onInvalid={this.handleInvalid}
                      className="form-control"
                      placeholder="John@Doe.com"
                      autoComplete="email"
                      required
                    />
                    <label htmlFor="fn" className="form-label mt-2">Password</label>
                    <input 
                      type="password" 
                      name="password" 
                      value={this.state.value} 
                      onChange={this.handleChange}
                      onInvalid={this.handleInvalid}
                      className="form-control"
                      placeholder="******"
                      autoComplete="new-password"
                      required
                    />
                    <label htmlFor="fn" className="form-label mt-2">Confirm Password</label>
                    <input 
                      type="password" 
                      name="rpassword" 
                      value={this.state.value} 
                      onChange={this.handleChange}
                      onInvalid={this.handleInvalid}
                      className="form-control"
                      placeholder="******"
                      autoComplete="new-password"
                      required
                    />
                  </div>
                <div className="col-6 register-right-side">
                  <div className = "registerIcon">
                      <i className="bi bi-person-circle"></i>
                  </div>
                  <div className="register-bottom-right">
                    <div className="terms">
                      <input 
                        type="checkbox" 
                        name="terms" 
                        value={this.state.value} 
                        onChange={this.handleCheck}
                        className="form-check-input"
                        required
                      />
                      <label htmlFor="terms" className="form-label termslabel"><b>I accept the terms and conditions!</b></label> 
                      <br></br>
                    </div>
                  </div>          
                  <button type="submit" className="col-4 btn btn-primary btn-lg btn-round w-100">Register</button>               
                </div>
              </div>           
            </form>
          </div>
        </div>
      </div>
    );
  }
}