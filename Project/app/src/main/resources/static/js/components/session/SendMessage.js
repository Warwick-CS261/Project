import React from 'react';
import Cookies from 'js-cookie';
import $ from 'jquery';
import { Redirect } from 'react-router-dom';

/**
 * Under chat message form controlled component
 */
export default class SendMessage extends React.Component {
  constructor(props){
    super(props);
    if (this.props.chat !== null && this.props.chat !== undefined){
      this.state = {
        anon: false,
        msg: "",
        error: false,
      };
    } else {
      this.state = {
        anon: false,
        msg: "",
        error: false,
      };
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
  }


  handleChange(event){
    if (this.state.error === false) {
      this.setState({
        [event.target.name]: event.target.value,
      });
    } else {
      this.setState({
        [event.target.name]: event.target.value,
        error: false,
      });
    }
  }

  handleCheck(event){
    this.setState({
      [event.target.name]: event.target.checked,
    })
  }

  handleSubmit(event){
    if (this.state.msg === ""){
      this.setState({
        error: 'Cannot send empty message',
      });
      event.preventDefault();
      return;
    }
    let params = new URLSearchParams();
    params.append("message", this.state.msg);
    params.append("anon", this.state.anon);
    $.ajax({
      url: `/session/${this.props.sessionID}/chat`,
      type: 'POST',
      data: params.toString(),
      success: (data, status, jqXHR) =>{
        let object = JSON.parse(data);
        let token = object.token;
        if (token === null || token === undefined) {
          this.setState({
            error: 'Server response was invalid'
          });
          return;
        }
        Cookies.set('token', token);
        this.props.updateToken(token);
        this.setState({
          msg: "",
        });
      },
      statusCode: {
        450: ()=>{
          Cookies.remove('token');
          this.props.updateToken(null);
          this.setState({
            error: <Redirect to="/auth/login" />,
          });
        },
        454: ()=> {
          console.log('Invalid session');
          this.setState({
            error: 'Session with that id is not found'
          });
        },
        457: ()=>{
          console.log('Empty message');
        }
      }
    });
    event.preventDefault();
  }

  render(){
    return(
      <form onSubmit={this.handleSubmit}>
        {this.state.error !== false && 
          <div className="alert alert-danger" role="alert">
            {this.state.error}
          </div>
        }
        <div className="chat-anonymous">
          <input
            type="checkbox"
            name="anon"
            className="form-check-input"
            onChange={this.handleCheck}
            value={this.state.anon}
          />
          <div className="anonymous fs-6">Anonymous</div>
        </div>
        
        <div className="chat-input">
          <input
            type="text"
            name="msg"
            className=""
            onChange={this.handleChange}
            value={this.state.msg}
            placeholder="Send a message"
          />  
          
          <button
            type="submit"
            className="transparent-button"
            disabled={!this.state.msg}
          >
            <i className="bi bi-cursor-fill fs-3"></i>
          </button>
        </div>
      </form>
    )
  }
}