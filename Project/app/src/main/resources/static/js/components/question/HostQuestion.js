import React from 'react';
import Cookies from 'js-cookie';
import $ from 'jquery';
import { handleToken } from '../../util';

export default class HostQuestion extends React.Component {
  constructor(props){
    super(props);

    this.handleDelete = this.handleDelete.bind(this);
    this.handlePush = this.handlePush.bind(this);
    this.handleEnd = this.handleEnd.bind(this);
  }

  handleDelete(){
    let params = new URLSearchParams();
    params.append('qID', this.props.data.id);
    $.ajax({
      url: `/session/${this.props.sessionID}/question/delete`,
      type: 'POST',
      data: params,
      success: (data, status, jqXHR)=>{
        let token = handleToken(data);
        if (token === null || token === undefined){
          // TODO handle error in higher component
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

  handlePush(){
    let params = new URLSearchParams();
    params.append('qID', this.props.data.id);
    $.ajax({
      url: `/session/${this.props.sessionID}/question/push`,
      type: 'POST',
      data: params,
      success: (data, status, jqXHR)=>{
        let token = handleToken(data);
        if (token === null || token === undefined){
          // TODO handle error in higher component
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

  handleEnd(){
    let params = new URLSearchParams();
    params.append('qID', this.props.data.id);
    $.ajax({
      url: `/session/${this.props.sessionID}/question/end`,
      type: 'POST',
      data: params,
      success: (data, status, jqXHR)=>{
        let token = handleToken(data);
        if (token === null || token === undefined){
          // TODO handle error in higher component
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
    return(
      <li>
        <span>{q.question}</span>
        {this.props.pushed ?
          <button onClick={this.handleEnd}><i className="bi bi-slash-circle-fill"></i></button>
          :
          <button onClick={this.handlePush}><i className="bi bi-eye-slash-fill"></i></button>
        }
        <button onClick={this.handleDelete}><i className="bi bi-trash-fill"></i></button>
      </li>
    );
  }
}