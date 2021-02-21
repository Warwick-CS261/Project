/**
 * Login component
 */
export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      stay: false,
      error: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInvalid = this.handleInvalid.bind(this);
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

  handleInvalid(event){
    event.target.classList.add('invalid');
  }

  handleSubmit(event){
    $.ajax({
      url: '/auth/login',
      type: 'POST',
      data: JSON.stringify(this.state),
      success: (res) => {
        // handle success
        console.log('Token');
        console.log(Cookies.get('token'));
      },
      error: (res) => {
        // handle error
      }
    });
    event.preventDefault();
  }
  

  render(){
    return(
      <div>
        <h1>Login</h1>
        {this.state.error !== false && 
          <div class="alert alert-danger" role="alert">
            {this.state.error}
          </div>
        }
        <form method="POST" onSubmit={this.handleSubmit} >
          <div className="mb-3">
            <input 
              type="email" 
              name="email" 
              value={this.state.email}
              onChange={this.handleChange}
              onInvalid={this.handleInvalid}
              className="form-control"
              autoFocus
              autoComplete
              required
            />
          </div>
          <div className="mb-3">
            <input 
              type="password" 
              name="password" 
              value={this.state.password}
              onChange={this.handleChange}
              onInvalid={this.handleInvalid}
              className="form-control"
              autoComplete
              required
            />
          </div>
          <div className="mb-3">
            <input 
              type="checkbox" 
              name="stay"
              onChange={this.handleCheck}
              className="form-check-input"
              required
            />
          </div>
          <div className="mb-3">
            <button 
              type="submit" 
              className="btn btn-primary"
            >
              Log in
            </button>
          </div>
        </form>
      </div>
    );
  }
}