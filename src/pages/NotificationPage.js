import React, { useState } from "react";
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import tw from "twin.macro";
import styled from "styled-components";
import Header from "components/headers/light.js";
import Notification from "components/misc/Notification";
import firebase from "firebase";
import * as firebaseui from "firebaseui";

function Outer(props) {
  const [change, setchange] = useState(0);

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      setchange(1);
      return <Notification id={user.uid} />;
    } else {
      window.location.href =
        "http://localhost:3000/components/innerPages/LoginPage";
    }
  });

  if (change == 0) {
    return <div></div>;
  }
  var user = firebase.auth().currentUser;
  return <Notification id={user.uid} />;
} 

export const NavLink = tw.a`
  text-lg my-1 lg:text-sm lg:mx-6 lg:my-0
  font-semibold tracking-wide transition duration-300
  pb-1 border-b-2 border-transparent hover:border-primary-500 hocus:text-primary-500
`;

export const LogoLink = styled(NavLink)`
  ${tw`flex items-center font-black border-b-0 text-2xl! ml-0!`};

  img {
    ${tw`w-10 mr-3`}
  }
`;

export const DesktopNavLinks = tw.nav`
  hidden lg:flex flex-1 justify-between items-center
`;

export default () => {
  const defaultLogoLink = <LogoLink href="/main">ProEvento</LogoLink>;
  return (
    <AnimationRevealPage>
      <DesktopNavLinks>
        {defaultLogoLink}
      </DesktopNavLinks>
      <div style={{marginRight: "30%", textAlign: "right"}}>
        <Outer/>
      </div>
    </AnimationRevealPage>
  );
};
