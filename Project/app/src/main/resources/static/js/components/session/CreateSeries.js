import React from 'react';
import Cookies from 'js-cookie';
import $ from 'jquery';
import { Redirect } from 'react-router-dom';

export default class CreateSeries extends React.Component {
  render() {
    return(
      <>
        <section className="main">
          <div className="container-fluid">
            <div className="heading">
              <h1><i className="bi bi-pencil-fill"></i> Create Session</h1>
            </div>
            <div className="alert alert-info mt-3" role="alert">
              Clone your sessions on the My sessions tab
            </div>
          </div>
        </section>  
      </>
    )
  }
}