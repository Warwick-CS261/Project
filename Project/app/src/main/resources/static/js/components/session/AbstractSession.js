import React from 'react';
import Cookies from "js-cookie";
import $ from "jquery";
import { Redirect, withRouter } from 'react-router';
import AttendeeSession from './AttendeeSession';
import HostSession from './HostSession';

/**
 * Renders HostSession or AttendeeSession depending on which one was recieved from the server
 */
class AbstractSession extends React.Component {
  constructor(props){
    super(props);
    if (this.props.session === undefined || this.props.session === null) {
      this.state = {
        loading: true,
        error: false,
        hasError: false,
      }
    } else{
      this.state = {
        loading: false,
        error: false,
        hasError: false,
      }
    }
  }

  /**
   * If doesn't have session data retrieves from the server
   */
  componentDidMount(){
    let id = this.props.match.params.id;
    if (this.state.id === "" || id != this.state.id) {
      $.ajax({
        url: `/session/${id}`,
        type: "POST",
        success: (data, status, jqXHR) => {
          let json = JSON.parse(data);
          let token = json.token;
          let watchToken = json.watchToken;
          if (token === null || token === undefined) {
            this.setState({
              error: "Server response was invalid",
            });
            return;
          }
          let session = json.session;
          if (session === null) {
            this.setState({
              error: "Server response was invalid",
            });
          }
          // set cookies
          Cookies.set("token", token);
          Cookies.set('watchToken', watchToken);
          this.props.updateToken(token);
          this.props.updateWatchToken(watchToken);
          // handle session
          this.props.handleSession(session);
        },
        statusCode: {
          // Invalid token
          450: () => {
            console.log("Token invalid");
            Cookies.remove('token');
            this.setState({
              error: <Redirect to="/auth/login" />,
            });
          },
          // Invalid session
          454: () => {
            console.log("Invalid session");
          },
          // Password missing
          456: () => {
            console.log("Password required to access session");
            this.setState({
              error: <Redirect to="/session/join" />,
            });
          },
          // Session ended
          457: () => {
            console.log("Session has ended, only hosts can access it");
          },
        },
      });
    }
  }

  /**
   * Error boundary if something goes wrong in the child components
   * @returns state update
   */
  static getDerivedStateFromError(){
    return {
      hasError: true,
    }
  }

  static getDerivedStateFromProps(props, state){
    if (props.session !== undefined && props.session !== null){
      return {
        loading: false,
      };
    }
    return null;
  }

  componentDidCatch(error, info){
    console.log(error);
    console.log(info);
  }

  render(){
    if (this.state.hasError){
      return(
        <section className="main">
          <div className="container-fluid">
            Something went wrong, try refreshing the page
          </div>
        </section>
      );
    }

    if (this.state.error !== false){
      return(
        <section className="main">
          <div className="container-fluid">
            {this.state.error}
          </div>
        </section>
      )
    }

    if (this.state.loading){
      return(
        <section className="main">
          <div className="container-fluid">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            Loading content, if it takes too long try refreshing.
          </div>
        </section>
      );
    }
    if (this.props.isHost){
      return(
        <section className="main">
          <div className="container-fluid">
            <HostSession
              session={this.props.session}
              handleSession={this.props.handleSession}
              updateToken={this.props.updateToken}
              updateWatchToken={this.props.updateWatchToken}
            />
          </div>
        </section>
        
      );
    }

    return(
      <section className="main">
        <div className="container-fluid h95">
          <AttendeeSession
            session={this.props.session}
            handleSession={this.props.handleSession}
            updateToken={this.props.updateToken}
            updateWatchToken={this.props.updateWatchToken}
          />
        </div>
      </section>
      
    );
  }
}

export default withRouter(AbstractSession);