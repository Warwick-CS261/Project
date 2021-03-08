import React from 'react';
import Cookies from 'js-cookie';
import $, { param } from 'jquery';
import {handleToken, handleError} from '../../util';

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
      <div className="blackbg">
        <div className="registerBackground">
        <p class="h1 text-center title-text"><i class="bi bi-person-fill"></i> Create User</p>
          {this.state.error !== false && 
            <div className="alert alert-danger" role="alert">
              {this.state.error}
            </div>
          }
          <div className="container form-container">
            <form onSubmit={this.handleSubmit} className="formwidth">
              <div class="row register-box">
                <div class="col-6">
                  <div className="row form-row">
                    <div className="col-5">
                      <label for="fn" class="form-label">First Name</label>
                    </div>
                    <div class="col-7">
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
                    </div>
                  </div>
                  <div className="row form-row">
                    <div className="col-5">
                      <label for="fn" class="form-label">Last Name</label>
                    </div>
                    <div class="col-7">
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
                    </div>
                  </div>
                  <div className="row form-row">
                    <div className="col-5">
                      <label for="fn" class="form-label">Email</label>
                    </div>
                    <div class="col-7">
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
                    </div>
                  </div>
                  <div className="row form-row">
                    <div className="col-5">
                      <label for="fn" class="form-label">Password</label>
                    </div>
                    <div class="col-7">
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
                    </div>
                  </div>
                  <div className="row form-row">
                    <div className="col-5">
                      <label for="fn" class="form-label">Confirm Password</label>
                    </div>
                    <div class="col-7">
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
                  </div>
                </div>
                <div class="col-6 register-right-side">
                  <div class = "registerIcon">
                      <i class="bi bi-person-circle"></i>
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
                      <label for="terms" class="form-label termslabel"><b>I accept the terms and conditions!</b></label> 
                      <br></br>
                    </div>
                    
                  </div>          
                  <button type="submit" className="col-4 btn btn-primary btn-lg btn-round">Register</button>               
                </div>
              </div>
              
              
            </form>
          </div>
          
        </div>
        
      </div>
    );
  }
}