import React from 'react';
import $ from 'jquery';

export default class User extends React.Component {
  componentDidMount(){
    if (this.props.user.email === ""){
      $.ajax({
        url: '/user',
        type: 'POST',
        dataType: 'json',
        success: (data, status, jqXHR)=>{
          console.log(data);
          let token = data.token;
          let user = data.user;
          if (token === undefined || token === null){
            this.setState({

            });
            console.log('JSON parsing failed');
            return;
          }
          this.props.setUser(user.fname, user.lname, user.email);
          Cookies.set('token', token);
          this.props.updateToken(token);
        },
        statusCode: {
          450: ()=>{
            //TODO redirect
          }
        }
      })
    }
  }

  render() {
    return (
      <>
      <section className="main">
        <div className="container-fluid">
          <div className="heading">
            <h1><i className="bi bi-person-circle"></i>Profile</h1>
          </div>
          <div className="sessionbox">
            <div className="box">
            <h1 className="text-center mb-3">Profile of {this.props.user.firstName}</h1>
              <div className="profile-element">
                <p className="text-center text-white">First Name: </p>
                <h3 className="text-center text-white">{this.props.user.firstName}</h3>
              </div>
              <div className="profile-element">
                <p className="text-center text-white">Last Name: </p>
                <h3 className="text-center text-white">{this.props.user.lastName}</h3>
              </div>
              <div className="profile-element">
                <p className="text-center text-white">Email: </p>
                <h3 className="text-center text-white">{this.props.user.email}</h3>
              </div>
            </div>
          </div>
        </div>
          
      </section>
      
      </>
    )
  }
}