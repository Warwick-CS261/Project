/**
 * Entry point of the web application
 * Single page application
 * 
 */
// Imports
import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import Cookies from 'js-cookie';

// Components
import SignUp from './components/SignUp';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Main from './components/Main';

$(document).ready(()=>{
  // date to set expiry for a cookie
  var inFifteenMinutes = new Date(new Date().getTime() + 5 * 60 * 1000);
  // TODO test cookie remove before production
  //Cookies.set('token', 'test-cookie-remove-before-production');
});

/**
 * React App Component
 */
class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      auth: {
        login: false,
        signUp: false,
      },
      navs: {
        home: false,
        user: false,
        sessions: false,
        series: false,
        logout: false
      },
      token: null,
      firstName: '',
      lastName: ''
    };

    this.handleLogout = this.handleLogout.bind(this);
    this.handleNav = this.handleNav.bind(this);
    this.updateToken = this.updateToken.bind(this);
  }

  handleLogin(){
    this.setState({
      auth: {
        login: true,
        signUp: false,
      }
    });
  }

  handleSignUp(){
    this.setState({
      auth: {
        login: false,
        signUp: true,
      }
    });
  }

  handleLogout(){
    Cookies.remove('token');
    this.setState({
      auth: {
        login: false,
        signUp: false,
      },
      token: null
    });
  }

  updateToken(token){
    this.setState({
      auth: {
        login: false,
        signUp: false,
      },
      token: token,
    });
  }

  handleNav(id){
    this.setState({
      navs: {
        home: false,
        user: false,
        sessions: false,
        series: false,
        logout: false,
        [id]: true,
      }
    });
  }

  componentDidMount(){
    let tokenCookie = Cookies.get('token');
    if (tokenCookie === undefined || tokenCookie === '') {
      this.setState({
        token: null,
      });
    } else {
      this.setState({
        token: tokenCookie
      });
    }
  }

  componentDidUpdate(){
    let active;
    Object.keys(this.state.navs).forEach(key =>{
      if (this.state.navs[key] === true){
        active = key;
      }
    });
    if (active !== undefined) {
      history.pushState({route:`/${active}`},'',`/${active}`);
    }
  }

  render (){
    let nav = {
      home: {
        id: 'home',
        text: "Home",
        icon: <i className="bi bi-house-fill"></i>
      },
      user: {
        id: 'user',
        text: "Profile", 
        icon: <i className="bi bi-person-circle"></i>
      },
      sessions: {
        id: 'sessions',
        text: "Sessions",
        icon: <i className="bi bi-calendar-event-fill"></i>
      },
      series: {
        id: 'series',
        text: "Series",
        icon: <i className="bi bi-calendar-range-fill"></i> 
      },
      logout: {
        id: 'logout',
        text: "Logout",
        icon: <i className="bi bi-box-arrow-left"></i> 
      }
    };

    if (this.state.auth.login) {
      return (
        <Login updateToken={this.updateToken} />
      );
    }

    if (this.state.auth.signUp) {
      return (
        <SignUp updateToken={this.updateToken} />
      );
    }

    if (this.state.token === null){
      return (
        <div>
          <h1>Project CS261{"\n"}Group 45</h1>
          <button 
            className="btn btn-primary" 
            onClick={()=>this.handleLogin()}
          >
            Login!
          </button>
          <button 
            className="btn btn-primary" 
            onClick={()=>this.handleSignUp()}
          >
            Sign Up!
          </button>
        </div>
      );
    }

    return (
      <div>
        <Sidebar 
          pages={this.state.navs}
          onLogout={this.handleLogout}
          navHandler={this.handleNav}
          nav={nav}
        />
        <Main
          pages={this.state.navs}
          nav={nav}
        />
      </div>
    );
  };
}


ReactDOM.render(<App />,$('#app')[0]);
