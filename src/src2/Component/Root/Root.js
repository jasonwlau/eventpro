import React, {Component} from 'react'
import './Root.css'
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import Login from '../Login/Login'
import Main from '../Main/Main'
import Profile from '../Profile/Profile'
import {toast, ToastContainer} from 'react-toastify'

class ChatRoot extends Component {
    showToast = (type, message) => {
        // 0 = warning, 1 = success
        switch (type) {
            case 0:
                toast.warning(message)
                break
            case 1:
                toast.success(message)
                break
            default:
                break
        }
    }

    render() {
        return (
                <div>
                    <Login showToast={this.showToast} {...this.props} />
                    <ToastContainer
                        autoClose={2000}
                        hideProgressBar={true}
                        position={toast.POSITION.BOTTOM_RIGHT}
                    />
                </div>
        )
    }
}

export default ChatRoot
