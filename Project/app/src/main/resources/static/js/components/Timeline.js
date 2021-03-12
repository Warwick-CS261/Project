import React from 'react';
import Chart from 'chart.js';
import moment from 'moment';


export default class Timeline extends React.Component {
  constructor(props) {
    super(props);
    this.timeLineRef = React.createRef();
  }

  componentDidMount(){
    const timeRef = this.timeLineRef.current.getContext('2d');

    let data = JSON.stringify(this.props.data);
    var dataObj = JSON.parse(data, function(key, value) {
      if (key == "date") {
        return new Date(value);
      } else {
        return value;
      }
    });

    var dates = [];
    var moods = [];
  
    dataObj.forEach(dataSlice => {
      dates.push(dataSlice.date);
      moods.push(dataSlice.mood);
    });
  
    // Compute data
  
    var dataPoint1 = dataObj[0];
    var dataPoint2 = dataObj[dataObj.length - 1];
  
    var diffTime = Math.abs(dataPoint1.date - dataPoint2.date);
    var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
    var dateFormat;
  
    if (diffDays < 1) {
      // Display Hours
      dateFormat = "HH:mm";
    } else if (diffDays < 7) {
      // Display Days + Hours
      dateFormat = "HH:mm ddd";
    } else {
      dateFormat = "DD MMM";
    }
  
    // Compute data points
  
    var maxDataPoints = 20;
  
    if (dataObj.length < maxDataPoints) {
      maxDataPoints = dataObj.length;
    }
  
    var timeStep = diffTime / ((maxDataPoints - 1) * 60000);
  
    var nextData = dataPoint1.date;
  
    var dataToAddIndex = 1;
    var currentData;
  
    var dataAverage;
  
    var xAxis = [new moment(dataPoint1.date.getTime()).format(dateFormat)];
    var dataToPlot = [dataPoint1.mood];
  
    for (let i = 0; i < maxDataPoints - 1; i++) {
      nextData.setMinutes( nextData.getMinutes() + timeStep );
  
      let currentData = [];
  
      while (dates[dataToAddIndex] <= nextData) {
        currentData.push(moods[dataToAddIndex]);
        dataToAddIndex += 1;
      }
  
      if (currentData.length != 0) {
        dataAverage = 0;
        currentData.forEach(num => {
          dataAverage += num;
        });
        dataAverage /= currentData.length;
      }
  
      xAxis.push(new moment(nextData.getTime()).format(dateFormat));
      dataToPlot.push(dataAverage);
  
    }

    new Chart(timeRef, {
      // The type of chart we want to create
      type: 'line',
  
      // The data for our dataset
      data: {
        labels: xAxis,
        datasets: [{
          fill: false,
          borderColor: '#43e2b2',
          data: dataToPlot
        }]
      },
  
      // Configuration options go here
      options: {
        title: {
          display: true,
          text: 'Mood over Time'
        },
        legend: {
          display: false,
        },
        scales: {
          yAxes: [{
              display: true,
              ticks: {
                  min: -1,
                  max: 1
              }
          }]
      }
      }
    });
  }

  render(){
    return(
      <div className="bg-dark">
        <canvas ref={this.timeLineRef} />
      </div>
    )
  }
}