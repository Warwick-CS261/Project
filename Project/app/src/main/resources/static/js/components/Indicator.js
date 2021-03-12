import React from 'react';

export default class Indicator extends React.Component {
  render(){
    return(
      <div>
        <div className="circle"></div>
        <div className="faces">
          <i className="bi bi-emoji-laughing-fill"></i>
          <i className="bi bi-emoji-neutral-fill"></i>
          <i className="bi bi-emoji-frown-fill"></i>
        </div>
      </div>
    )
  }
}