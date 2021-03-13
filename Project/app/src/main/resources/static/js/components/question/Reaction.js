import React from 'react';
import Cookies from 'js-cookie';
import $ from 'jquery';
import { Redirect } from 'react-router-dom';

export default class Reaction extends React.Component {
  constructor(props){
    super(props);
    if (this.props.qID === null || this.props.qID === undefined){
      this.state = {
        context: "",
        anon: false,
        smiley: -1,
        qID: 0,
        error: false,
      }
    } else {
      this.state = {
        context: "",
        anon: false,
        smiley: -1,
        qID: this.props.qID,
        error: false,
      }
    }
    
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
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
    if (this.state.smiley === -1){
      this.setState({
        error: 'You need to select a mood to send the response',
      });
      event.preventDefault();
      return;
    }
    let params = new URLSearchParams();
    params.append('anon',this.state.anon);
    params.append('qID', this.props.qID);
    params.append('smiley', this.state.smiley);
    params.append('context', this.state.context);
    $.ajax({
      url: `/session/${this.props.sessionID}/question/submit`,
      type: 'POST',
      data: params.toString(),
      success: (data, status, jqXHR) =>{
        let json = JSON.parse(data);
        let token = json.token;
        if (token === null || token === undefined){
          this.setState({
            error: 'Server response was invalid'
          });
          return;
        }
        Cookies.set('token', token);
        this.props.updateToken(token);
        this.setState({
          context: '',
        });
      },
      statusCode: {
        450: ()=>{
          console.log('Invalid token');
          this.setState({
            error: <Redirect to="/auth/login" />,
          });
        },
        454: ()=>{
          console.log('Session not found');
          this.setState({
            error: <Redirect to="/" />,
          });
        },
        457: ()=>{
          console.log('Question not found');
        }
      }
    });
    // TODO check that one of the smileys are selected
    event.preventDefault();
  }

  handleClick(btn, event){
    // TODO check if only one smiley is selected
    // remove selection from others
    console.log(event);
    console.log(btn);
    let num;
    switch(btn){
      case 'happy':
        num = 3;
        break;
      case 'neutral':
        num = 2;
        break;
      case 'sad':
        num = 1;
        break;
    }
    $(`#happy-btn`).removeClass('active');
    $(`#neutral-btn`).removeClass('active');
    $(`#sad-btn`).removeClass('active');
    let button = '#'+btn.toString()+'-btn';
    $(button).addClass('active');
    this.setState({
      smiley: num,
    });
  }

  render(){
    return(
      <>
        <p className="text-center fs-5 fw-bold">{this.props.question ? this.props.question : 'How is the session going?'}</p>
        <hr />
        {this.state.error !== false && (
          <div className="alert alert-danger" role="alert">
            {this.state.error}
          </div>
        )}
        <form onSubmit={this.handleSubmit} >
          <div className="mb-3" >
            <button
              type="button"
              onClick={this.handleClick.bind(this,"happy")}
              className="happy"
              id="happy-btn"
            >
              <i className="bi bi-emoji-laughing-fill"></i>
            </button>
            <button
              type="button"
              onClick={this.handleClick.bind(this,"neutral")}
              className="neutral"
              id="neutral-btn"
            >
              <i className="bi bi-emoji-neutral-fill"></i>
            </button>
            <button
              type="button"
              onClick={this.handleClick.bind(this,"sad")}
              className="sad"
              id="sad-btn"
            >
              <i className="bi bi-emoji-frown-fill"></i>
            </button>
          </div>
          <div className="mb-3" >
            <input
              type="text"
              name="context"
              onChange={this.handleChange}
              value={this.state.context}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="checkbox"
              name="anon"
              onChange={this.handleCheck}
              value={this.state.anon}
              className="form-check-input"
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