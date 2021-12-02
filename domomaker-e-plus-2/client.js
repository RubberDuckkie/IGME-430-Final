// I. React Components
const LoginPageNav = props => {
  return (
    <nav>
      <a href="/login"><img id="logo" src="/assets/img/favicon.png" alt="primogem logo"/></a>
      <div className="navlink"><a id="loginButton" onClick={()=>createLoginWindow(props.csrf)}>Login</a></div>
      <div className="navlink"><a id="signupButton" onClick={()=>createSignupWindow(props.csrf)}>Sign up</a></div>
    </nav>
  );
};

class SignupWindow extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      csrf: props.csrf,
      username: "",
      pass: "",
      pass2: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSignup = this.handleSignup.bind(this);
  }

  handleChange(e){
    this.setState({[e.target.name]: e.target.value});
  }

  checkFields(){
    return !(this.state.username == '' || this.state.pass == '' || this.state.pass2 == '');
   }

  checkPasswords(){
    return this.state.pass == this.state.pass2;
  }

  createQuery(){
    const sanitize = str => encodeURIComponent(str.toString().trim());
    return `username=${sanitize(this.state.username)}&pass=${sanitize(this.state.pass)}&pass2=${sanitize(this.state.pass2)}&_csrf=${this.state.csrf}`;
  }

  handleSignup(e){
    e.preventDefault();
   
    
    if(!this.checkFields()){
      handleError("All fields are required.");
      return false;
    }

    if(!this.checkPasswords()){
      handleError("Passwords do not match.");
      return false;
    }
    
    const method = "POST";
    const path = document.querySelector("#signupForm").getAttribute("action");
    const query = this.createQuery();
    const completionCallback = redirect;
    sendAjax(method,path,query,completionCallback);
  
    return false;
  }

  render(){
    return (
      <form id="signupForm"
        name="signupForm"
        onSubmit={this.handleSignup}
        action="/signup"
        method="POST"
        className="mainForm"
      >
        <label htmlFor="username">Username: </label>
        <input id="user" type="text" name="username" placeholder="username" value={this.state.username} onChange={this.handleChange}/>
        <label htmlFor="pass">Password: </label>
        <input id="pass" type="password" name="pass" placeholder="password" value={this.state.pass} onChange={this.handleChange}/>
        <label htmlFor="pass2">Password: </label>
        <input id="pass2" type="password" name="pass2" placeholder="retype password" value={this.state.pass2} onChange={this.handleChange}/>
        <input type="hidden" name="_csrf" value={this.state.csrf} />
        <input className="formSubmit" type="submit" value="Sign up" />
      </form>
    );
  }
} 

class LoginWindow extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      csrf: props.csrf,
      username: "",
      pass: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }

  handleChange(e){
    this.setState({[e.target.name]: e.target.value});
  }

  checkFields(){
    return !(this.state.username == '' || this.state.pass == '');
  }

  createQuery(){
    const sanitize = str => encodeURIComponent(str.toString().trim());
    return `username=${sanitize(this.state.username)}&pass=${sanitize(this.state.pass)}&_csrf=${this.state.csrf}`;
  }

  handleLogin(e){
    e.preventDefault();
    $("#domoMessage").animate({width:'hide'},350);
  
    if(!this.checkFields()){
      handleError("RAWR! Username or Password is empty!");
      return false;
    }

    const method = "POST";
    const path = document.querySelector("#loginForm").getAttribute("action");
    const query = this.createQuery();
    const completionCallback = redirect;
    sendAjax(method,path,query,completionCallback);
  
    return false;
  };

  render() {
    return (
      <form id="loginForm" name="loginForm"
        onSubmit={this.handleLogin}
        action="/login"
        method="POST"
        className="mainForm"
      >
        <label htmlFor="username">Username: </label>
        <input id="user" type="text" name="username" placeholder="username" value={this.state.username} onChange={this.handleChange}/>
        <label htmlFor="pass">Password: </label>
        <input id="pass" type="password" name="pass" placeholder="password" value={this.state.pass} onChange={this.handleChange}/>
        <input type="hidden" name="_csrf" value={this.state.csrf} />
        <input className="formSubmit" type="submit" value="Sign in"/>
      </form>
    );
  }
}

// II. Helper Functions
const createLoginWindow = csrf => {
  ReactDOM.render(
    <LoginPageNav csrf={csrf} />,
    document.querySelector("#nav")
  );
  ReactDOM.render(
    <LoginWindow csrf={csrf} />,
    document.querySelector("#content")
  );
};

const createSignupWindow = csrf => {
  ReactDOM.render(
    <LoginPageNav csrf={csrf} />,
    document.querySelector("#nav")
  );
  ReactDOM.render(
    <SignupWindow csrf={csrf} />,
    document.querySelector("#content")
  );
};

const getToken = () => {
  const completionCallback = result => createLoginWindow(result.csrfToken);
  sendAjax('GET', '/getToken', null, completionCallback);
};

// III. Initialization
window.onload = getToken;