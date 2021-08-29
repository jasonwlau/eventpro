import React, { useState } from "react";
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import tw from "twin.macro";
import styled from "styled-components"; //eslint-disable-line
import { css } from "styled-components/macro"; //eslint-disable-line
import Header from "components/headers/light.js";
import Footer from "components/footers/FiveColumnWithInputForm.js";
import MainFeature1 from "components/features/TwoColWithButton.js";
// import MainFeature2 from "components/features/TwoColSingleFeatureWithStats.js";
// import MainFeature3 from "components/features/TwoColSingleFeatureWithStats2.js";
import Features from "components/features/ThreeColSimple.js";
// import Features from "components/features/ThreeColWithSideImage.js";
import TeamCardGrid from "components/cards/ProfileThreeColGrid.js";
import badges from "components/cards/badges.js"
import SupportIconImage from "images/support-icon.svg";
import ShieldIconImage from "images/shield-icon.svg";
import CustomerLoveIconImage from "images/simple-icon.svg";
import firebase from "firebase";
import {getFriends, getUser, getUserById} from "backend/util.js"
import { create } from "react-test-renderer";

const Subheading = tw.span`uppercase tracking-wider text-sm`;
export const NavLink = tw.a`
  text-lg my-2 lg:text-sm lg:mx-6 lg:my-0
  font-semibold tracking-wide transition duration-300
  pb-1 border-b-2 border-transparent hover:border-primary-500 hocus:text-primary-500
`;

const PrimaryButton = tw.button`px-8 py-3 font-bold rounded bg-primary-500 text-gray-100 hocus:bg-primary-700 hocus:text-gray-200 focus:shadow-outline focus:outline-none transition duration-300`;

export default (profile) => {
      let err=[<MainFeature1
          heading="No Events Found"
          imageSrc="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=768&q=80"
        />,
      ];
      let id=profile;
      let otherID=0
      let uid=0
      let friends;
      let button;
      if (profile == "profile") {
        button = <NavLink className="Profile" href="/notifications">Notifications</NavLink>
      } else {
      }
      async function createNotification() {
        let value = await firebase.firestore().collection("users").doc(uid).get();
        let name = value.data().name;
        var notiObject = {
          msg: 'New Follower Request from ' + name,
          url: 'http://localhost:3000/request/' + uid + '/' + profile,
        };
        return notiObject;
      }

      async function friend(){
        const friends = await getFriends();
        if(friends.includes(otherID))
        {
          alert("already friends");
          return;
        }

        const notiObject = await createNotification();
        let l =
          "https://api.ravenhub.io/company/7RSvlrMSZE/subscribers/" +
          profile +
          "/events/QqPrWQdgBS";
          alert(l)
        fetch(l, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(notiObject),
        }).then((response) =>{
          alert("sent")
           console.log(response)})
      }
    
  const [features, setFeatures] = useState([]);
  const [profileIMG, setIMG] = useState([]);
  const [profileName, setName] = useState([]);
  const [isProfile, setBool] = useState(false);
  const [display, setDisplay] = useState("All");
  const [numFriends, setNumFriends]=useState(0)
  const [categories,setCategories]=useState()
  const [isFriend, setIsFriend] = useState(false);
  var loaded = false;

  const changeImage = () => {
    var img = prompt("Put image URL");
    firebase.firestore().collection("users").doc(uid).update({
      photoURL: img,
    });
    setIMG(img);
  };

  const Deactivate = async (history) => {
    window.location.href = "/components/innerPages/deactivate";
  };

  const Unfollow = () => {
    firebase.firestore().collection("users").doc(profile).update({
      friends: firebase.firestore.FieldValue.arrayRemove(uid)
    });
    setIsFriend(false);
  }

  firebase.auth().onAuthStateChanged(async (user) => {
    if (user && loaded === false) {
      loaded = true;
      var dat = [];
      var user;
      var proms;
      var text = "Join Meeting";
      uid = user.uid;

      var use=await getUserById(user.uid)
      var v = await getUserById(id);
      setNumFriends(use.friends.length);
      if (v && v.friends.includes(user.uid)) {
        setIsFriend(true);
      }
      setNumFriends(use.friends.length)

      if (id === "profile" || id == uid) {
        setBool(true);
        setDisplay("All");
        text = "Start Meeting";
        id = user.uid;
        proms = firebase
          .firestore()
          .collection("Events")
          .where("uid", "==", id)
          .get();

        firebase
          .firestore()
          .collection("users")
          .doc(uid)
          .get()
          .then((doc) => {
            setIMG(doc.data().photoURL);
            setName(doc.data().name);
          });
      } else if (id === "feed") {
        proms = firebase
          .firestore()
          .collection("users")
          .doc(uid)
          .get()
          .then((doc) => {
            if (doc.data().friends.length >= 1)
              return firebase
                .firestore()
                .collection("Events")
                .where("uid", "in", doc.data().friends)
                .get();
            else return Promise.reject("err");
          });
      } else {
        firebase
          .firestore()
          .collection("users")
          .doc(id)
          .get()
          .then((doc) => {
            otherID = doc.data().uid;
            var name;
            if (doc.data().name !== null) name = doc.data().name;
            else if (doc.data().nickname != null) name = doc.data().nickname;
            else name = "Person";
            dat.push(
              <MainFeature1
                heading={name}
                imageSrc={
                  doc.data().photoURL == null
                    ? ShieldIconImage
                    : doc.data().photoURL
                }
                buttonRounded={true}
                primaryButtonText={"Send Follower Request"}
                primaryButtonUrl={"#"}
                onClick={friend}
              />
            );
          });
        proms = firebase
          .firestore()
          .collection("Events")
          .where("uid", "==", id)
          .get();
      }

      proms
        .then((querySnapshot) => {
          if (!querySnapshot.docs.length) return Promise.reject("err");
          let i = 0;
          querySnapshot.docs.forEach((doc) => {
            if (display === "All" || doc.data().category === display) {
              dat.push(
                <MainFeature1
                  key={i++}
                  subheading={<Subheading>{doc.data().category}</Subheading>}
                  heading={doc.data().title}
                  buttonRounded={false}
                  primaryButtonText={text}
                  primaryButtonUrl={
                    "../Meeting/landing/" + doc.data().MeetingNumber
                  }
                  imageSrc={doc.data().imgSrc}
                  textOnLeft={false}
                />
              );
            }
          });
          if (dat.length == 0) {
            dat.push(err[0]);
            setFeatures(dat);
          } else {
            setFeatures(dat);
          }
        })
        .catch((errno) => {
          dat.push(err[0]);
          setFeatures(dat);
        });
    } else if (loaded == false) {
      window.location.href =
        "http://localhost:3000/components/innerPages/LoginPage";
    }
  });

  return (
    <AnimationRevealPage>
      {button}
      <Header />
      <div
        style={{
          width: 50,
          height: 50,
        }}
      >
        {isProfile === true && (
          <img
            style={{
              width: 50,
              height: 50,
              marginLeft: 670,
            }}
            src={profileIMG}
            alt="Profile Image"
          />
        )}
      </div>
      {isProfile === false && (
        <div>
          <select value={display} onChange={(e) => setDisplay(e.target.value)}>
            <option value="All">All</option>
            <option value="Sports">Sports</option>
            <option value="Gaming">Gaming</option>
            <option value="Music">Music</option>
            <option value="Education">Education</option>
            <option value="Food">Food</option>
          </select>
        </div>
      )}
      {isProfile === true && <h2>{profileName}</h2>}
      {isProfile=== true && <h2>{"Followers: "+numFriends.toString()}</h2>}
      {isProfile === true && (
        <div>
          <button onClick={changeImage}>Change Image</button>
          <button onClick={Deactivate}>Deactivate</button>
        </div>
        
      )}
      {badges(isProfile)}
      {isFriend && <PrimaryButton onClick={Unfollow}>Unfollow</PrimaryButton>}
      {features}
      <Footer />
    </AnimationRevealPage>
  );
};
