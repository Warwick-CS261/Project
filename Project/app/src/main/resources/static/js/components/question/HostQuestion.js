import React from 'react';
import Cookies from 'js-cookie';
import $ from 'jquery';

/**
 * Host questions, delete question, push/end questions
 */
export default class HostQuestion extends React.Component {
  constructor(props){
    super(props);

    this.handleDelete = this.handleDelete.bind(this);
    this.handlePush = this.handlePush.bind(this);
    this.handleEnd = this.handleEnd.bind(this);
  }

  /**
   * Sends a delete request to the server with the selected questionID
   * @param {Object} e Triggered event
   */
  handleDelete(e){
    e.stopPropagation();
    let params = new URLSearchParams();
    params.append('qID', this.props.data.id);
    $.ajax({
      url: `/session/${this.props.sessionID}/question/delete`,
      type: 'POST',
      data: params.toString(),
      success: (data, status, jqXHR)=>{
        let object = JSON.parse(data);
        let token = object.token;
        if (token === null || token === undefined){
          console.log('Session response was invalid');
        }
        Cookies.set('token', token);
        this.props.updateToken(token);
      },
      statusCode: {
        450: ()=>{
          console.log('Invalid token');
        },
        454: ()=>{
          console.log('Session not found');
        },
        401: ()=>{
          console.log('Unauthorized');
        },
        457: ()=>{
          console.log('Question not found');
        }
      }
    });
  }

  /**
   * Sends a push request to the server with the selected questionID
   * @param {Object} e Triggered event
   */
  handlePush(e){
    e.stopPropagation();
    let params = new URLSearchParams();
    params.append('qID', this.props.data.id);
    $.ajax({
      url: `/session/${this.props.sessionID}/question/push`,
      type: 'POST',
      data: params.toString(),
      success: (data, status, jqXHR)=>{
        let object = JSON.parse(data);
        let token = object.token;
        if (token === null || token === undefined){
          console.log('Session response was invalid');
        }
        Cookies.set('token', token);
        this.props.updateToken(token);
      },
      statusCode: {
        450: ()=>{
          console.log('Invalid token');
        },
        454: ()=>{
          console.log('Session not found');
        },
        401: ()=>{
          console.log('Unauthorized');
        },
        457: ()=>{
          console.log('Question not found');
        }
      }
    });

  }

  /**
   * Sends a end request to the server with the selected questionID
   * @param {Object} e Triggered event
   */
  handleEnd(e){
    e.stopPropagation();
    let params = new URLSearchParams();
    params.append('qID', this.props.data.id);
    $.ajax({
      url: `/session/${this.props.sessionID}/question/end`,
      type: 'POST',
      data: params.toString(),
      success: (data, status, jqXHR)=>{
        let object = JSON.parse(data);
        let token = object.token;
        if (token === null || token === undefined){
          console.log('Session response was invalid');
        }
        Cookies.set('token', token);
        this.props.updateToken(token);
      },
      statusCode: {
        450: ()=>{
          console.log('Invalid token');
        },
        454: ()=>{
          console.log('Session not found');
        },
        401: ()=>{
          console.log('Unauthorized');
        },
        457: ()=>{
          console.log('Question not found');
        }
      }
    });
  }
  
  render(){
    let q = this.props.data;
    if (this.props.data.id === 0){
      // Special question, every session has it
      return(
        <li
          className={this.props.selected === q.id ? 
            "host-question active":"host-question"}
          data-mood={q.mood}
          onClick={()=>this.props.handleSelect(q.id)}
        >
          <button>
            General feedback
          </button>
        </li>
      );
    }

    return(
      <li
        className={this.props.selected === q.id ?
          "host-question active":"host-question"}
        data-mood={q.mood}
        onClick={()=>this.props.handleSelect(q.id)}
      >
        <button >
          {q.question}
        </button>
        <span className="controllers">
          {!this.props.finished &&
            this.props.pushed ?
              <button onClick={this.handleEnd} className="control">
                <i className="bi bi-eye-fill"></i>
              </button>
              :
              <button onClick={this.handlePush} className="control">
                <i className="bi bi-eye-slash-fill"></i>
              </button>
          }
          <button onClick={this.handleDelete} className="control">
            <i className="bi bi-trash-fill"></i>
          </button>
        </span>
      </li>
    );
  }
}