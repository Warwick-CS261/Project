import React from 'react';
import Cookies from 'js-cookie';
import $ from 'jquery';

export default class AnswerList extends React.Component {
  render(){
    let data = this.props.data;
    if (data === undefined || data === null || data.length == 0){
      return(
        <p>No responses yet</p>
      );
    }
    return(
      <>
        <ul className="list-unstyled w-100">
          {this.props.data.map(answer => {
            return(
              <div className="question-host">
                <li
                  key={answer.stamp+answer.context}
                  className="answer"
                  data-smiley={answer.smiley}
                >
                  <span><i className="bi bi-person-circle"></i></span>
                  {!answer.anon ?
                    <span>{answer.user.fname} {answer.user.lname}</span>
                    :
                    <span>Anonymous</span>
                  } &#8212; 
                  <span>{answer.stamp}</span>
                  <p>{answer.context}</p>
                </li>
              </div>
              
            );
          })}
        </ul>
      </>
    );
  }
}