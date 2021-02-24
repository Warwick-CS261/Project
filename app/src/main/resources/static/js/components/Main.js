import React from 'react';
export default class Main extends React.Component {
  render(){
    let active;
    Object.keys(this.props.pages).forEach(key =>{
      if (this.props.pages[key]){
        active = key;
      }
    });
    const nav = this.props.nav;
    return(
      <div>
        <h2>{nav[active].icon}<span>{nav[active].text}</span></h2>
        <p>Test</p>
      </div>
    );
  }
}