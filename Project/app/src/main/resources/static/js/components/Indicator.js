import React from 'react';

export default class Indicator extends React.Component {
  render(){
    let colors = ['#e05841', '#E06641', '#E07341', '#E08141', '#E08E41', '#E09C41', '#E0AA41', '#E0B741', '#E0C541', '#E0D241', '#E0E041', '#D0E042', '#C0E042', '#B0E043', '#A0E043', '#91E144', '#81E145', '#71E145', '#61E146', '#51E146', '#41E147']

    let mood = this.props.mood;
    mood = Math.round((mood + 1)*10);

    let color = colors[mood]


    return(
      <div>
        <div className="circle" style={{backgroundColor: color}}></div>
        <div className="faces">
          <i className="bi bi-emoji-laughing-fill"></i>
          <i className="bi bi-emoji-neutral-fill"></i>
          <i className="bi bi-emoji-frown-fill"></i>
        </div>
      </div>
    )
  }
}