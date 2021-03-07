import React from 'react';
import Cookies from 'js-cookie';
import $ from 'jquery';
import {
  handleError,
  handleToken,
  handleJSON
} from '../../util';
import { Redirect } from 'react-router-dom';

export default class Questions extends React.Component {
  render(){
    if (this.props.isHost){
      return(
        <>
          <div className="side">
            {this.props.pushedQuestions.map(pq => {
              return(
                <HostQuestion key={pq.id} data={pq} pushed={true} />
              );
            })}
            {this.props.hiddenQuestions.map(hq =>{
              return(
                <AttendeeQuestion key={pq.id} data={pq} pushed={false} />
              );
            })}
          </div>
          <div className="content">
            Answer list goes here
          </div>
        </>
      );
    }


    return(
      <>
        <div className="side">

        </div>
        <div className="content">

        </div>
      </>
    );
  }
}