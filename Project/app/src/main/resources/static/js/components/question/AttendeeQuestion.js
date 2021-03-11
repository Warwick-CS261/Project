import React from 'react';
import Cookies from 'js-cookie';
import $ from 'jquery';

export default class AttendeeQuestion extends React.Component {
  render(){
    let q = this.props.data;
    return(
      <li>
        <button onClick={()=>this.props.handleSelect(q.id)}>
          {q.question}
        </button>
      </li>
    );
  }
}