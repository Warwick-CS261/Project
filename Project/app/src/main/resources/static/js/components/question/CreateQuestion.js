import React from 'react';
import Cookies from 'js-cookie';
import $ from 'jquery';
import { Redirect } from 'react-router-dom';

export default class CreateQuestion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      question: "",
      pushed: false,
      error: false,
      general: false,
      success: false,
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
    params.append('general', this.state.general);
    
    $.ajax({
      url: `/session/${this.props.sessionID}/question/create`,
      type: 'POST',
      data: params.toString(),
      success: (data, status, jqXHR) => {
        let object = JSON.parse(data);
        let token = object.token;
        if (token === null || token === undefined ){
          this.setState({
            error: data,
          });
          return;
        }
        let question = object.question;
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
        this.setState({
          question: '',
          success: true,
        });
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
      <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#createQuestion">
          Create Question
        </button>
        <div className="modal fade" id="createQuestion" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={this.handleSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">Create Question</h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  {this.state.success && 
                    <div className="alert alert-success" role="alert">
                      New question has been created
                    </div>
                  }
                  {this.state.error !== false && 
                    <div className="alert alert-danger" role="alert">
                      {this.state.error}
                    </div>
                  }
                  <div className="mb-3">
                    <input 
                      type="text"
                      name="question"
                      className="form-control"
                      value={this.state.question}
                      onChange={this.handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    Push question immediately.
                    <input
                      type="checkbox"
                      name="pushed"
                      className="form-check-input"
                      value={this.state.pushed}
                      onChange={this.handleCheck}
                    />
                  </div>
                  <div className="mb-3">
                    Include it in the general feedback
                    <input
                      type="checkbox"
                      name="general"
                      className="form-check-input"
                      value={this.state.general}
                      onChange={this.handleCheck}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button 
                    type="submit"
                    className="btn btn-primary"
                    disabled={!this.state.question}
                  >
                    Create Question
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </>
    )
  }
}