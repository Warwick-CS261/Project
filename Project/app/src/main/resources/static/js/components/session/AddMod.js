import React from 'react';
import Cookies from 'js-cookie';
import $ from 'jquery';
import { Modal } from 'bootstrap';
import { Redirect } from 'react-router';

/**
 * Adding moderator controlled Modal component
 */
export default class AddMod extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      email: '',
      error: false,
      success: false,
    };


    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event){
    this.setState({
      [event.target.name]: event.target.value,
      error: false,
      success: false,
    });
  }

  handleSubmit(event){
    if (this.state.email === ''){
      this.setState({
        error: 'Enter email address'
      });
      event.preventDefault();
      return;
    }

    let params = new URLSearchParams();
    params.append("email", this.state.email);
    $.ajax({
      url: `/session/${this.props.sessionID}/addHost`,
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
          email: "",
          success: true,
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
          this.setState({
            error: 'User with email not found'
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
      <>
        <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addModModal">
          <i className="bi bi-person-plus-fill"></i> Add Host
        </button>
        <div className="modal fade" id="addModModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={this.handleSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">Add Moderator</h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  
                    {this.state.error !== false && 
                      <div className="alert alert-danger" role="alert">
                        {this.state.error}
                      </div>
                    }
                    {this.state.success && 
                      <div className="alert alert-success" role="alert">
                        New modarator has been successfully added
                      </div>
                    }
                    <div className="mb-3">
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        onChange={this.handleChange}
                        value={this.state.email}
                        placeholder="New Host Email"
                        required
                      />  
                    </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={!this.state.email}
                  >
                    Add Host
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        
      </>
    );
  }
}