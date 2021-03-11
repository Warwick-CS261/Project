import React from 'react';
import {
  Switch,
  NavLink,
  Route,
  Redirect,
  useHistory
} from 'react-router-dom';

import Home from './Home';
import Logo from './Logo';
import User from './User';
import MySessions from './MySessions';
import AttendeeSession from './session/AttendeeSession';
import HostSession from './session/HostSession';
import JoinSession from './session/JoinSession';
import CreateSession from './session/CreateSession';
import CreateSeries from './session/CreateSeries';
import AbstractSession from './session/AbstractSession';

export default class Main extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      session: null,
      isHost: false,
    }

    this.handleSession = this.handleSession.bind(this);
  }

  componentDidUpdate(){

  }

  handleSession(session){
    let host = false;
    if (session === null){
      this.setState({
        session: session,
        isHost: false,
      });
      return;
    }
    if (session.secure === undefined || session.secure === null) {
      host = false;
    } else {
      host = true;
    }
    this.setState({
      session: session,
      isHost: host,
    });
  }

  render(){

    const routes = [
      {
        path: '/',
        key: 'home',
        exact: true,
        text: 'Home',
        icon: <i className="bi bi-house-fill"></i>
      },
      {
        path: '/user',
        key: 'user',
        text: 'Profile',
        icon: <i className="bi bi-person-circle"></i>
      },
      {
        path: '/session/host',
        key: 'session/user',
        text: 'My Sessions',
        icon: <i className="bi bi-calendar-event-fill"></i>,
      },
      {
        path: '/session/user',
        key: 'sessions',
        text: 'Sessions',
        icon: <i className="bi bi-calendar-range-fill"></i>,
      },
      {
        path: '/logout',
        key: 'logout',
        text: 'Logout',
        icon: <i className="bi bi-box-arrow-left"></i>,
      }
    ];

    return(
      <>
      <section className="body">
        <section className="menu">
          <div className="logo">
            <Logo />
          </div>
          
          <nav className="nav">
            <ul>
              {routes.map((route, index) => {
                if (index < routes.length -1){
                  return(
                    <li className="nav-link" key={route.key}>
                      <NavLink 
                        to={route.path}
                        exact={route.exact}
                        children={<>{route.icon}<span>{route.text}</span></>}
                        activeClassName="active"
                      />
                    </li>
                  );
                }
              })}
              <li className="nav-link nav-logout" key="logout">
                <a 
                  href="/"
                  onClick={this.props.onLogout}
                ><i className="bi bi-box-arrow-left"></i>Logout</a>
              </li>
            </ul>
          </nav>
        </section>
        
        <Switch>
          {/* Home route */}
          <Route exact path={routes[0].path}>
            <Home />
          </Route>
          <Route path="/session/create">
            <CreateSession
              updateToken={this.props.updateToken}
              handleSession={this.handleSession}
              updateWatchToken={this.props.updateWatchToken}
            />
          </Route>
          <Route path="/session/join" >
            <JoinSession
              updateToken={this.props.updateToken}
              handleSession={this.handleSession}
              updateWatchToken={this.props.updateWatchToken}
            />
          </Route>
          <Route path="/session/createSeries">
            <CreateSeries
              updateToken={this.props.updateToken}
              handleSession={this.handleSession}
              updateWatchToken={this.props.updateWatchToken}
            />
          </Route>
          <Route path={routes[1].path}>
            <User user={this.props.user} />
          </Route>
          <Route path={routes[2].path}>
            <MySessions
              updateToken={this.props.updateToken}
              isMod={true}
            />
          </Route>
          <Route path={routes[3].path}>
            <MySessions
              updateToken={this.props.updateToken}
              isMod={false}
              user={this.props.user}
            />
          </Route>
          <Route path="/session/:id"
            children={
              <AbstractSession
                session={this.state.session}
                updateToken={this.props.updateToken}
                isHost={this.state.isHost}
                handleSession={this.handleSession}
                updateWatchToken={this.props.updateWatchToken}
              />
            }
          />
        </Switch>
      </section>
        
      </>
    );
  }
}