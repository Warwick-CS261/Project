import React from 'react';
import { NavLink } from 'react-router-dom';

import JoinSession from './session/JoinSession';
import CreateSession from './session/CreateSession';
import CreateSeries from './session/CreateSeries';

export default class Home extends React.Component {
  render() {
    return (
      <>
      
        <section className="main">
          <div className="container-fluid">
            <div className="heading">
              <h1><i className="bi bi-house-fill"></i>Home</h1>
            </div>
            <div className="content">
              <div className="home-action create-session">
                <h3>Host sessions</h3>
                <p>Host sessions and get analysed feedback on how it's going!</p>
                <NavLink 
                  to="/session/join" 
                  className="btn btn-dark btn-lg btn-round"
                  activeClassName="active"
                >
                  Join Session
                </NavLink>
              </div>
              <div className="home-action join-session">
                <h3>Give feedback</h3>
                <p>
                  Join a team and show how satisfied you are, ask questions and chat
                  with your teammates!
                </p>
                <NavLink 
                  to="/session/create" 
                  className="btn btn-primary btn-lg btn-round"
                  activeClassName="active"
                >
                  Create Session
                </NavLink>
              </div>
              <div className="home-action create-series">
                <h3>Organize workshops</h3>
                <p>Host a series of sessions, have a workshop hosted!</p>
                <NavLink 
                  to="/session/createSeries" 
                  className="btn btn-dark btn-lg btn-round"
                  activeClassName="active"
                >
                  Create Series
                </NavLink>
              </div>
            </div>
            
            
            

          </div>

          
      
        </section>
      
         
      </>
    );
  }
}