/**
 * Entry point of the web application
 * Single page application
 * 
 */
// Imports
const React = window.React;
const ReactDOM = window.ReactDOM;
const Cookies = window.Cookies;
const $ = window.jQuery;

/**
 * React App Component
 */
class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      showLogin: false,
      showSignUp: false,
      token: null,
    };

    this.handleLogout = this.handleLogout.bind(this);
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

  handleLogout(){
    this.setState({
      token: null
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
        <Sidebar token={this.state.token} onLogout={this.handleLogout} />
      </div>
    );
  };
}

class Main extends React.Component {
  render(){
    return(
      <div>Main content</div>
    );
  }
}

class Logo extends React.Component {
  render(){
    return(
      <h2>Project CS261{'\n'}Group45</h2>
    );
  }
}

class Sidebar extends React.Component {
  render(){
    return(
      <div>
        <Logo />
        <Nav token={this.props.token} onLogout={this.props.onLogout} />
      </div>
    );
  }
}


/**
 * Login component
 */
class Login extends React.Component {
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
    $.ajax({
      url: '/auth/login',
      type: 'POST',
      data: JSON.stringify(this.state),
      success: (res) => {
        // handle success
        console.log('Token');
        console.log(Cookies.get('token'));
      },
      error: (res) => {
        // handle error
      }
    });
    event.preventDefault();
  }
  

  render(){
    return(
      <div>
        <h1>Login</h1>
        {this.state.error !== false && 
          <div class="alert alert-danger" role="alert">
            {this.state.error}
          </div>
        }
        <form method="POST" onSubmit={this.handleSubmit} >
          <div className="mb-3">
            <input 
              type="email" 
              name="email" 
              value={this.state.email}
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
              type="password" 
              name="password" 
              value={this.state.password}
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
              name="stay"
              onChange={this.handleCheck}
              className="form-check-input"
              required
            />
          </div>
          <div className="mb-3">
            <button 
              type="submit" 
              className="btn btn-primary"
            >
              Log in
            </button>
          </div>
        </form>
      </div>
    );
  }
}

/**
 * SignUp component 
 */
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
      success: (res) => {
        // handle success
        console.log('Token');
        console.log(Cookies.get("token"));
      },
      error: (res) => {
        // handle error
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

/**
 * Navigation component
 */
class Nav extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      navs: {
        home: false,
        user: false,
        sessions: false,
        series: false,
        logout: false,
      },
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event){
    id = event.target.id.substring(4);
    if (id == logout){
      Cookies.remove('token');
      this.props.onLogout();
    }

  }

  render (){
    <nav className="nav">
      <ul>
        <li 
          className="nav-link nav-home" 
          id="nav-home" 
          onClick={this.handleClick}
        >
          <i className="bi bi-house-fill"></i> 
          <span>Home</span>
        </li>
        <li 
          className="nav-link nav-user" 
          id="nav-user"
          onClick={this.handleClick}
        >
          <i className="bi bi-person-circle"></i> 
          <span>User</span>
        </li>
        <li 
          className="nav-link nav-sessions" 
          id="nav-sessions"
          onClick={this.handleClick}
        >
          <i className="bi bi-calendar-event-fill"></i>
          <span>Session</span>
        </li>
        <li 
          className="nav-link nav-series" 
          id="nav-series"
          onClick={this.handleClick}
        >
          <i className="bi bi-calendar-range-fill"></i> 
          <span>Series</span>
        </li>
        <li 
          className="nav-link nav-logout" 
          id="nav-logout"
          onClick={this.handleClick}
        >
          <i className="bi bi-box-arrow-left"></i> 
          <span>Logout</span>
        </li>
			</ul>
    </nav>
  }
}

const app = $('#app')[0];

ReactDOM.render(<App />,app);