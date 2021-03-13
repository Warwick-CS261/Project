import React from 'react';
import Chart from 'chart.js';

export default class BarChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasLoaded: false };
    this.barChartRef = React.createRef();

    this.handleUpdate = this.handleUpdate.bind(this);
  }

  handleUpdate(){
    const chartRef = this.barChartRef.current.getContext('2d');

    let dataObj = JSON.parse(JSON.stringify(this.props.data));
    dataObj.splice(0,1);
  
    let moods = [];
    let dataToPlot = [];
    if (dataObj.length != 0){
      for (let i = 0; i < 21; i++) {
        moods.push(0);
      }
    
      dataObj.forEach(dataSlice => {
        let val = Math.round(dataSlice.mood * 10) / 10;
        moods[(val + 1) * 10] += 1;
      });
    
      for (let i = 0; i < moods.length; i++) {
        moods[i] = (moods[i] / dataObj.length) * 100;
      }
    
      let total = 0;
      for (let i = 0; i < moods.length; i++) {
        total += moods[i];
      }
      
      dataToPlot = moods;
    }
    
    let xAxis = ['-1', '-0.9', '-0.8', '-0.7', '-0.6', '-0.5', '-0.4', '-0.3', '-0.2', '-0.1', '0', '0.1', '0.2', '0.3', '0.4', '0.5', '0.6', '0.7', '0.8', '0.9', '1']
  
    new Chart(chartRef, {
      // The type of chart we want to create
      type: 'bar',
  
      // The data for our dataset
      data: {
        labels: xAxis,
        datasets: [{
          borderColor: '#43e2b2',
          data: dataToPlot,
          backgroundColor: ['#e05841', '#E06641', '#E07341', '#E08141', '#E08E41', '#E09C41', '#E0AA41', '#E0B741', '#E0C541', '#E0D241', '#E0E041', '#D0E042', '#C0E042', '#B0E043', '#A0E043', '#91E144', '#81E145', '#71E145', '#61E146', '#51E146', '#41E147']
        }]
      },
  
      // Configuration options go here
      options: {
        tooltips: false,
        title: {
          display: true,
          text: 'Mood over Responses'
        },
        legend: {
          display: false,
        },
        scales: {
          yAxes: [{
              display: true,
              ticks: {
                  min: 0,
                  stepSize: 5
              }
          }],
          xAxes: [{
              display: false,
          }]
      }
      }
    });
  }

  componentDidMount(){
    if (!this.state.hasLoaded){
      this.setState({
        hasLoaded: false,
      });
    }
    this.handleUpdate();
  }
  
  componentDidUpdate(prevProps,prevState){
    if (this.props.data != prevProps.data){
      this.handleUpdate();
    }
  }

  render(){
    return(
      <div className="bg-light chart">
        <canvas ref={this.barChartRef} />
      </div>
    );
  } 
}