import React from 'react';
import { NavLink } from 'react-router-dom';

import JoinSession from './session/JoinSession';
import CreateSession from './session/CreateSession';
import CreateSeries from './session/CreateSeries';

export default class Home extends React.Component {
  render() {
    return (
      <>
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
      </>
    );
  }
}