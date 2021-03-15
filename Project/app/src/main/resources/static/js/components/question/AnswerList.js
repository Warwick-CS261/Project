import React from 'react';
import Cookies from 'js-cookie';
import $ from 'jquery';

/**
 * List of answers of the selected question, host only
 */
export default class AnswerList extends React.Component {
  render(){
    let data = this.props.data;
    if (data === undefined || data === null || data.length == 0){
      return(
        <div className="alert alert-info w-100" role="alert">
          No responses yet for this question
        </div>
      );
    }
    return(
      <>
        <ul className="list-unstyled w-100">
          {this.props.data.map(answer => {
            return(
              <div className="question-host">
                <li
                  key={answer.stamp}
                  className="answer"
                  data-smiley={answer.smiley}
                >
                  
                  {!answer.anon ?
                    <span>{answer.user.fname} {answer.user.lname}</span>
                    :
                    <span>Anonymous</span>
                  }
                  <span className="stamp">{answer.stamp}</span>
                  <p><span className="user-profile"><i className="bi bi-person-circle"></i> </span>{answer.context}</p>
                </li>
              </div>
              
            );
          })}
        </ul>
      </>
    );
  }
}