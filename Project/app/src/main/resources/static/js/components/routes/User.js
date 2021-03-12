import React from 'react';

export default class User extends React.Component {
  render() {
    return (
      <>
      <section className="main">
        <div className="container-fluid">
          <h1>Hi {this.props.user.firstName}</h1>
          <p>Your data:</p>
          <p>First Name: {this.props.user.firstName}</p>
          <p>Last Name: {this.props.user.lastName}</p>
          <p>Email: {this.props.user.email}</p>
        </div>
      </section>
      
      </>
    )
  }
}