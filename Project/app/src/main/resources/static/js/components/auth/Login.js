import React from 'react';
import Cookies from 'js-cookie';
import $ from 'jquery';

/**
 * Login component
 */
export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      stay: false,
      error: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInvalid = this.handleInvalid.bind(this);
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

  handleInvalid(event){
    event.target.classList.add('invalid');
  }

  handleSubmit(event){
    let params = new URLSearchParams();
    params.append('email', this.state.email);
    params.append('password', this.state.password);
    $.ajax({
      url: '/auth/login',
      type: 'POST',
      data: params.toString(),
      success: (data, status, jqXHR) => {
        let object = JSON.parse(data);
        let token = object.token;
        if (token === null || token === undefined){
          this.setState({
            error: data,
          });
          return;
        }
        Cookies.set('token', token);
        this.props.updateToken(token);
      },
      statusCode: {
        455: ()=>{
          this.setState({
            error: 'Incorrect email or password',
          });
        }
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
        <p className="h1 text-center title-text"><i className="bi bi-person-fill"></i> Login</p>
        {this.state.error !== false && 
          <div className="alert alert-danger" role="alert">
            {this.state.error}
          </div>
        }
        <div className="container form-container">
          <form method="POST" onSubmit={this.handleSubmit} >
              <div className="row register-box">
                <div className="col-12">
                  <div className="row form-row">
                    <div className="col-5">
                      <label for="fn" class="form-label">Email</label>
                    </div>
                    <div className="col-7">
                      <input 
                        type="email" 
                        name="email" 
                        value={this.state.email}
                        onChange={this.handleChange}
                        onInvalid={this.handleInvalid}
                        className="form-control"
                        placeholder="John@Doe.com"
                        autoFocus
                        autoComplete="email"
                        required
                      />
                    </div>
                  </div>
                  <div className="row form-row">
                    <div className="col-5">
                      <label for="fn" class="form-label">Password</label>
                    </div>
                    <div className="col-7">
                      <input 
                        type="password" 
                        name="password" 
                        value={this.state.password}
                        onChange={this.handleChange}
                        onInvalid={this.handleInvalid}
                        className="form-control"
                        placeholder="******"
                        autoComplete="current-password"
                        required
                      />
                    </div>
                  </div>
                  <div className="row form-row">
                    <div className="terms">
                        <input 
                          type="checkbox" 
                          name="stay"
                          onChange={this.handleCheck}
                          className="form-check-input"
                        />
                        <label for="terms" className="form-label termslabel"><b>I am not a robot!</b></label> 
                        <br></br>
                      </div>         
                      <button type="submit" className="col-4 btn btn-primary btn-lg btn-round">Log In</button>
                    </div>
                </div>
              </div>    
            </form>
          </div>
          </div>
      </div>
    );
  }
}