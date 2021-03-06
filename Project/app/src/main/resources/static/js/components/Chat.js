import React from 'react';
import Cookies from 'js-cookie';
import $ from 'jquery';
import { Redirect } from 'react-router-dom';
import { handleToken } from '../util';



export default class Chat extends React.Component {
  constructor(props){
    super(props);
    if (this.props.chat !== null && this.props.chat !== undefined){
      this.state = {
        msgs: this.props.chat.messages,
        anon: false,
        msg: "",
        error: false,
      }
    } else {
      this.state = {
        msgs: [],
        anon: false,
        msg: "",
        error: false,
      }
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCheck = this.handleCheck.bind(this);

  }
  componentDidMount(){
    console.log(this.state.msgs);
  }

  handleChange(event){
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  handleCheck(event){
    this.setState({
      [event.target.name]: event.target.checked,
    })
  }

  handleSubmit(event){
    let params = new URLSearchParams();
    params.append("message", this.state.msg);
    params.append("anon", this.state.anon);
    console.log(params);
    $.ajax({
      url: `/session/${this.props.sessionID}/chat`,
      type: 'POST',
      data: params.toString(),
      success: (data, status, jqXHR) =>{
        let token = handleToken(data);
        if (token === null || token === undefined) {
          this.setState({
            error: 'Server response was invalid'
          });
          return;
        }
        Cookies.set('token', token);
        this.props.updateToken(token);
      },
      statusCode: {
        450: ()=>{
          // TODO display the reason for redirect
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
    let msgs;
    if (
        this.state.msgs === null ||
        this.state.msgs === undefined ||
        this.state.msgs.length == 0
      ) {
      msgs = null;
    } else {
      msgs = this.state.msgs.map((msg) => {
        <li key={msg.id}>
          {JSON.stringify(msg)}
        </li>
      });
    }

    return(
      <>
        <h3>Chat</h3>
        <ul>
        {msgs === null || msgs === undefined ?
          <p>No messages so far</p>
          :
          {msgs}
        }
        </ul>
        <form onSubmit={this.handleSubmit}>
          {this.state.error !== false && 
            <div className="alert alert-danger" role="alert">
              {this.state.error}
            </div>
          }
          <div className="mb-3">
            <input
              type="text"
              name="msg"
              className="form-control"
              onChange={this.handleChange}
              placeholder="Send a message"
            />  
          </div>
          <div className="mb-3">
            <input
              type="checkbox"
              name="anon"
              className="form-check-input"
              onChange={this.handleCheck}
            />
          </div>
          <div className="mb-3">
            <button
              type="submit"
              className="btn btn-primary"
            >
              Send
            </button>
          </div>
        </form>
      </>
    );
  }
}