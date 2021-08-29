import React from "react";
import { useParams } from 'react-router-dom';
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import Header from "components/headers/light.js";
import tw from "twin.macro";
import firebase from "firebase";
import {getGroup} from "backend/util.js"

const PrimaryButton = tw.button`px-8 py-3 font-bold rounded bg-primary-500 text-gray-100 hocus:bg-primary-700 hocus:text-gray-200 focus:shadow-outline focus:outline-none transition duration-300`;

function ReactRenderer() {
    const {sender, chatId} = useParams()

    async function accept(e) {
        alert("here")
      e.preventDefault();
      const group=await getGroup(chatId)
      const users = group.data().users;

      if (!users.includes(sender)) {
        users.push(sender)
        await group.ref.set({users:users},{merge:true})
        alert("added")
        window.location.href="../../main"
      }
      else window.location.href="../../main"
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
