const React = window.React;

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
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  handleCheck(event) {
    this.setState({
      [event.target.name]: event.target.checked
    });
  }

  handleSubmit(event) {
    
    event.preventDefault();
  }

  render(){
    return(
      <div>
        <h1>Register</h1>
        <form method="POST" onSubmit={this.handleSubmit}>
          <input
            type="text" 
            name="fname" 
            value={this.state.value} 
            onChange={this.handleChange}
            className="form-control"
          />
          <input 
            type="text" 
            name="lname" 
            value={this.state.value} 
            onChange={this.handleChange}
            className="form-control"
          />
          <input 
            type="email" 
            name="email" 
            value={this.state.value} 
            onChange={this.handleChange}
            className="form-control"
          />
          <input 
            type="password" 
            name="password" 
            value={this.state.value} 
            onChange={this.handleChange}
            className="form-control"
          />
          <input 
            type="password" 
            name="rpassword" 
            value={this.state.value} 
            onChange={this.handleChange}
            className="form-control"
          />
          <input 
            type="checkbox" 
            name="terms" 
            value={this.state.value} 
            onChange={this.handleCheck}
            className="form-check-input"
          />
          <button type="submit" className="btn btn-primary">Register</button>
        </form>
      </div>
    );
  }
}