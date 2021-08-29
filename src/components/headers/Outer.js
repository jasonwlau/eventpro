import React, { useState } from 'react';
import firebase from "firebase";
import tw from "twin.macro";

export const NavLinks = tw.div`inline-block`;
export const NavLink = tw.a`
  text-lg my-2 lg:text-sm lg:mx-6 lg:my-0
  font-semibold tracking-wide transition duration-300
  pb-1 border-b-2 border-transparent hover:border-primary-500 hocus:text-primary-500
`;
export const DesktopNavLinks = tw.nav`
  hidden lg:flex flex-1 justify-between items-center
`;

function Outer(props) {
  const [change, setchange] = useState(0)

  
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      setchange(1)
      return (<div></div>);
    }
  });

  if (change == 0) {
    return (<div data-testid={props.id} id={props.user.uid}></div>);
  }
  var user = firebase.auth().currentUser; 
  return (<div id={user.uid}>{props.comp}</div>);
}

function Links(props) {
  const logOut=()=>{
    firebase.auth().signOut().then(function() {
      window.location.href="components/innerPages/loginPage"
    }, function(error) {
      console.error('Sign Out Error', error);
    });
  } 
  
  const defaultLinks = [
    <NavLinks key={1}>
      <NavLink href="/components/innerPages/BlogIndexPage">Search Events</NavLink>
      <NavLink href="/components/innerPages/SearchUsers">Search Users</NavLink>
      <NavLink href="/Profile/profile">Profile</NavLink>
      <NavLink href="/Profile/feed">Feed</NavLink>
      <NavLink href="/main">Chat</NavLink>
      <NavLink href="/components/innerPages/SignupPage">Create</NavLink>
      <NavLink onClick={logOut}>LogOut</NavLink>
    </NavLinks>,
  ];
  return(<DesktopNavLinks data-testid={props.id}>
    {defaultLinks}
  </DesktopNavLinks>)
}



export {Outer, Links}