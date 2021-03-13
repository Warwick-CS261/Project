import React from 'react';

import BarChart from './BarChart';
import Timeline from './Timeline';

export default class Charts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showLineChart: true,
    }

    this.toggleChart = this.toggleChart.bind(this);
  }

  toggleChart(){
    this.setState(prev => {
      return {
        showLineChart: !prev.showLineChart,
      }
    });
  }
 
  render(){
    if (this.state.showLineChart) {
      return(
        <div className="text-center">
          <button
            type="button"
            onClick={this.toggleChart}
            className="btn btn-light mb-2"
          >Show bar chart</button>
          <Timeline data={this.props.moodHistory} />
        </div>
      )
    }

    return(
      <div className="text-center">
        <button
            type="button"
            onClick={this.toggleChart}
            className="btn btn-dark mb-2"
          >Show line chart</button>
        <BarChart data={this.props.moodHistory} />
      </div>
    );
  }
}