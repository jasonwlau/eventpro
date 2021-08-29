import React, { Component } from "react";
import firebase from "../../backend/config";
require("firebase/auth");
require("firebase/database");

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  logout() {
    firebase.auth().signOut();
  }
  render() {
    return (
      <div>
        <h1>You are logged in !!!</h1>
        <button onClick={this.logout}>Logout</button>
      </div>
    );
  }
}
export default Home;
