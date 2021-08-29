import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ChatRoot from './Component/Root/Root';
import * as serviceWorker from './serviceWorker';
import Modal from "react-modal";

Modal.setAppElement("#root");

function ChatApp() {

    ReactDOM.render(
    <ChatRoot/>, document.getElementById('root'));

    // If you want your app to work offline and load faster, you can change
    // unregister() to register() below. Note this comes with some pitfalls.
    // Learn more about service workers: http://bit.ly/CRA-PWA
    serviceWorker.unregister();
}

export default ChatApp;
