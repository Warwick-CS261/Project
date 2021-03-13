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
import SignUp from './components/auth/SignUp';
import Login from './components/auth/Login';
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
      user: {
        firstName: '',
        lastName: '',
        email: '',
      },
      watchToken: null,
    };

    this.handleLogout = this.handleLogout.bind(this);
    this.updateToken = this.updateToken.bind(this);
    this.updateWatchToken = this.updateWatchToken.bind(this);
    this.setUser = this.setUser.bind(this);
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
      token: token,
    });
  }

  updateWatchToken(token){
    this.setState({
      watchToken: token,
    });
  }

  setUser(fname, lname, email){
    this.setState({
      user: {
        firstName: fname,
        lastName: lname,
        email: email,
      },
    });
  }

  componentDidMount(){
    let tokenCookie = Cookies.get('token');
    let watchTokenCookie = Cookies.get('watchToken');
    if (tokenCookie === undefined || tokenCookie === '' || watchTokenCookie === undefined || watchTokenCookie === '') {
      this.setState({
        token: null,
        watchToken: null,
      });
    } else {
      this.setState({
        token: tokenCookie,
        watchToken: watchTokenCookie,
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
                <div className="videobgwrapper">
                  <video className="videobg" autoPlay muted loop id="myVideo">
                    <source src="../img/beach.mp4" type="video/mp4"></source>
                  </video>
                </div>
                
                  <div className="landingcontainer">
                    <div className="title">
                      SeshOn
                    </div>
                  </div>
                  <div className="landingflex">
                    <div className="landingflexchild">
                      <Link className="btn btn-primary btn-lg"to="/auth/login" >Login!</Link>
                    </div>
                    <div className="landingflexchild">
                      <Link className="btn btn-primary btn-lg"to="/auth/register" >Register!</Link>
                    </div>
                  </div>
                </Route>
                <Route path="/auth/login">
                  <Login
                    updateToken={this.updateToken}
                    setUser={this.setUser}
                  />
                </Route>
                <Route path="/auth/register">
                  <SignUp
                    updateToken={this.updateToken}
                    setUser={this.setUser}
                  />
                </Route>
              </Switch>
            </Router>
          </>
          :
          <Router>
            <Main
              onLogout={this.handleLogout}
              updateToken={this.updateToken}
              updateWatchToken={this.updateWatchToken}
              user={this.state.user}
              setUser={this.setUser}
            />
          </Router>
        }
      </>
    );
  };
}


ReactDOM.render(<App />,$('#app')[0]);
