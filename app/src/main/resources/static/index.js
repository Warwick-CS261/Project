const React = window.React;
const ReactDOM = window.ReactDOM;
const Cookies = window.Cookies;
const $ = window.jQuery;

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      showLogin: false,
      showSignUp: false,
      token: null,
    };
  }

  handleLogin(){
    this.setState({
      showLogin: true,
      showSignUp: false,
      token: null,
    });
  }

  handleSignUp(){
    this.setState({
      showSignUp: true
    });
  }

  render (){
    let tokenCookie = Cookies.get('token');

    if (this.state.showLogin) {
      console.log("render login");
      return (
        <Login />
      );
    }

    if (this.state.showSignUp) {
      return (
        <SignUp />
      );
    }

    if (tokenCookie === undefined){
      return (
        <div>
          <h1>Project CS261{"\n"}Group 45</h1>
          <button 
            className="btn btn-primary" 
            onClick={()=>this.handleLogin()}
          >
            Log in
          </button>
          <button 
            className="btn btn-primary" 
            onClick={()=>this.handleSignUp()}
          >
            Sign up
          </button>
        </div>
      );
    } else {
      this.setState({
        token: tokenCookie,
      });
    }

    return (
      <div>
        <h1>This works now</h1>
        <p>Like a charm</p>
      </div>
    );
  };
}

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      stay: false,
    };

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

    event.preventDefault();
  }
  

  render(){
    return(
      <div>
        <h1>Login</h1>
        <form method="POST" onSubmit={this.handleSubmit} >
          <input 
            type="email" 
            name="email" 
            value={this.state.email}
            onChange={this.handleChange}
            className="form-control"
          />
          <input 
            type="password" 
            name="password" 
            value={this.state.password}
            onChange={this.handleChange}
            className="form-control"
          />
          <input 
            type="checkbox" 
            name="stay"
            onChange={this.handleCheck}
            className="form-check-input"
          />
          <button 
            type="submit" 
            className="btn btn-primary"
          >
            Log in
          </button>
        </form>
      </div>
    );
  }
}


class SignUp extends React.Component {
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


class Nav extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      home: false,
      user: false,
      sessions: false,
      series: false
    };
  }

  render (){
    <nav className="nav">
      <ul>
        <li className="nav-link nav-home" id="nav-home">
          <a href="#">
            <i className="bi bi-house-fill"></i> 
            <span>Home</span>
          </a>
        </li>
        <li className="nav-link nav-user" id="nav-user">
          <a href="#">
            <i className="bi bi-person-circle"></i> 
            <span>User</span>
          </a>
        </li>
        <li className="nav-link nav-session" id="nav-session">
          <a href="#">
            <i className="bi bi-calendar-event-fill"></i>
            <span>Session</span>
          </a>
        </li>
        <li className="nav-link nav-series" id="nav-series">
          <a href="#">
            <i className="bi bi-calendar-range-fill"></i> 
            <span>Series</span>
          </a>
        </li>
        <li className="nav-link nav-logout" id="nav-logout">
          <a href="#">
            <i className="bi bi-box-arrow-left"></i> 
            <span>Logout</span>
          </a>
        </li>
			</ul>
    </nav>
  }
}

const app = $('#app')[0];

ReactDOM.render(<App />,app);