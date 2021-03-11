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
    console.log(this.props.data);
    console.log("DATA ^");
    return(
      <>
        <ul>
          {this.props.data.map(answer => {
            //TODO add key
            return(
<<<<<<< HEAD
              <li key={answer.context}>
=======
              <li>
>>>>>>> 850030032942282b2cbd963ce42ebe236185c0f5
                {JSON.stringify(answer)}
              </li>
            );
          })}
        </ul>
      </>
    );
  }
}