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
import {
  BrowserRouter as Router,
  Switch,
  NavLink,
  Route,
  Link
} from 'react-router-dom';

// Components
import SignUp from './components/SignUp';
import Login from './components/Login';
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
      token: null,
      firstName: '',
      lastName: ''
    };

    this.handleLogout = this.handleLogout.bind(this);
    this.updateToken = this.updateToken.bind(this);
  }

  handleLogout(){
    $.ajax({
      url: '/auth/logout',
      type: 'POST',
    }).done(()=>{
      Cookies.remove('token');
      this.setState({
        token: null
      });
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

  render (){
    return (
      <>
        {this.state.token === null ?
          <>
            <Router>
              <Switch>
                <Route exact path="/">
                  <h1>Project CS261{"\n"}Group 45</h1>
                  <Link className="btn btn-primary"to="/auth/login" >Login!</Link>
                  <Link className="btn btn-primary"to="/auth/register" >Register!</Link>
                </Route>
                <Route path="/auth/login">
                  <Login updateToken={this.updateToken}/>
                </Route>
                <Route path="/auth/register">
                  <SignUp updateToken={this.updateToken} />
                </Route>
              </Switch>
            </Router>
          </>
          :
          <Router>
            <Main
              onLogout={this.handleLogout}
              updateToken={this.updateToken} />
          </Router>
        }
      </>
    );
  };
}


ReactDOM.render(<App />,$('#app')[0]);
