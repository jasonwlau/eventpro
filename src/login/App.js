import React, { Component } from "react";
import "./App.css";
import fire from "../backend/config";
import Login from "./config/Login";
import Home from "./config/Home";
import BlogIndex from "pages/BlogIndex";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
    };
  }

  componentDidMount() {
    this.authListener();
  }
  authListener() {
    fire.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user });
      } else {
        this.setState({ user: null });
      }
    });
  }
  render() {
    return (
      <div className="App">{this.state.user ? <BlogIndex /> : <Login />}</div>
    );
  }
}
export default App;
