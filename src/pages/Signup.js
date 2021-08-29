import React, { useState } from "react";
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import { Container as ContainerBase } from "components/misc/Layouts";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro"; //eslint-disable-line
import illustration from "images/signup-illustration.svg";
import logo from "images/logo.svg";
import googleIconImageSrc from "images/google-icon.png";
import twitterIconImageSrc from "images/twitter-icon.png";
import { ReactComponent as SignUpIcon } from "feather-icons/dist/icons/user-plus.svg";
import firebase from "firebase";
import { browserHistory } from "react-router";
import axios from "axios";
import Header from "components/headers/light.js";
import { getUser, getFriends } from "../backend/util";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

var createReactClass = require("create-react-class");
const Container = tw(
  ContainerBase
)`min-h-screen bg-primary-900 text-white font-medium flex justify-center -m-8`;
const Content = tw.div`max-w-screen-xl m-0 sm:mx-20 sm:my-16 bg-white text-gray-900 shadow sm:rounded-lg flex justify-center flex-1`;
const MainContainer = tw.div`lg:w-1/2 xl:w-5/12 p-6 sm:p-12`;
const LogoLink = tw.a``;
const LogoImage = tw.img`h-12 mx-auto`;
const MainContent = tw.div`mt-12 flex flex-col items-center`;
const Heading = tw.h1`text-2xl xl:text-3xl font-extrabold`;
const FormContainer = tw.div`w-full flex-1 mt-8`;

const SocialButtonsContainer = tw.div`flex flex-col items-center`;
const SocialButton = styled.a`
  ${tw`w-full max-w-xs font-semibold rounded-lg py-3 border text-gray-900 bg-gray-100 hocus:bg-gray-200 hocus:border-gray-400 flex items-center justify-center transition-all duration-300 focus:outline-none focus:shadow-outline text-sm mt-5 first:mt-0`}
  .iconContainer {
    ${tw`bg-white p-2 rounded-full`}
  }
  .icon {
    ${tw`w-4`}
  }
  .text {
    ${tw`ml-4`}
  }
`;

const DividerTextContainer = tw.div`my-12 border-b text-center relative`;
const DividerText = tw.div`leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform -translate-y-1/2 absolute inset-x-0 top-1/2 bg-transparent`;

const Form = tw.form`mx-auto max-w-xs`;
const Input = tw.input`w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5 first:mt-0`;
const SubmitButton = styled.button`
  ${tw`mt-5 tracking-wide font-semibold bg-primary-500 text-gray-100 w-full py-4 rounded-lg hover:bg-primary-900 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none`}
  .icon {
    ${tw`w-6 h-6 -ml-2`}
  }
  .text {
    ${tw`ml-3`}
  }
`;
const IllustrationContainer = tw.div`sm:rounded-r-lg flex-1 bg-purple-100 text-center hidden lg:flex justify-center`;
const IllustrationImage = styled.div`
  ${(props) => `background-image: url("${props.imageSrc}");`}
  ${tw`m-12 xl:m-16 w-full max-w-lg bg-contain bg-center bg-no-repeat`}
`;

const alertUser = async (uid, eventType, meetingID) => {
  var user = await getUser();
  if (user === null) window.location.href = "components/innerPages/LoginPage";

  var name = user.displayName === null ? "friend" : user.displayName;
  var str = name + " " + eventType;
  const notiObject = {
    name: "Jason",
    eventName: "skateboard",
    urlVar: "../../Meeting/landing/" + meetingID.toString(),
  };
  var l =
    "https://api.ravenhub.io/company/7RSvlrMSZE/subscribers/" +
    uid +
    "/events/8VNgJeJf44";
  fetch(l, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(notiObject),
  })
    .then((response) => console.log(response))
    .catch(console.error);
};

const alertFollowers = async (eventType, meetingID) => {
  var friends = await getFriends();
  //alert(friends)
  for (let i in friends) {
    await alertUser(friends[i], eventType, meetingID);
  }
};

const addMeetingToDB = async (meeting) => {
  var user = await getUser();
  if (user === null) window.location.href = "components/innerPages/LoginPage";
  console.log("Got HEre");
  await firebase
    .firestore()
    .collection("Events")
    .add(meeting)
    .then(function (docRef) {
      window.location.href = "/Meeting/landing/" + meeting.MeetingNumber;
    })
    .catch(console.error);
};

const options = ["Sports", "Gaming", "Education", "Music", "Food"];
const defaultOption = options[0];

export default ({
  logoLinkUrl = "#",
  illustrationImageSrc = illustration,
  headingText = "Sign Up For Treact",
  socialButtons = [
    {
      iconImageSrc: googleIconImageSrc,
      text: "Sign Up With Google",
      url: "https://google.com",
    },
    {
      iconImageSrc: twitterIconImageSrc,
      text: "Sign Up With Twitter",
      url: "https://twitter.com",
    },
  ],
  submitButtonText = "Sign Up",
  SubmitButtonIcon = SignUpIcon,
  tosUrl = "#",
  privacyPolicyUrl = "#",
  signInUrl = "#",
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [startDate, setStartDate] = useState("");
  const [category, setCategory] = useState("");
  const [number, setNumber] = useState(0);
  const [imgSrc, setImgSrc] = useState("");
  const [notify, setNotify] = useState("");
  const [hashTag,setHashtag]=useState("");
  const [recordable,setRecordable]=useState("")
  //const [pub,setPublic]=useState(true)

  var pub="true"

  const submitFunc = async () => {
    var time = startTime + ":00";
    var dateTime = startDate + "T" + time;
    var db = firebase.firestore();
    var date = new Date(startDate + " " + startTime);
    var timeStamp = firebase.firestore.Timestamp.fromDate(date);
    var rec=recordable==="yes"?"cloud":"none"
    const data = {
      name: name,
      description: description,
      startTime: startTime + ":00",
      startDate: startDate,
      date: timeStamp,
      category: category,
      imgSrc: imgSrc,
      shouldRecord: rec
    };
    const options = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    const user = await getUser();

    axios
      .post(
        "https://us-central1-proevento-69c0b.cloudfunctions.net/getMeetingID",
        data,
        options
      )
      .then(async (res) => {
        alert(pub)
        alert(pub==="true")
        var options = {
          MeetingNumber: res.data.toString(),
          category: category,
          description: description,
          imgSrc: imgSrc,
          startDate: startDate,
          startTime: startTime,
          title: name,
          uid: user.uid,
          public: pub==="true",
          authorized:[],
          hashtag: hashTag,
          recordable: recordable,
        };

        if (notify === "yes")
          await alertFollowers("has created an event", res.data);
        await addMeetingToDB(options);
        window.location="/meeting/landing/"+res.data.toString()
      });
  };

  return (
    <AnimationRevealPage>
      <Container>
        <Content>
          <MainContainer>
            <LogoLink href={logoLinkUrl}>
              <LogoImage src={logo} />
            </LogoLink>
            <MainContent>
              <Header />
              <Heading>Create an Event</Heading>
              <FormContainer>
                <Form>
                  <Input
                    type="text"
                    placeholder="Event Name"
                    onChange={(event) => setName(event.target.value)}
                  />
                  <Input
                    type="text"
                    placeholder="Description"
                    onChange={(event) => setDescription(event.target.value)}
                  />
                  <Input
                    type="time"
                    placeholder="Start Time"
                    onChange={(event) => setStartTime(event.target.value)}
                  />
                  <Input
                    type="date"
                    placeholder="Start Date"
                    onChange={(event) => setStartDate(event.target.value)}
                  />
                  <Input
                    type="text"
                    placeholder="Recordable"
                    onChange={(event) => setRecordable(event.target.value)}
                  />
                  {/* <Input
                    type="text"
                    placeholder="Category"
                    onChange={(event) => setCategory(event.target.value)}
                  /> */}

                  <div>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="All">All</option>
                      <option value="Sports">Sports</option>
                      <option value="Gaming">Gaming</option>
                      <option value="Music">Music</option>
                      <option value="Education">Education</option>
                      <option value="Food">Food</option>
                      <option value="Study">Study</option>
                      <option value="Piano">Piano</option>
                      <option value="Animals">Animals</option>
                      <option value="Technology">Technology</option>
                      <option value="Writing">Writing</option>
                      <option value="Hiking">Hiking</option>
                      <option value="Cooking">Cooking</option>
                      <option value="Guitar">Guitar</option>
                      <option value="Dessert">Dessert</option>
                      <option value="Soccer">Soccer</option>
                      <option value="Journaling">Journaling</option>
                      <option value="Traveling">Traveling</option>
                      <option value="Books">Books</option>
                      <option value="Coding">Coding</option>
                      <option value="Running">Running</option>
                      <option value="Games">Games</option>
                      <option value="Pets">Pets</option>
                      <option value="Gym">Gym</option>
                    </select>
                  </div>
                  <div>
                    <label for="pub">Make Event Public</label>
                    <select
                    id="pub"
                      value={pub}
                      onChange={(e) => {pub=e.target.value}}
                    >
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                  <Input
                    type="text"
                    placeholder="Link to Image"
                    onChange={(event) => setImgSrc(event.target.value)}
                  />
                  <Input
                    type="text"
                    placeholder="Hashtag"
                    onChange={(event) => setHashtag(event.target.value)}
                  />
                  <Input
                    type="text"
                    placeholder="Notfy Friends"
                    onChange={(event) => setNotify(event.target.value)}
                  />
                  <SubmitButton type="button" onClick={submitFunc}>
                    <SubmitButtonIcon className="icon" />
                    <span className="text">Create</span>
                  </SubmitButton>
                  <p tw="mt-6 text-xs text-gray-600 text-center">
                    I agree to abide by treact's{" "}
                    <a
                      href={tosUrl}
                      tw="border-b border-gray-500 border-dotted"
                    >
                      Terms of Service
                    </a>{" "}
                    and its{" "}
                    <a
                      href={privacyPolicyUrl}
                      tw="border-b border-gray-500 border-dotted"
                    >
                      Privacy Policy
                    </a>
                  </p>
                  <p tw="mt-8 text-sm text-gray-600 text-center">
                    Already have an account?{" "}
                    <a
                      href={signInUrl}
                      tw="border-b border-gray-500 border-dotted"
                    >
                      Sign In
                    </a>
                  </p>
                </Form>
              </FormContainer>
            </MainContent>
          </MainContainer>
          <IllustrationContainer>
            <IllustrationImage imageSrc={illustrationImageSrc} />
          </IllustrationContainer>
        </Content>
      </Container>
    </AnimationRevealPage>
  );
};
