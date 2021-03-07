import React from 'react';
import Cookies from 'js-cookie';
import $, { param } from 'jquery';
import {
  handleError,
  handleToken,
  handleJSON
} from '../../util';
import { Redirect } from 'react-router-dom';

export default class CreateQuestion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      question: "",
      pushed: false,
      error: false,
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
    params.append('question', this.state.question);
    params.append('pushed', this.state.pushed);
    $.ajax({
      url: `/session/${this.props.sessionID}/question/create`,
      type: 'POST',
      data: params.toString(),
      success: (data, status, jqXHR) => {
        let token = handleToken(data);
        if (token === null || token === undefined ){
          this.setState({
            error: data,
          });
          return;
        }
        let question = handleJSON(data);
        if (question === null) {
          this.setState({
            error: 'Server response was invalid',
          });
          return;
        }
        console.log(question);
        // set new tokens
        Cookies.set('token', token);
        this.props.updateToken(token);
        // TODO update session component with the question
      },
      statusCode: {
        401: ()=>{
          this.setState({
            error: 'Action not authorized',
          });
        },
        450: ()=> {
          this.setState({
            error: 'Token invalid',
          });
        },
        454: ()=>{
          this.setState({
            error: 'Session not found',
          });
        }
      }
    });
    event.preventDefault();
  }

  render() {
    return(
      <>
        <h2>Create Question</h2>
        {this.state.error !== false && 
          <div className="alert alert-danger" role="alert">
            {this.state.error}
          </div>
        }
        <form onSubmit={this.handleSubmit}>
          <div className="mb-3">
            <input 
              type="text"
              name="question"
              className="form-control"
              value={this.state.question}
              onChange={this.handleChange}
              autoFocus
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="checkbox"
              name="pushed"
              className="form-check-input"
              value={this.state.pushed}
              onChange={this.handleCheck}
            />
          </div>
          <div className="mb-3">
            <button 
              type="submit"
              className="btn btn-primary"
            >
              Create Question
            </button>
          </div>
        </form>
      </>
    )
  }
}