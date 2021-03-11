import React from 'react';
import Cookies from 'js-cookie';
import $ from 'jquery';

export default class AnswerList extends React.Component {
  render(){
    let data = this.props.data;
    if (data === undefined || data === null || data.length == 0){
      return(
        <p>No answers yet for question {this.props.qID}</p>
      );
    }
    return(
      <>
        <ul>
          {this.props.data.map(answer => {
            //TODO add key
            return(
              <li key={answer.stamp}>
                {JSON.stringify(answer)}
              </li>
            );
          })}
        </ul>
      </>
    );
  }
}