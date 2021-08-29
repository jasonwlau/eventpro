import firebase from "firebase/app";
import "@firebase/auth";
import "@firebase/firestore";
import "@firebase/database";

const settings = {timestampsInSnapshots: true};

var firebaseConfig = {
  apiKey: "AIzaSyAip5qxPcgUN-U105qoszmQNyw0J5DYs6g",
  authDomain: "proevento-69c0b.firebaseapp.com",
  projectId: "proevento-69c0b",
  storageBucket: "proevento-69c0b.appspot.com",
  messagingSenderId: "681502722062",
  appId: "1:681502722062:web:1a7e45f8c43cd9efd2145f",
  measurementId: "G-DRXMTZZBW3",
  databaseURL: "https://proevento-69c0b-default-rtdb.firebaseio.com",
};


if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  firebase.firestore().settings(settings);
}

// //is called automatically when there is a change in user state
// fire.auth().onAuthStateChanged((user) => {
//   if (user) {
//     //var uid = user.uid;
//   } else {
//     // User is signed out
//     user.logout();
//   }
// });

export default firebase;
