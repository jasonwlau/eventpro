import firebase from 'firebase/app';
import firestore from 'firebase/firestore'
require('firebase/auth');
require('firebase/database');

const settings = {timestampsInSnapshots: true};

const config = {
    apiKey: "AIzaSyAip5qxPcgUN-U105qoszmQNyw0J5DYs6g",
    authDomain: "proevento-69c0b.firebaseapp.com",
    projectId: "proevento-69c0b",
    storageBucket: "proevento-69c0b.appspot.com",
    messagingSenderId: "681502722062",
    appId: "1:681502722062:web:1a7e45f8c43cd9efd2145f",
    measurementId: "G-DRXMTZZBW3"
};

if (!firebase.apps.length) {
    firebase.initializeApp(config);
    firebase.firestore().settings(settings);
}

export default firebase;