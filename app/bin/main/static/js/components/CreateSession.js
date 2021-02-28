import React from 'react';

export default class CreateSession extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionName: "",
      private: false,
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  handleChange(event){
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  handleCheck(event){
    this.setState({
      [event.target.name]: event.target.checked,
    })
  }

  handleSubmit(event){
    event.preventDefault();
  }

  render() {
    return(
      <div>
        <h2>Create Session</h2>
        <form onSubmit={this.handleSubmit}>
          <div className="mb-3">
            <input 
              type="text"
              name="sessionName"
              className="form-control"
              value={this.state.sessionName}
              onChange={this.handleChange}
              autoFocus
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="checkbox"
              name="private"
              className="form-check-input"
              value={this.state.private}
              onChange={this.handleCheck}
            />
          </div>
          <div className="mb-3">
            <button 
              type="submit"
              className="btn btn-primary"
            >
              Create Session
            </button>
          </div>
        </form>
      </div>
    )
  }
}