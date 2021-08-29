import React from 'react';
import "firebase";
import Login from '../login/config/Login';
import {render, fireEvent, getByText, getByDisplayValue, getAllByDisplayValue} from '@testing-library/react';
import TestRenderer from 'react-test-renderer';
import { shallow, mount } from "enzyme";

describe("login testcase", () => {

    it("Check if all the values have been parsed appropriately", () => {
    const logintest = TestRenderer.create(<Login></Login>);
    let v = logintest.toJSON();
    });
    
    it("login component render check", () => {
        const {getByTestId} = render(<Login />); 
        expect(getByTestId("login-container")).toBeTruthy();
    });

    it("Email input field render check", () => {
        const {getByTestId} = render(<Login />); 
        expect(getByTestId("email")).toBeTruthy();
    });

    it("Password input field", () => {
        const {getByTestId} = render(<Login />); 
        expect(getByTestId("password")).toBeTruthy();
    });


    it("should render Login button", () => {
        const {getByTestId} = render(<Login />); 
        expect(getByTestId("login-button")).toBeTruthy();
    });

    it("should render Signup button", () => {
        const {getByTestId} = render(<Login />); 
        expect(getByTestId("signup-button")).toBeTruthy();
    });




/*
    it("should call login onclick login button", () => {
        const login= jest.fn();
        const {getByTestId} = render(<Login />); //{} = render returns an object.
        login.click(getByTestId('login-button'));
        expect(login).toHaveBeenCalled();
    });*/
    
    // Login folder -> Login.jsx, Login.test.js, index.js

    // index.js
    // import Login from './Login
    /*it("a", () => {
    const logintest = TestRenderer.create(<Login></Login>);

    jest.mock('./firebase', () => {
        var b = jest.fn();
        return {
            1
        }

    });
    let v = logintest.toJSON();
    expect(v).toHaveBeenCalledTimes(1);
    });*/
  });

  /*test("Click", () => {
    const {container} = render(<Login />);
    const button = getAllByDisplayValue('Login');
    fireEvent.click(button);
});*/
