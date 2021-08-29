import firebase from 'firebase';
import "firebase/storage";

const settings = {timestampsInSnapshots: true};

var firebaseConfig = {
  apiKey: "AIzaSyAip5qxPcgUN-U105qoszmQNyw0J5DYs6g",
  authDomain: "proevento-69c0b.firebaseapp.com",
  projectId: "proevento-69c0b",
  storageBucket: "proevento-69c0b.appspot.com",
  messagingSenderId: "681502722062",
  appId: "1:681502722062:web:1a7e45f8c43cd9efd2145f",
  measurementId: "G-DRXMTZZBW3"
  };

   if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
    firebase.firestore().settings(settings);
  }

  export const myFirebase = firebase
  export const myFirestore = firebase.firestore()
  export const myStorage = firebase.storage()
  //is called automatically when there is a change in user state
  firebase.app().auth().onAuthStateChanged((user) => {
    if (user) {
      //var uid = user.uid;
    } else {
      // User is signed out
      //user.logout();
    }
  });

  export default firebase;
