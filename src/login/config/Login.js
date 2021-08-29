import React, { Component } from "react";
import "./Login.css";
import firebase from "./fire"
import firebasefunctions from "firebasefunctions";
import "./Login.css";
import "firebase";
import "firebase/auth";
import { useHistory } from 'react-router-dom';

var firebaseRef = firebase.database().ref();

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      user:{}
    };
  }
  login = (e) => {
    //e.preventDefault();
    //let history = useHistory();
    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then((u) => {
        console.log(u);
        //history.push("/components/innerPages/BlogIndexPage");
      })
      .catch((err) => {
        console.log(err);
      });
  }
  signup = (e) => {
    e.preventDefault();
    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then((response) => {
        /*firebasefunctions.createUser(
          "Jeff",
          this.state.email,
          "hello world",
          firebaseRef
        );*/
        const {user} =  response;
        this.setState({user});
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }
  render() {
    const { user } = this.state;
    return (
      <div className= "logincontainer" data-testid="login-container">
        <form>
          <input
            className="emailinput"
            type="email"
            id="email"
            data-testid="email"
            name="email"
            placeholder="enter email address"
            onChange={this.handleChange}
            value={this.state.email}
          />
          <input
            className="pwinput"
            name="password"
            type="password"
            data-testid="password"
            onChange={this.handleChange}
            id="password"
            placeholder="enter password"
            value={this.state.password}
          />
          <div className="buttongroup">
            <button className="loginbutton" data-testid = "login-button" onClick={this.login}>
              Login
            </button>
            <button className="signupbutton" data-testid="signup-button" onClick={this.signup}>
              Signup
            </button>
          </div>
        </form>
        {user && user.email && <div>
        <h2>User EmailID: { user.email} </h2></div> }
      </div>
    );
  }
}
export default Login;
