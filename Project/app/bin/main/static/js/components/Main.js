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
import Sessions from './Sessions';
import MySessions from './MySessions';
import AttendeeSession from './AttendeeSession';
import HostSession from './HostSession';
import JoinSession from './JoinSession';
import CreateSession from './CreateSession';
import CreateSeries from './CreateSeries';

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
    }, ()=> {
      console.log("this should be 1st");
    });
  }

  componentDidMount() {
    history.pushState({route:'/'}, '', '/');
  }

  render(){
    let home = {
      session: {
        id: 'session',
        icon: <i class="bi bi-calendar-plus-fill"></i>,
        text: 'Create Session'
      },
      join: {
        id: 'join',
        icon: <i class="bi bi-box-arrow-in-right"></i>,
        text: 'Join Session'
      },
      series: {
        id: 'series',
        icon: <i class="bi bi-calendar-week-fill"></i>,
        text: 'Create Series'
      }
    };

    let user = {
      id: 'user',
      icon: <i class="bi bi-person-circle"></i>,
      text: 'Your Profile'
    };

    let sessions = {
      grid: {
        id: 'grid',
        icon: <i class="bi bi-calendar-week-fill"></i>,
        text: 'Sessions'
      },
      session: {
        id: 'session',
        icon: <i class="bi bi-calendar-date-fill"></i>,
      }
    };

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
        path: '/session/user',
        key: 'session/user',
        text: 'My Sessions',
        icon: <i className="bi bi-calendar-event-fill"></i>,
      },
      {
        path: '/sessions',
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
        <Logo />
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
                    />
                  </li>
                );
              }
            })}
            <li className="nav-link" key="logout">
              <a 
                href="/"
                onClick={this.props.onLogout}
              ><i className="bi bi-box-arrow-left"></i>Logout</a>
            </li>
          </ul>
        </nav>
        <Switch>
          {/* Home route */}
          <Route exact path={routes[0].path}>
            <Home />
          </Route>
          <Route path="/session/create">
            <CreateSession
              updateToken={this.props.updateToken}
              handleSession={this.handleSession}
            />
          </Route>
          <Route path="/session/join" >
            <JoinSession
              updateToken={this.props.updateToken}
              handleSession={this.handleSession}
            />
          </Route>
          <Route path="/session/createSeries">
            <CreateSeries
              updateToken={this.props.updateToken}
              handleSession={this.handleSession}
            />
          </Route>
          <Route path={routes[1].path}>
            <User />
          </Route>
          <Route path={routes[2].path}>
            <MySessions />
          </Route>
          <Route path={routes[3].path}>
            <Sessions />
          </Route>
          <Route path="/session/:id">
            {this.state.isHost ?
              <HostSession
                session={this.state.session}
                handleSession={this.handleSession}
              />
              :
              <AttendeeSession
                session={this.state.session}
                handleSession={this.handleSession}
              />
            }
          </Route>
        </Switch>
      </>
    );
  }
}