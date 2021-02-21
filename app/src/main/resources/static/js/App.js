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

import SignUp from './components/SignUp';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Main from './components/Main';

$(document).ready(()=>{
  // date to set expiry for a cookie
  var inFifteenMinutes = new Date(new Date().getTime() + 5 * 60 * 1000);
  // TODO test cookie remove before production
  Cookies.set('token', 'test-cookie-remove-before-production', { expires: 365});
});

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
    history.pushState({route:'/auth'},'','/auth/register');
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


ReactDOM.render(<App />,$('#app')[0]);


/**
 * Set's the token as a cookie received from the server
 * @param {String} res response from the server 
 */
function handleToken(res){
  tokenLength = 32;
  index = res.toString().indexOf("token=");
  if (index === -1){
    return null;
  }
  token = res.substring(index+6,index+6+tokenLength);
  Cookies.set('token', token);
  return token;
}

function handleError(res){
  index = res.toString().indexOf("error=");
  if (index === -1){
    return null;
  }
  error = res.substring(index+6)
}