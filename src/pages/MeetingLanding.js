import React, { useState } from "react";
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import tw from "twin.macro";
import styled from "styled-components"; //eslint-disable-line
import { css } from "styled-components/macro"; //eslint-disable-line
import Header from "components/headers/light.js";
import Footer from "components/footers/FiveColumnWithInputForm.js";
import MainFeature1 from "components/features/TwoColWithButton.js";
import Features from "components/features/ThreeColSimple.js";
import TeamCardGrid from "components/cards/ProfileThreeColGrid.js";
import addUserToEvent from "components/forms/addUserToEvent.js"
import SupportIconImage from "images/support-icon.svg";
import ShieldIconImage from "images/shield-icon.svg";
import CustomerLoveIconImage from "images/simple-icon.svg";
import firebase from "firebase";
import {getMeetingFromDB, getUser} from "../backend/util"
import addBadge from "components/forms/addBage.js"
var url="";
const PrimaryButton = tw.button`px-8 py-3 font-bold rounded bg-primary-500 text-gray-100 hocus:bg-primary-700 hocus:text-gray-200 focus:shadow-outline focus:outline-none transition duration-300`;
const Subheading = tw.span`uppercase tracking-wider text-sm`;
export default (id) => {
  const [heading, setHeading] = useState("");
  const [descript,setDescript]=useState("");
  const [primaryButtonLink,setPrimaryButtonLink]=useState("");
  const [imageSr,setImageSrc]=useState("");
  const [startTime,setStartTime]=useState("");
  const [startDate,setStartDate]=useState("");
  const [subheading,setSubHeading]=useState("");
  const [buttonText,setButtonText]=useState("");
  const [owner,setOwner]=useState(true)
  const [btnText,setBtnText]=useState("No recording Available Yet")

  let button;
  let func=function (){alert(url);window.location.href=url}
  let recording=<PrimaryButton onClick={func}>
  {btnText}
</PrimaryButton>;

  async function cancel() {
    let db = firebase.firestore();
    let value = await db.collection("Events").where("MeetingNumber", "==", id).get();
    if (value.docs.length === 0) return;
    let event = value.docs[0];
    let uid = event.data().uid;
    let user = await db.collection("users").doc(uid).get();
    let friends = user.data().friends;


    const notiObject = {
      user: user.data().name,
      number: id,
    };

    friends.forEach(f => {
      var l =
        "https://api.ravenhub.io/company/7RSvlrMSZE/subscribers/" + f + "/events/UO2OMs2G3W";
      fetch(l, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(notiObject),
      })
    })
    
    db.collection("Events").doc(event.id).delete().then(() => {
      window.location.href = "/main";
    }).catch((e) => {
      console.log("rip");
    })
  }
  
  if (owner) {
    button = <PrimaryButton onClick={cancel}>
      Cancel Event
    </PrimaryButton>
  } else {
  }

  const loadData=async ()=>{
    const meeting=await getMeetingFromDB(id)
    if(heading.length)return
    if(meeting.recordable!==null && meeting.recordable==="yes")alert("You will be recorded");
    setHeading(heading => meeting.title+" : "+meeting.startTime+" "+meeting.startDate);
    setDescript(descript => meeting.description);
    var newUrl="/Meeting/event/"+meeting.MeetingNumber;
    setPrimaryButtonLink(primaryButtonLink => newUrl);
    setStartTime(startTime => meeting.startTime);
    setStartDate(startDate => meeting.startDate);
    setImageSrc(imageSr => meeting.imgSrc);
    setSubHeading(subheading => meeting.category + " "+(meeting.hashtag==null?"":"#"+meeting.hashtag));
    setButtonText(buttonText=>"Join Meeting")
    const user=await getUser()
    if(user.uid===meeting.uid)setOwner(owner => true)
    else setOwner(owner=>false)

    if(meeting.recordable!=null && meeting.recordable==="yes")
    {
      await fetch("http://localhost:5001/proevento-69c0b/us-central1/getRecording", {
        method: 'POST',
        body: JSON.stringify({
          meetingNumber: id,
        })
      }).then(res => res.json())
      .then(response => {
        if (response.url!=="No recording found") {
          url=response.url;
          setBtnText("View Recording")
        } 
        else {
        } 
      }).catch(error => {
        console.error(error)
      })
    }
  }

  loadData()

  return (
    <AnimationRevealPage>
      <Header />
      <MainFeature1
        subheading={<Subheading>{subheading}</Subheading>}
        heading={heading}
        buttonRounded={false}
        primaryButtonText={buttonText}
        primaryButtonUrl={primaryButtonLink}
        description={descript}
        imageSrc={imageSr}
      />
      {addUserToEvent(id,owner)}
      {addBadge(id,owner)}
      {button}
      {recording}
      <Footer />
    </AnimationRevealPage>
  );
};
