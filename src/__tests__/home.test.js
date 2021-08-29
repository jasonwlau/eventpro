import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import firebase from "firebase";
import "@testing-library/jest-dom/extend-expect";
import { Outer, Links } from "../components/headers/Outer"

afterEach(() => {
  cleanup();
})

test('Setup', () => {
  const config = {
    apiKey: "AIzaSyAip5qxPcgUN-U105qoszmQNyw0J5DYs6g",
    authDomain: "proevento-69c0b.firebaseapp.com",
    projectId: "proevento-69c0b",
    storageBucket: "proevento-69c0b.appspot.com",
    messagingSenderId: "681502722062",
    appId: "1:681502722062:web:1a7e45f8c43cd9efd2145f",
    measurementId: "G-DRXMTZZBW3",
};
  firebase.initializeApp(config);
  const user = firebase.auth();
  expect(user.currentUser).toBe(null);
})

test('Notification Requests', async()=> {
  const notiObject = {
    msg: "test"
  };
  const res = await fetch('https://api.ravenhub.io/company/szJmGZMXtU/subscribers/foo1/events/Y0cBxL0ADz', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(notiObject)
  })
  expect(res.status).toBe(200);
})

test ('Render', () => {
  const u = {uid: "asdf"}
  render(<Outer id="test" user={u}/>)
  const outerElement = screen.getByTestId("test");
  expect(outerElement).toHaveProperty('id', "asdf")
})

test ('Link Outer', () => {
  render(<Links id="test"/>);
  const linkElement = screen.getByTestId("test");
  expect(linkElement).toHaveTextContent("Search Events");
  expect(linkElement).toHaveTextContent("Search Users");
  expect(linkElement).toHaveTextContent("Profile");
  expect(linkElement).toHaveTextContent("Feed");
  expect(linkElement).toHaveTextContent("Chat");
  expect(linkElement).toHaveTextContent("Create");
  expect(linkElement).toHaveTextContent("LogOut");
})

test ('Link Contents', () => {
  render(<Links/>);
  expect(screen.getByText("Search Events").closest("a")).toHaveProperty("href", 'http://localhost/components/innerPages/BlogIndexPage');
  expect(screen.getByText("Search Users").closest("a")).toHaveProperty("href", 'http://localhost/components/innerPages/SearchUsers');
  expect(screen.getByText("Profile").closest("a")).toHaveProperty("href", 'http://localhost/Profile/profile');
  expect(screen.getByText("Feed").closest("a")).toHaveProperty("href", 'http://localhost/Profile/feed');
  expect(screen.getByText("Chat").closest("a")).toHaveProperty("href", 'http://localhost/main');
  expect(screen.getByText("Create").closest("a")).toHaveProperty("href", 'http://localhost/components/innerPages/SignupPage');
})
