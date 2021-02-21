/**
* Navigation component
*/
export default class Nav extends React.Component {
  constructor(props){
    super(props);
   // TODO lift up the nav states to the app so that the content can make us of the pages
    this.state = {
      navs: {
        home: false,
        user: false,
        sessions: false,
        series: false,
        logout: false,
      },
    };
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
            className="nav-link nav-home" 
            id="nav-home" 
            onClick={this.handleClick}
          >
            <i className="bi bi-house-fill"></i> 
            <span>Home</span>
          </li>
          <li 
            className="nav-link nav-user" 
            id="nav-user"
            onClick={this.handleClick}
          >
            <i className="bi bi-person-circle"></i> 
            <span>User</span>
          </li>
          <li 
            className="nav-link nav-sessions" 
            id="nav-sessions"
            onClick={this.handleClick}
          >
            <i className="bi bi-calendar-event-fill"></i>
            <span>Session</span>
          </li>
          <li 
            className="nav-link nav-series" 
            id="nav-series"
            onClick={this.handleClick}
          >
            <i className="bi bi-calendar-range-fill"></i> 
            <span>Series</span>
          </li>
          <li 
            className="nav-link nav-logout" 
            id="nav-logout"
            onClick={this.handleClick}
          >
            <i className="bi bi-box-arrow-left"></i> 
            <span>Logout</span>
          </li>
        </ul>
      </nav>
    );
  }
}