import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  NavLink,
  Route
} from 'react-router-dom';

import JoinSession from './JoinSession';
import CreateSession from './CreateSession';
import CreateSeries from './CreateSeries';

export default class Home extends React.Component {
  render() {
    return (
      <div>
        <Router>
          <Switch>
            <Route exact path="/">
              <NavLink 
                to="/session/join" 
                activeClassName="active"
              >
                Join Session
              </NavLink>
              <NavLink 
                to="/session/create" 
                activeClassName="active"
              >
                Create Session
              </NavLink>
              <NavLink 
                to="/session/createSeries" 
                activeClassName="active"
              >
                Create Series
              </NavLink>
            </Route>
            <Route path="/session/create">
              <CreateSession updateToken={this.props.updateToken} />
            </Route>
            <Route path="/session/join" >
              <JoinSession updateToken={this.props.updateToken} />
            </Route>
            <Route path="/session/createSeries">
              <CreateSeries updateToken={this.props.updateToken} />
            </Route>
          </Switch>
        </Router>
      </div>
    );
  }
}