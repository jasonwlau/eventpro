import React, { useState } from "react";
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import { Container, ContentWithPaddingXl } from "components/misc/Layouts";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro";
import Header from "components/headers/light.js";
import Footer from "components/footers/FiveColumnWithInputForm.js";
import { SectionHeading } from "components/misc/Headings";
import { PrimaryButton } from "components/misc/Buttons";
import SearchBar from "./SearchBar";
import firebase from "firebase";
import { AppString } from "../src2/Component/Const";
import { getUser } from "backend/util";
import { CronJob } from 'cron';
import Sound from 'react-sound';
import Longing from '../mp3/Longing.mp3';
import './BlogIndex.css'



const HeadingRow = tw.div`flex`;
const Heading = tw(SectionHeading)`text-gray-900`;
const Posts = tw.div`mt-6 sm:-mr-8 flex flex-wrap`;
const PostContainer = styled.div`
  ${tw`mt-10 w-full sm:w-1/2 lg:w-1/3 sm:pr-8`}
  ${(props) =>
    props.featured &&
    css`
      ${tw`w-full!`}
      ${Post} {
        ${tw`sm:flex-row! h-full sm:pr-4`}
      }
      ${Image} {
        ${tw`sm:h-96 sm:min-h-full sm:w-1/2 lg:w-2/3 sm:rounded-t-none sm:rounded-l-lg`}
      }
      ${Info} {
        ${tw`sm:-mr-4 sm:pl-8 sm:flex-1 sm:rounded-none sm:rounded-r-lg sm:border-t-2 sm:border-l-0`}
      }
      ${Description} {
        ${tw`text-sm mt-3 leading-loose text-gray-600 font-medium`}
      }
    `}
`;
const Post = tw.div`cursor-pointer flex flex-col bg-gray-100 rounded-lg`;
const Image = styled.div`
  ${(props) =>
    css`
      background-image: url("${props.imageSrc}");
    `}
  ${tw`h-64 w-full bg-cover bg-center rounded-t-lg`}
`;
const Info = tw.div`p-8 border-2 border-t-0 rounded-lg rounded-t-none`;
const Category = tw.div`uppercase text-primary-500 text-xs font-bold tracking-widest leading-loose after:content after:block after:border-b-2 after:border-primary-500 after:w-8`;
const CreationDate = tw.div`mt-4 uppercase text-gray-600 italic font-semibold text-xs`;
const Title = tw.div`mt-1 font-black text-2xl text-gray-900 group-hover:text-primary-500 transition duration-300`;
const Description = tw.div``;

const ButtonContainer = tw.div`flex justify-center`;
const LoadMoreButton = tw(PrimaryButton)`mt-16 mx-auto`;


export default ({
  headingText = "Events",
  posts = [
    {
      imageSrc:
        "https://images.unsplash.com/photo-1499678329028-101435549a4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1024&q=80",
      category: "Travel Tips",
      date: "April 21, 2020",
      title: "Safely Travel in Foreign Countries",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      url: "https://timerse.com",
      featured: true,
    },
  ]
}) => {
  const PlaySound = (
    handleSongFinishedPlaying,
    handleSongLoading,
    handleSongPlaying
  );

  const [visible, setVisible] = useState(7);
  const [data, setData] = useState([]);
  const [input, setInput] = useState([]);
  const [search, setSearch] = useState(false);
  const [display, setDisplay] = useState("All");
  const [searchType, setSearchType] = useState("Title");
  const [isPlaying, setIsPlaying] = useState(true);

  const onLoadMoreClick = () => {
    setVisible((v) => v + 6);
  };

  const loadData = async () => {
    let id = localStorage.getItem(AppString.ID);
    const user = await getUser();
    console.log(id);
    if (search === false) {
      const events = firebase.firestore().collection("Events");
      events
        .get()
        .then((querySnapshot) => {
          var ndata = [];
          querySnapshot.docs.forEach((doc) => {
            if (
              doc.data().public !== undefined &&
              doc.data().public === false &&
              !doc.data().authorized.includes(user.uid)
            )
              return;
            console.log(doc.data());
            if (display === "All" || display === doc.data().category) {
              ndata.push(doc.data());
            }
          });
          setData((data) => ndata);
        })
        .catch(console.log);
      console.log(data);
    }
  };

  const updateInput = async (input) => {
    const events = firebase.firestore().collection("Events");
    const user = await getUser();
    events.get().then((querySnapshot) => {
      var ndata = [];
      querySnapshot.docs.forEach((doc) => {
        console.log(doc.data());
        if (
          doc.data().public !== undefined &&
          doc.data().public === false &&
          !doc.data().authorized.includes(user.uid)
        )
          return;
        ndata.push(doc.data());
      });

      const filtered = ndata.filter((event) => {
        if (searchType === "Title") {
          return event.title.toLowerCase().includes(input.toLowerCase());
        } else if (searchType === "Hashtag") {
          if(event.hashtag==null)return false
          return event.hashtag
            .toLowerCase()
            .includes("#" + input.toLowerCase());
        } else {
          return event.startDate.toLowerCase().includes(input.toLowerCase());
        }
      });
      setInput(input);
      setData(filtered);
      setSearch(true);
    });
  };

  loadData();


  var handleSongLoading = true;
  var handleSongPlaying = true ;
  var handleSongFinishedPlaying = true;
  
  
  return (
    <AnimationRevealPage>
    <div>
      <Sound
        url={Longing}
        playStatus={isPlaying ? Sound.status.PLAYING : Sound.status.STOPPED}
        onLoading={handleSongLoading}
        onPlaying={handleSongPlaying}
        onFinishPlaying={handleSongFinishedPlaying}
      />
    </div>
    <button class="music"
    onClick={()=> setIsPlaying(!isPlaying)}>{!isPlaying ? 'Play Music' : 'Stop Music'}</button>
      <Header />
      <Container className="BlogPage">
        <ContentWithPaddingXl>
          <HeadingRow>
            <Heading>{headingText}</Heading>
          </HeadingRow>
          <div>
            <select
              value={display}
              onChange={(e) => setDisplay(e.target.value)}
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
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
            >
              <option value="Title">Title</option>
              <option value="Hashtag">Hashtag</option>
              <option value="Start-Time">Start-Time</option>
            </select>
          </div>
          <SearchBar input={input} onChange={updateInput} />
          <Posts>
            {data.map((post, index) => (
              <PostContainer key={index} featured={0}>
                <Post
                  className="group"
                  as="a"
                  href={"/Meeting/landing/" + post.MeetingNumber}
                >
                  <Image imageSrc={post.imgSrc} />
                  <Info>
                    <Category>{post.category}</Category>
                    <CreationDate>
                      {post.startTime + " " + post.startDate}
                    </CreationDate>
                    <Title>{post.title}</Title>
                    {post.featured && post.description && (
                      <Description>{post.description}</Description>
                    )}
                  </Info>
                </Post>
              </PostContainer>
            ))}
          </Posts>
          {visible < data.length && (
            <ButtonContainer>
              <LoadMoreButton onClick={onLoadMoreClick}>
                Load More
              </LoadMoreButton>
            </ButtonContainer>
          )}
        </ContentWithPaddingXl>
      </Container>
      <Footer />
    </AnimationRevealPage>
  );
};

const getPlaceholderPost = () => ({
  imageSrc:
    "https://images.unsplash.com/photo-1418854982207-12f710b74003?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1024&q=80",
  category: "Travel Guide",
  date: "April 19, 2020",
  title: "Visit the beautiful Alps in Switzerland",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  url: "https://reddit.com",
});
