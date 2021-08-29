import React, { useEffect, useState } from "react";
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
import {getUser} from "backend/util"

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
  headingText1 = "Upcoming Events",
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
  ],
}) => {
  const [visible, setVisible] = useState(7);
  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);
  const [search, setSearch] = useState(false);
  const [display, setDisplay] = useState("All");
  const [userId, setUserId] = useState(0);

  const onLoadMoreClick = () => {
    setVisible((v) => v + 6);
  };

  const loadData = async () => {
    let id = localStorage.getItem(AppString.ID);
    const user=await getUser();
    console.log(id);
    if (search === false) {
      const events = firebase.firestore().collection("Events");
      //getting hosting and registered events
      
      var ndata = [];
      var mdata = [];
      events
        .get()
        .then((querySnapshot) => {
          querySnapshot.docs.forEach((doc) => {
            console.log(doc.data().uid, "event uid");
            console.log(user.uid, "useruid");
            console.log(doc.data().authorized, "authorized");
           let authorized = [];
           if(doc.data().authorized){
               authorized = doc.data().authorized ;
           }
            console.log(authorized.length > 0 && authorized.includes(user.uid), "result");
            if ((authorized.length > 0 && authorized.includes(user.uid) )|| doc.data().uid == user.uid) {
              ndata.push(doc.data());
              console.log(doc.data(), "inside loop");
            }
          });
          setData(ndata);
        })
        .catch(console.log);
      console.log(data);

      //getting events in the corresponding category
      //first get the corresponding user
      let user2;
      const users = await firebase.firestore().collection('users');
      users.get()
      .then(querySnapshot => {
        var usersData=[];
        console.log(querySnapshot, "querysnapshot")

        querySnapshot.docs.forEach(
          doc => {
            usersData.push(doc.data())
          }
        );
        console.log(usersData, "usersdata");
        usersData.forEach(user2 => {
          if(user2.uid === user.uid){
            events
            .get()
            .then((querySnapshot) => {
              querySnapshot.docs.forEach((doc) => {
                console.log(doc.data().category, "event category");
                console.log(user2.category, "usereventcategories");
                let category = [];
                if (user2.category){
                  category = user2.category;
                }
                console.log(category.length > 0 && category.includes(doc.data().category), "result");
                if ((category.length > 0 && category.includes(doc.data().category) )|| doc.data().category == category) {
                   mdata.push(doc.data());
                   console.log(doc.data(), "inside loop");
                 }
              });
               setData2(mdata);
            }) 
          }
        })
      })
    }
  };

//   //usereffect only executes once in the beg if we don't pass anything in
//   useEffect(() => {
//     loadData();
//   },[userId]); //useeffect will be called again when userid changes

useEffect(() => {
    loadData();
}, []);


//   const handleClick = () => {
//     setUserId("1");
//   }

  return (
    <AnimationRevealPage>
      <Header />
      <Container className="BlogPage">
        <ContentWithPaddingXl>
          <HeadingRow>
            <Heading>{headingText1}</Heading>
          </HeadingRow>
          {/* <button onClick={handleClick} >Change User Id</button> */}
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
            {data2.map((post, index) => (
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
