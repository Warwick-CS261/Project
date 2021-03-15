import React from 'react';

import BarChart from './BarChart';
import Timeline from './Timeline';

/**
 * Router of the charts
 * Displays one of them, provide toggle functionality
 */
export default class Charts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showLineChart: true,
    }

    this.toggleLineChart = this.toggleLineChart.bind(this);
    this.toggleBarChart = this.toggleBarChart.bind(this);
  }

  /**
   * Shos line chart
   */
  toggleLineChart(){
    if (!this.state.showLineChart){
      this.setState({
        showLineChart: true,
      });
    }
  }
  
  /**
   * Toggle bar chart
   */
  toggleBarChart(){
    if (this.state.showLineChart){
      this.setState({
        showLineChart: false,
      });
    }
  }

  render(){
    if (this.state.showLineChart) {
      // render line chart
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
    // render bar chart
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