import React from 'react';
import Cookies from 'js-cookie';
import $ from 'jquery';

export default class AttendeeQuestion extends React.Component {
  render(){
    let q = this.props.data;
    if (this.props.data.id === 0){
      return(
        <li
          className={this.props.selected === q.id ?
            "attendee-question active":"attendee-question" 
          }
          onClick={()=>this.props.handleSelect(q.id)}
        >
          <button>
            General Feedback
          </button>
        </li>
      );
    }

    return(
      <li
        className={this.props.selected === q.id ?
          "attendee-question active":"attendee-question" 
        }
        onClick={()=>this.props.handleSelect(q.id)}
      >
        <button>
          {q.question}
        </button>
      </li>
    );
  }
}