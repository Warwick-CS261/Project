import React from 'react';
import Cookies from 'js-cookie';
import $ from 'jquery';
import { Redirect } from 'react-router-dom';
import { handleToken } from '../util';

export default class Reaction extends React.Component {
  constructor(props){
    super(props);
    if (this.props.qID === null || this.props.qID === undefined){
      this.state = {
        question: "How's the session going?",
        answer: "",
        anon: false,
        smiley: -1,
        qID: -1,
      }
    } else {
      this.state = {
        question: this.props.question,
        answer: "",
        anon: false,
        smiley: -1,
        qID: this.props.qID
      }
    }
    
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
    params.append('anon',this.state.anon);
    params.append();

    // TODO check that one of the smileys are selected
    event.preventDefault();
  }

  handleClick(){
    // TODO check if only one smiley is selected
    // remove selection from others
  }

  render(){
    return(
      <>
        <h6>{this.state.question}</h6>
        <hr />
        <form onSubmit={this.handleSubmit} >
          <div className="mb-3" >
            <button
              onClick={this.handleClick}
              className="happy"
            >
              <i class="bi bi-emoji-laughing-fill"></i>
            </button>
            <button
              onClick={this.handleClick}
              className="neutral"
            >
              <i class="bi bi-emoji-neutral-fill"></i>
            </button>
            <button
              onClick={this.handleClick}
              className="sad"
            >
              <i class="bi bi-emoji-frown-fill"></i>
            </button>
          </div>
          <div className="mb-3" >
            <input
              type="text"
              name="answer"
              onChange={this.handleChange}
              value={this.state.answer}
              className="form-control"
              autoFocus
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