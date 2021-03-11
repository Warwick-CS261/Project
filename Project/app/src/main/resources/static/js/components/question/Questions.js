import React from 'react';
import Cookies from 'js-cookie';
import $ from 'jquery';

import HostQuestion from './HostQuestion';
import AttendeeQuestion from './AttendeeQuestion';
import AnswerList from './AnswerList';
import Reaction from './Reaction';

export default class Questions extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      selected: 0,
    };

    this.handleSelect = this.handleSelect.bind(this);
  }


  handleSelect(qID){
    this.setState({
      selected: qID,
    });
  }

  render(){
    if (this.props.isHost){
      return(
        <>
          <div className="side">
            {this.props.pushedQuestions.map((pq) => {
              return(
                <HostQuestion
                  key={pq.id}
                  data={pq}
                  pushed={true}
                  sessionID={this.props.sessionID}
                  updateToken={this.props.updateToken}
                  handleSelect={this.handleSelect}
                  finished={this.state.finished}
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
                  finished={this.state.finished}
                />
              );
            })}
          </div>
          <div className="content">
            <AnswerList
              qID={this.state.selected}
              data={this.props.pushedQuestions[this.state.selected].answers}
            />
          </div>
        </>
      );
    } else {
      return(
        <>
          <div className="side">
          {this.props.pushedQuestions.map((pq) => {
              return(
                <AttendeeQuestion
                  key={pq.id}
                  data={pq}
                  pushed={true}
                  sessionID={this.props.sessionID}
                  handleSelect={this.handleSelect}
                />
              );
            })}
          </div>
          <div className="content">
            <Reaction
              qID={this.state.selected}
              sessionID={this.props.sessionID}
              question={this.state.question}
              updateToken={this.props.updateToken}
            />
          </div>
        </>
      );
    }
    
  }
}