import React from 'react';

import Nav from './Nav';
import Logo from './Logo';

export default class Sidebar extends React.Component {
  render(){
    return(
      <div>
        <Logo />
        <Nav 
          pages={this.props.pages}
          onLogout={this.props.onLogout} 
          navHandler={this.props.navHandler}
          nav={this.props.nav}
        />
      </div>
    );
  }
}