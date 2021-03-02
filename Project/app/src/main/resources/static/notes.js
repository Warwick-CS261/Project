

// for setting the url of the page
history.pushState(data, title, route);

// support for using the back button
window.popstate = function(event) {
  let var = event.state // get the stuff
}

// react 
// TODO make sure to use text/babel in type of script
class App extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      name: "Joe",
      email: "Joe@email.com"
    };
  }

  render (){
    return (
        <div>
        <h1>{this.state.name}</h1>
        <AnotherComponent myprop="something" />
        <button onClick={this.foo}>Click here</button>
        </div>
    );
  }

  foo = () => {
    this.setState(state => ({
      name: "not Joe"
    }));
  }
}

class AnotherComponent extends React.Component {
  render (){
    return (
      <h1>This prop is {this.props.myprop}</h1>
    );
  }
}

class MoodCircle extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      mood: 0.5,
      happy: 0,
      sad: 0,
      neutral: 0
    }
  }
  
  render (){
    return (
      <div className="container">
        <div className="circle"></div>
        <div className="happy"></div>
        <label>{this.props.happy}</label>
        <div className="neutral"></div>
        <label>{this.props.neutral}</label>
        <div className="sad"></div>
        <label>{this.props.sad}</label>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.querySelector('#app'));

