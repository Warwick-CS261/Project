import Nav from './Nav';
import Logo from './Logo';

export default class Sidebar extends React.Component {
  render(){
    return(
      <div>
        <Logo />
        <Nav token={this.props.token} onLogout={this.props.onLogout} />
      </div>
    );
  }
}