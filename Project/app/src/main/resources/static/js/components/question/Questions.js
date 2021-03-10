import React from 'react';
import Cookies from 'js-cookie';
import $ from 'jquery';

import HostQuestion from './HostQuestion';
import AttendeeQuestion from './AttendeeQuestion';
import AnswerList from './AnswerList';

export default class Questions extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      selected: -1,
    };

    this.handleSelect = this.handleSelect.bind(this);
  }


  handleSelect(qID){
    this.setState({
      selected: qID,
    });
  }

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
                  updateToken={this.props.updateToken}
                  handleSelect={this.handleSelect}
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
                  updateToken={this.props.updateToken}
                  handleSelect={this.handleSelect}
                />
              );
            })}
          </div>
          <div className="content">
            <AnswerList
              qID={this.state.selected}
              data={this.props.pushedQuestions.answers}
            />
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