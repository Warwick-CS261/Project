import React from 'react';

/**
 * Mood orb, or mood circle
 */
export default class Indicator extends React.Component {
  constructor(props) {
    super(props);
    if (this.props.mood !== undefined && this.props.mood !== null){
      this.state = { mood: this.props.mood }
    } else {
      this.state = { mood: 0 }
    }
  }
  
  /**
   * If the props does not match the states update the state.
   * @param {Object} prevProps Previous props
   * @param {Object} prevState Previous props
   */
  componentDidUpdate(prevProps, prevState){
    if (prevState.mood != this.props.mood){
      this.setState({
        mood: this.props.mood,
      });
    }
  }

  render(){
    // color array of the orb
    let colors = ['#e05841', '#E06641', '#E07341', '#E08141', '#E08E41', '#E09C41', '#E0AA41', '#E0B741', '#E0C541', '#E0D241', '#E0E041', '#D0E042', '#C0E042', '#B0E043', '#A0E043', '#91E144', '#81E145', '#71E145', '#61E146', '#51E146', '#41E147']

    let mood = this.state.mood;
    mood = Math.round((mood + 1)*10);

    let color = colors[mood]


    return(
      <div className=" d-flex flex-column p-2 w-100">
        <h3 className="text-center">Overall mood</h3>
        <div className="circle align-self-center align-items-center" style={{backgroundColor: color}}></div>
      </div>
    )
  }
}