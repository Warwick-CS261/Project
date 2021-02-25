import React from 'react';
import JoinSession from './JoinSession';
import CreateSession from './CreateSession';
import CreateSeries from './CreateSeries';
export default class Main extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      pages: {
        create: false,
        join: false,
        series: false,
      },
    };
  }

  handleCreateSession(){
    this.setState({
      pages: {
        create: true,
        join: false,
        series: false,
      }
    });
  }

  handleJoinSession(){
    this.setState({
      pages: {
        create: false,
        join: true,
        series: false,
      }
    });
  }

  handleCreateSeries(){
    this.setState({
      pages: {
        create: false,
        join: false,
        series: true,
      }
    });
  }

  render(){
    let pages = {
      session: {

      },
      join: {

      },
      series: {
        
      }
    };

    let active;
    Object.keys(this.props.pages).forEach(key =>{
      if (this.props.pages[key]){
        active = key;
      }
    });
    if (active === undefined){
      active = 'home';
    }
    const nav = this.props.nav;

    if (active === 'home'){

      if (this.state.pages.create){
        return (
          <CreateSession />
        );
      }

      if (this.state.pages.join){
        return (
          <JoinSession />
        );
      }

      if (this.state.pages.series){
        return (
          <CreateSeries />
        );
      }

      return (
        <div>
          <h2>{nav[active].icon}<span>{nav[active].text}</span></h2>
          <button onClick={()=>this.handleCreateSession()}>Create Session</button>
          <button onClick={()=>this.handleJoinSession()}>Join Session</button>
          <button onClick={()=>this.handleCreateSeries()}>Create Series</button>
        </div>
      )
    }
    return(
      <div>
        <h2>{nav[active].icon}<span>{nav[active].text}</span></h2>
        <p>Test</p>
      </div>
    );
  }
}