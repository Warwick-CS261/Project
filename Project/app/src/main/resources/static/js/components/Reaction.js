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
}