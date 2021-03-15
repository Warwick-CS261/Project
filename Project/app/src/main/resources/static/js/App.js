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

  /**
   * Clears the cookies from the browser and the server
   */
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

  /**
   * Updates the token of the component
   * This funciton is passed down to every functional component in the tree by props
   * @param {String} token 
   */
  updateToken(token){
    this.setState({
      token: token,
    });
  }

  /**
   * Updates the watchToken required for the live feature
   * @param {String} token 
   */
  updateWatchToken(token){
    this.setState({
      watchToken: token,
    });
  }

  /**
   * Stores the basic data of the current user, also used for displaying owner privilage functionalities
   * @param {String} fname First name
   * @param {String} lname Last name
   * @param {String} email Email of user
   */
  setUser(fname, lname, email){
    this.setState({
      user: {
        firstName: fname,
        lastName: lname,
        email: email,
      },
    });
  }

  /**
   * When mounting if a cookie is present set's it and stores it
   */
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

  /**
   * Render
   * @returns JSX Main routes of the system such as login, sign up 
   * and main component depending on token present or not
   */
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
                    <source src="../img/bg-video.mkv" type="video/mp4"></source>
                  </video>
                </div>
                
                  <div className="landingcontainer">
                    <div className="title bg-dark">
                      SeshOn
                    </div>
                  </div>
                  <div className="landingflex">
                    <div className="landingflexchild">
                      <Link className="btn btn-dark btn-landing"to="/auth/login" >Login</Link>
                    </div>
                    <div className="landingflexchild">
                      <Link className="btn btn-dark btn-landing"to="/auth/register" >Register</Link>
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
