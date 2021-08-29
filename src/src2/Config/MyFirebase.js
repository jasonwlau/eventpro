import firebase from 'firebase'

var config = {
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
    firebase.firestore().settings({
        timestampsInSnapshots: true
    })
}


export const myFirebase = firebase
export const myFirestore = firebase.firestore()
export const myStorage = firebase.storage()
