import React from 'react';
/**
* Navigation component
*/
export default class Nav extends React.Component {
  constructor(props){
    super(props);
   // TODO lift up the nav states to the app so that the content can make us of the pages
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event){
    id = event.target.id.substring(4);
    if (id == logout){
      Cookies.remove('token');
      this.props.onLogout();
    }
    // TODO active class handling
  }

  render(){
    return(
      <nav className="nav">
        <ul>
          <li 
            className={`nav-link ${this.props.pages.home.active ? 'active' : ''}`}
            id="nav-home" 
            onClick={this.props.handleNav}
          >
            {this.props.pages.home.icon}
            <span>{this.props.pages.home.text}</span>
          </li>
          <li 
            className={`nav-link ${this.props.pages.user.active ? 'active' : ''}`}
            id="nav-user"
            onClick={this.props.handleNav}
          >
            {this.props.pages.user.icon}
            <span>{this.props.pages.user.text}</span>
          </li>
          <li 
            className={`nav-link ${this.props.pages.sessions.active ? 'active' : ''}`} 
            id="nav-sessions"
            onClick={this.props.handleNav}
          >
            {this.props.pages.sessions.icon}
            <span>{this.props.pages.sessions.text}</span>
          </li>
          <li 
            className={`nav-link ${this.props.pages.series.active ? 'active' : ''}`}
            id="nav-series"
            onClick={this.props.handleNav}
          >
            {this.props.pages.series.icon}
            <span>{this.props.pages.series.text}</span>
          </li>
          <li 
            className={`nav-link ${this.props.pages.logout.active ? 'active' : ''}`}
            id="nav-logout"
            onClick={this.props.handleNav}
          >
            {this.props.pages.logout.icon}
            <span>{this.props.pages.logout.text}</span>
          </li>
        </ul>
      </nav>
    );
  }
}