import React from 'react';

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
    let params = new URLSearchParams(this.state).toString();
    console.log(params);
    Cookies.set("this", "that");
    console.log(Cookies.get("this"));
    $.ajax({
      url: '/auth/register',
      type: 'POST',
      data: params,
      success: (data, status, jqXHR) => {
        let token = handleToken(data);
        if (token === null){
          this.setState({
            error: 'Something went wrong please try again',
          });
        }
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

  render(){
    return(
      <div>
        <h1>Register</h1>
        {this.state.error !== false && 
          <div class="alert alert-danger" role="alert">
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
              autoComplete
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
              autoComplete
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
              autoComplete
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
              autoComplete
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
              autoComplete
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