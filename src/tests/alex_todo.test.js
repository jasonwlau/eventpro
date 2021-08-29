import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import 'regenerator-runtime/runtime'
import Outer from '../components/headers/light';
import firebase from "firebase";
import "@testing-library/jest-dom/extend-expect";
import Login from "../pages/Login"
import { createRenderer } from 'react-dom/test-utils';
import Main from 'src2/Component/Main/Main';
import ChatBoard from 'src2/Component/ChatBoard/ChatBoard'
import MeetingLanding from 'pages/MeetingLanding'
// test('outer initialization', () => {
//   const config = {
//     apiKey: "AIzaSyAip5qxPcgUN-U105qoszmQNyw0J5DYs6g",
//     authDomain: "proevento-69c0b.firebaseapp.com",
//     projectId: "proevento-69c0b",
//     storageBucket: "proevento-69c0b.appspot.com",
//     messagingSenderId: "681502722062",
//     appId: "1:681502722062:web:1a7e45f8c43cd9efd2145f",
//     measurementId: "G-DRXMTZZBW3"
// };
//   firebase.initializeApp(config);
//   render(<Outer id="test"/>);
//   const outerElement = screen.getByTestId("test");
//   expect(outerElement).toBeInTheDocument();
//   expect(outerElement).toHaveTextContent("none");
// })

// test('post request', async()=> {
//   const notiObject = {
//     msg: "test"
//   };
//   const res = await fetch('https://api.ravenhub.io/company/szJmGZMXtU/subscribers/foo/events/Y0cBxL0ADz', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   })
//   expect(res.status).toBe(200);
// })

test('check for firebase container', () => {
  const config = {
    apiKey: "AIzaSyAip5qxPcgUN-U105qoszmQNyw0J5DYs6g",
    authDomain: "proevento-69c0b.firebaseapp.com",
    projectId: "proevento-69c0b",
    storageBucket: "proevento-69c0b.appspot.com",
    messagingSenderId: "681502722062",
    appId: "1:681502722062:web:1a7e45f8c43cd9efd2145f",
    measurementId: "G-DRXMTZZBW3"
};
  firebase.initializeApp(config);
  render(<Login id="test"/>);
  const outerElement = screen.getByTestId("firebaseui-auth-container");
  expect(outerElement).toBeInTheDocument();
})

test('load main with placeholder id', () => {
    const config = {
      apiKey: "AIzaSyAip5qxPcgUN-U105qoszmQNyw0J5DYs6g",
      authDomain: "proevento-69c0b.firebaseapp.com",
      projectId: "proevento-69c0b",
      storageBucket: "proevento-69c0b.appspot.com",
      messagingSenderId: "681502722062",
      appId: "1:681502722062:web:1a7e45f8c43cd9efd2145f",
      measurementId: "G-DRXMTZZBW3"
  };
    firebase.initializeApp(config);
    render(<Main id="test"/>);
    const result = await myFirestore
                        .collection(this.data.NODE_USERS)
                        .where("uid", '==', "11ZM6xG7RHVMGsbw6N9jneHAjkG2")
                        .get()
  expect(result.docs[0].data().nickname).toHaveTextContent("Jason D'Souza");
  expect(result.docs[0].data().photoUrl).toHaveTextContent("https://lh3.googleusercontent.com/-NH0Ma4oGMJs/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclMJKqbEh5Weh1RpypXW-NbcjdODw/s96-c/photo.jpg");
  expect(result.docs[0].data().aboutMe).toHaveTextContent("");
  })

  test("check if logout from chatpage worked", () => {
    const config = {
        apiKey: "AIzaSyAip5qxPcgUN-U105qoszmQNyw0J5DYs6g",
        authDomain: "proevento-69c0b.firebaseapp.com",
        projectId: "proevento-69c0b",
        storageBucket: "proevento-69c0b.appspot.com",
        messagingSenderId: "681502722062",
        appId: "1:681502722062:web:1a7e45f8c43cd9efd2145f",
        measurementId: "G-DRXMTZZBW3"
    };
      firebase.initializeApp(config);
    const {container} = render(<Main />);

    const button = getByTestId(container, 'btnYes');
    fireEvent.click(button);
    var user = firebase.auth().currentUser;
    expect(user === null).tobeTruthy();
});

test("check if message box is empty after sending one", () => {
    const config = {
        apiKey: "AIzaSyAip5qxPcgUN-U105qoszmQNyw0J5DYs6g",
        authDomain: "proevento-69c0b.firebaseapp.com",
        projectId: "proevento-69c0b",
        storageBucket: "proevento-69c0b.appspot.com",
        messagingSenderId: "681502722062",
        appId: "1:681502722062:web:1a7e45f8c43cd9efd2145f",
        measurementId: "G-DRXMTZZBW3"
    };
      firebase.initializeApp(config);
    render(<Main />);

    const chatboard = getByTestId('viewBoard');
    chatboard.OnSendMessage('placeholder', 0)
    expect(chatboard.state.inputValue).totoHaveTextContent("");
});

test('zoom meeting request check firebase', async()=> {
  const config = {
    apiKey: "AIzaSyAip5qxPcgUN-U105qoszmQNyw0J5DYs6g",
    authDomain: "proevento-69c0b.firebaseapp.com",
    projectId: "proevento-69c0b",
    storageBucket: "proevento-69c0b.appspot.com",
    messagingSenderId: "681502722062",
    appId: "1:681502722062:web:1a7e45f8c43cd9efd2145f",
    measurementId: "G-DRXMTZZBW3"
};
  firebase.initializeApp(config);
render(<MeetingLanding />);
var db=firebase.firestore();
    db.collection("Events").where("MeetingNumber", "==", 12345).limit(1)
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
            expect(doc.data().title).toHaveTextContent("testevent");

        });
    })
})