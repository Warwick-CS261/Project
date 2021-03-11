import React from 'react';
import Cookies from 'js-cookie';
import $ from 'jquery';

export default class AnswerList extends React.Component {
  render(){
    let data = this.props.data;
    if (data === undefined || data === null){
      return(
        <p>No answers yet for question {this.props.qID}</p>
      );
    }

    return(
      <>
        <ul>
          {this.props.data.map(answer => {
            return(
              <li key={answer.}>
                {JSON.stringify(answer)}
              </li>
            );
          })}
        </ul>
      </>
    );
  }
}