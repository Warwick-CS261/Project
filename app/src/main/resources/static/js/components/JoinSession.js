import React from 'react';

export default class JoinSession extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: "",
      password: "",
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  handleChange(event){
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  handleSubmit(event){
    event.preventDefault();
  }

  render() {
    return(
      <div>
        <h2>Join Session</h2>
        <form onSubmit={this.handleSubmit}>
          <div className="mb-3">
            <input 
              type="text"
              name="code"
              className="form-control"
              value={this.state.code}
              onChange={this.handleChange}
              autoFocus
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              name="password"
              className="form-control"
              value={this.state.password}
              onChange={this.handleChange}
            />
          </div>
          <div className="mb-3">
            <button 
              type="submit"
              className="btn btn-primary"
            >
              Join Session
            </button>
          </div>
        </form>
      </div>
    )
  }
}