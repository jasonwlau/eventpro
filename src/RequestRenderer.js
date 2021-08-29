import React from "react";
import { useParams } from 'react-router-dom';
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import Header from "components/headers/light.js";
import tw from "twin.macro";
import firebase from "firebase";

const PrimaryButton = tw.button`px-8 py-3 font-bold rounded bg-primary-500 text-gray-100 hocus:bg-primary-700 hocus:text-gray-200 focus:shadow-outline focus:outline-none transition duration-300`;

function ReactRenderer() {
    const {sender, receiver} = useParams()

    async function mirror(e)
    {
      //e.preventDefault();
      const doc = await firebase.firestore().collection("users").doc(sender).get()
      const friends = doc.data().friends;
      console.log(friends);
      if (!friends.includes(receiver)) {
        firebase.firestore().collection("users").doc(sender).get()
        .then((doc)=>{
          var friends=doc.data().friends;
          friends.push(receiver);
          firebase.firestore().collection("users").doc(sender).set({friends:friends},{ merge: true })
          .then(() => {
            window.location.href="../../main"
          })
        })
      }
      else window.location.href="../../main"
    }

    async function accept(e) {
      e.preventDefault();
      const doc = await firebase.firestore().collection("users").doc(receiver).get()
      const friends = doc.data().friends;
      console.log(friends);
      if (!friends.includes(sender)) {
        firebase.firestore().collection("users").doc(receiver).get()
        .then((doc)=>{
          var friends=doc.data().friends;
          friends.push(sender);
          firebase.firestore().collection("users").doc(receiver).set({friends:friends},{ merge: true })
          .then(() => {
            mirror(e)
          })
        })
      }
      else mirror(e)
    }

    function deny(e) {
      e.preventDefault();
      window.location.href="../../main"
    }

    return (
      <AnimationRevealPage>
        <Header />
        <PrimaryButton onClick={accept}>
          Accept
        </PrimaryButton>
        <br/>
        <PrimaryButton onClick={deny}>
          Deny
        </PrimaryButton>
      </AnimationRevealPage>
    );
}

export default ReactRenderer;
