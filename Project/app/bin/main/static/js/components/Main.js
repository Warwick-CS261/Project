import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  NavLink,
  Route,
  Redirect
} from 'react-router-dom';

import Home from './Home';
import Logo from './Logo';
import User from './User';
import Series from './Series';
import Sessions from './Sessions';

export default class Main extends React.Component {

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
        path: '/session',
        key: 'session',
        text: 'Session',
        icon: <i className="bi bi-calendar-event-fill"></i>,
      },
      {
        path: '/series',
        key: 'series',
        text: 'Series',
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
        <Router>
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
            <Route exact path={routes[0].path}>
              <Home updateToken={this.props.updateToken} />
            </Route>
            <Route path={routes[1].path}>
              <User />
            </Route>
            <Route path={routes[2].path}>
              <Sessions />
            </Route>
            <Route path={routes[3].path}>
              <Series />
            </Route>
          </Switch>
        </Router>
      </>
    );
  }
}