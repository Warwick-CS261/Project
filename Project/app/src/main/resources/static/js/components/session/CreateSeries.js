import React from 'react';
import Cookies from 'js-cookie';
import $ from 'jquery';
import { Redirect } from 'react-router-dom';

export default class CreateSeries extends React.Component {
  /*
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      secure: false,
      error: false,
      submitted: false,
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
    params.append('name', this.state.name);
    params.append('secure', this.state.secure);
    $.ajax({
      url: '/series/create',
      type: 'POST',
      data: params.toString(),
      success: (data, status, jqXHR) => {
        let object = JSON.parse(data);
        let token = object.token;
        if (token === null || token === undefined || watchToken === undefined || watchToken === null){
          this.setState({
            error: data,
          });
          return;
        }
        let series = object.series;
        if (series === null) {
          this.setState({
            error: 'Server response was invalid',
          });
          return;
        }
        // set new tokens
        Cookies.set('token', token);
        Cookies.set('watchToken', watchToken);
        this.props.updateToken(token);
        // update main component
        this.props.handleSeries(series);
        this.setState({
          submitted: true,
        });
      },
      statusCode: {
        450: ()=>{

        },
        457: ()=>{

        }
      }
    });
    event.preventDefault();
  }
  */
  render() {
    /*
    if (this.state.submitted){
      return <Redirect to={`/session/${this.state.sessionID}`} />
    }
    */

    return(
      <>
        <section className="main">
          <div className="container-fluid">
            <div className="alert alert-info mt-3" role="alert">
              Feature of the future
            </div>
            {/*<div className="heading">
              <h1><i className="bi bi-box-arrow-in-right"></i>Create Series</h1>
            </div>
            <div className="sessionbox">
              <div className="box">
                <h3>Enter series name:</h3>
                {this.state.error !== false && 
                <div className="alert alert-danger" role="alert">
                  {this.state.error}
                </div>
                }
                <form onSubmit={this.handleSubmit}>
                  <div className="mb-3">
                    <input 
                      type="text"
                      name="name"
                      className="form-control"
                      value={this.state.name}
                      onChange={this.handleChange}
                      autoFocus
                      required
                    />
                  </div>
                  <div className="sessionprivate">
                    <input
                      type="checkbox"
                      name="secure"
                      className="form-check-input"
                      value={this.state.secure}
                      onChange={this.handleCheck}
                    />
                    <p className="private">Private</p>
                  </div>
                  
                  <div className="mb-3">
                    <button 
                      type="submit"
                      className="btn btn-primary"
                    >
                      Create Series
                    </button>
                  </div>
                </form>
              </div>
              </div> */}
          </div>
        </section>  
      </>
    )
  }
}