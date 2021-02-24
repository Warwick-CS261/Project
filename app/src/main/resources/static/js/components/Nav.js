import React from 'react';
/**
* Navigation component
*/
export default class Nav extends React.Component {
  render(){
    const nav = this.props.nav;
    const pages = this.props.pages;

    return(
      <nav className="nav">
        <ul>
          <li 
            className={`nav-link ${pages.home ? 'active' : ''}`}
            id="nav-home" 
          >
            <a onClick={() => this.props.navHandler(nav.home.id)}>
              {nav.home.icon}
              <span>{nav.home.text}</span>
            </a>
          </li>
          <li 
            className={`nav-link ${pages.user ? 'active' : ''}`}
            id="nav-user"
          >
            <a onClick={() => this.props.navHandler(nav.user.id)}>
              {nav.user.icon}
              <span>{nav.user.text}</span>
            </a>
          </li>
          <li 
            className={`nav-link ${pages.sessions ? 'active' : ''}`} 
            id="nav-sessions"
          >
            <a onClick={()=> this.props.navHandler(nav.sessions.id)}>
              {nav.sessions.icon}
              <span>{nav.sessions.text}</span>
            </a>
          </li>
          <li 
            className={`nav-link ${pages.series ? 'active' : ''}`}
            id="nav-series"
          >
            <a onClick={()=> this.props.navHandler(nav.series.id)}>
              {nav.series.icon}
              <span>{nav.series.text}</span>
            </a>
          </li>
          <li 
            className={`nav-link ${pages.logout ? 'active' : ''}`}
            id="nav-logout"
          >
            <a onClick={()=> this.props.navHandler(nav.logout.id)}>
              {nav.logout.icon}
              <span>{nav.logout.text}</span>
            </a>
          </li>
        </ul>
      </nav>
    );
  }
}