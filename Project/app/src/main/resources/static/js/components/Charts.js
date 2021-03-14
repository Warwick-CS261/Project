import React from 'react';

import BarChart from './BarChart';
import Timeline from './Timeline';

export default class Charts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showLineChart: true,
    }

    this.toggleLineChart = this.toggleLineChart.bind(this);
    this.toggleBarChart = this.toggleBarChart.bind(this);
  }

  toggleLineChart(){
    if (!this.state.showLineChart){
      this.setState({
        showLineChart: true,
      });
    }
  }
 
  toggleBarChart(){
    if (this.state.showLineChart){
      this.setState({
        showLineChart: false,
      });
    }
  }

  render(){
    if (this.state.showLineChart) {
      return(
        <div>
          <button
            type="button"
            onClick={this.toggleLineChart}
            className="btn btn-dark btn-chart-line"
          ><i className="bi bi-graph-up"></i> Line chart</button>
          <button
            type="button"
            onClick={this.toggleBarChart}
            className="btn btn-light btn-chart-bar"
          ><i className="bi bi-bar-chart-fill"></i> Bar chart</button>
          <Timeline data={this.props.moodHistory} />
        </div>
      )
    }

    return(
      <div>
        <button
            type="button"
            onClick={this.toggleLineChart}
            className="btn btn-dark btn-chart-line"
          ><i className="bi bi-graph-up"></i> Line chart</button>
          <button
            type="button"
            onClick={this.toggleBarChart}
            className="btn btn-light btn-chart-bar"
          ><i className="bi bi-bar-chart-fill"></i> Bar chart</button>
        <BarChart data={this.props.moodHistory} />
      </div>
    );
  }
}