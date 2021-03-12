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
      pushed: true,
    };

    this.handleSelect = this.handleSelect.bind(this);
  }


  handleSelect(qID, push){
    this.setState({
      selected: qID,
    });
  }

  render(){
    if (this.props.isHost){
      let answers;
      this.props.pushedQuestions.forEach(q => {
        if (q.id === this.state.selected){
          answers = q.answers;
        }
      });
      this.props.hiddenQuestions.forEach(q => {
        if (q.id === this.state.selected){
          answers = q.answers;
        }
      });
      return(
        <>
          <div className="question-container">
            <div className="question-left">
              <h3 className="questions">Questions</h3>
              <hr className="text-white"></hr>
              <div className="question-scroll">
                <ul className="list-unstyled">
                {this.props.pushedQuestions.map((pq) => {
                  return(
                    <HostQuestion
                      key={pq.id}
                      data={pq}
                      pushed={true}
                      sessionID={this.props.sessionID}
                      updateToken={this.props.updateToken}
                      handleSelect={this.handleSelect}
                      finished={this.props.finished}
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
                      finished={this.props.finished}
                    />
                  );
                })}
                </ul>
              </div>
            </div>
            <div className="question-right">
              <div className="content">
                <AnswerList
                  qID={this.state.selected}
                  data={answers}
                />
              </div>
            </div>
          </div>
          
        </>
      );
    } else {
      return(
        <>
          <div className="question-container">
            <div className="question-left">
              <h3 className="questions">Questions</h3>
              <hr className="text-white"></hr>
              <div className="question-scroll">
                <ul className="list-unstyled">
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
                </ul>
              </div>
            </div>
            <div className="question-right">
              <div className="content">
                <Reaction
                  qID={this.state.selected}
                  sessionID={this.props.sessionID}
                  question={this.state.question}
                  updateToken={this.props.updateToken}
                />
              </div>
            </div>
          </div>
          
          
        </>
      );
    }
    
  }
}