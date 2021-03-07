import React from 'react';
import Cookies from 'js-cookie';
import $ from 'jquery';
import {
  handleError,
  handleToken,
  handleJSON
} from '../../util';
import { Redirect } from 'react-router-dom';
import HostQuestion from './HostQuestion';
import AttendeeQuestion from './AttendeeQuestion';

export default class Questions extends React.Component {
  render(){

    console.log(JSON.stringify(this.props));
    if (this.props.isHost){
      return(
        <>
          <div className="side">
            {this.props.pushedQuestions.map((pq) => {
              console.log('reached');
              return(
                <HostQuestion
                  key={pq.id}
                  data={pq}
                  pushed={true}
                  sessionID={this.props.sessionID}
                />
              );
            })}
            {this.props.hiddenQuestions.map(hq =>{
              return(
                <HostQuestion
                  key={hq.id}
                  data={hq}
                  pushed={false}
                  sessionID={this.props.sessionID}
                />
              );
            })}
          </div>
          <div className="content">
            Answer list goes here
          </div>
        </>
      );
    } else {
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
}