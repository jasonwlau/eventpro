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
import "styles/search.css";
//import firebasefunctions from "firebasefunctions";
import firebase from "firebase";
import { FiSearch, FiFilter } from "react-icons/fi";
import Fuse from "fuse.js";
//import Notification from "components/misc/Notification";

const HeadingRow = tw.div`flex`;
const Heading = tw(SectionHeading)`text-gray-900`;
const Posts = tw.div`mt-6 sm:-mr-8 flex flex-wrap`;
var firebaseRef = fire.database().ref();
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
      background-image: url("${props.imgSrc}");
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
  headingText = "Find Events and Users",

  posts = [
    {
      imgSrc:
        "https://images.unsplash.com/photo-1418854982207-12f710b74003?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1024&q=80",
      category: "Travel Guide",
      date: "April 19, 2020",
      title: "Visit the beautiful Alps in Switzerland",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      url: "https://reddit.com",
    },
    {
      imgSrc:
        "https://images.unsplash.com/photo-1418854982207-12f710b74003?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1024&q=80",
      category: "Travel Guide",
      date: "April 19, 2020",
      title: "Visit the beautiful Alps in Switzerland",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      url: "https://reddit.com",
    },
  ],

  //[
  //   {
  //     imgSrc:
  //       "https://images.unsplash.com/photo-1499678329028-101435549a4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1024&q=80",
  //     category: "Travel Tips",
  //     date: "April 21, 2020",
  //     title: "Safely Travel in Foreign Countries",
  //     description:
  //       "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  //     url: "https://timerse.com",
  //     featured: true,
  //   },
  //   getPlaceholderPost(),
  //   getPlaceholderPost(),
  //   getPlaceholderPost(),
  //   getPlaceholderPost(),
  //   getPlaceholderPost(),
  //   getPlaceholderPost(),
  //   getPlaceholderPost(),
  //   getPlaceholderPost(),
  //   getPlaceholderPost(),
  //   getPlaceholderPost(),
  //   getPlaceholderPost(),
  //   getPlaceholderPost(),
  //   getPlaceholderPost(),
  //   getPlaceholderPost(),
  //   getPlaceholderPost(),
  //   getPlaceholderPost(),
  //   getPlaceholderPost(),
  //   getPlaceholderPost(),
  // ],
}) => {
  const [visible, setVisible] = useState(7);
  const onLoadMoreClick = () => {
    setVisible((v) => v + 6);
  };
  const [data, setData] = useState(posts);
  const [input, setInput] = useState("");
  //console.log("setting data");
  const dataArray = Object.entries(data);

  const [container, setContainer] = useState("");

  const [toggleU, setToggleU] = useState(false);
  const [toggleE, setToggleE] = useState(false);

  //let new_posts = [];
  const loadEventData=()=>{
      const events = fire.firestore().collection('Events')
      events.get()
      .then(querySnapshot => {
          var ndata=[]
          querySnapshot.docs.forEach(
            doc => {
              //console.log(doc.data());
              ndata.push(doc.data())
            }
          );
          setData(data => ndata)
      })
      .catch(console.log);
    }

  const loadUserData=()=>{
      const events = fire.firestore().collection('users')
      events.get()
      .then(querySnapshot => {
          var ndata=[]
          querySnapshot.docs.forEach(
            doc => {
              //console.log(doc.data());
              ndata.push(doc.data())
            }
          );
          setData(data => ndata)
      })
      .catch(console.log);
    }



  {
    /* Toggle User Button: Filter database by users */
  }
  const toggleButtonU = () => {
    setToggleU(!toggleU);
    if (!toggleU) loadUserData();
    //!toggleU ? loadUserData() : setData(posts);

  };
  {
    /* Toggle Event Button: Filter database by events */
  }
  const toggleButtonE = () => {
    setToggleE(!toggleE);
    if (!toggleE) loadEventData();
    //!toggleE ? loadEventData() : setData(posts);
  };
  {
    /*Otherwise, search through whole database?*/
  }

  let buttonClassU = toggleU ? "darkButton" : "lightButton";
  let buttonClassE = toggleE ? "darkButton" : "lightButton";

  const getFilterMessage = () => {
    return (
      <Posts>
        <p style={{ textAlign: "center" }}>
        Please choose a filter to view users or events. </p>
      </Posts>
    );
  }
  const getUsers = () => {
    return (
      <Posts>
        <p style={{ textAlign: "center" }}>
          <i> Search through these users:</i>{" "}
        </p>

        {data.slice(0, visible).map((user, index) => (
          <PostContainer key={index} featured={user.featured}>
            <Post className="group" as="a" href={user.url}>
              <Image imgSrc={user.photoUrl} />
              <Info>
                <Title>{user.nickname}</Title>
                <Description>{user.aboutMe}</Description>
              </Info>
            </Post>
          </PostContainer>
        ))}
      </Posts>
    );
  }
  const getEventsPosts = () => {
    console.log("showing posts");
    return (
      <Posts>
        <p style={{ textAlign: "center" }}>
          <i> Search through these events:</i>{" "}
        </p>

        {data.slice(0, visible).map((post, index) => (
          <PostContainer key={index} featured={post.featured}>
            <Post className="group" as="a" href={post.url}>
              <Image imgSrc={post.imgSrc} />
              <Info>
                <Category>{post.category}</Category>
                <CreationDate>{post.startDate}</CreationDate>
                <CreationDate>{post.startTime}</CreationDate>
                <Title>{post.title}</Title>
                <Description>{post.description}</Description>
              </Info>
            </Post>
          </PostContainer>
        ))}
      </Posts>
    );

  };

const showData = () => {
  if (toggleE) return getEventsPosts();
  if (toggleU) return getUsers();
  else return getFilterMessage();
}

  const searchData = (pattern) => {
    console.log("looking for match of: ", pattern);
    if (!pattern) {
      setData(posts);
      return;
    }
    console.log("searching through: ", Object.values(data));
    let searchDat = Object.values(data);

    var fuse;
    if (toggleE) {
      fuse = new Fuse(searchDat, {
        keys: ["category", "title", "startDate", "startTime"],
      });

    } else if (toggleU) {
      fuse = new Fuse(searchDat, {
        keys: ["aboutMe", "nickname"],
      });

    } else {
      fuse = new Fuse(searchDat, {
        keys: ["category", "title", "startDate", "startTime"],
      });

    }

    const result = fuse.search(pattern);
    const matches = [];

    if (!result.length) {
      //document.getElementById(SearchContainer).innerHTML =  "Sorry, no results for " ({pattern});
      setData(data);
    } else {
      console.log("here");
      result.forEach(({ item }) => {
        matches.push(item);
      });
      //setData(matches);
      //console.log("array of matches: ", matches, " -- end array.");
    }
    return matches;
  };

  const ShowResults = (value) => {
    console.log("search term: ", value.value);
    let matchesArray = searchData(value.value);
    if (!matchesArray) return;
    console.log("returned array of matches: ", matchesArray);
    return toggleE ? (
      <Posts>
        <p style={{ textAlign: "center" }}>
          <i> Search results:</i>{" "}
        </p>

        {matchesArray.map((post, index) => (
          <PostContainer key={index} featured={post.featured}>
            <Post className="group" as="a" href={post.MeetingNumber}>
              <Image imgSrc={post.imgSrc} />
              <Info>
                <Category>{post.category}</Category>
                <CreationDate>{post.startDate}</CreationDate>
                <CreationDate>{post.startTime}</CreationDate>
                <Title>{post.title}</Title>
                <Description>{post.description}</Description>
              </Info>
            </Post>
          </PostContainer>
        ))}
      </Posts>
    ) : (
      <Posts>
        <p style={{ textAlign: "center" }}>
          <i> Search results:</i>{" "}
        </p>

        {matchesArray.map((user, index) => (
          <PostContainer key={index} featured={user.featured}>
            <Post className="group" as="a" href={user.url}>
              <Image imgSrc={user.photoUrl} />
              <Info>
                <Title>{user.nickname}</Title>
                <Description>{user.aboutMe}</Description>
              </Info>
            </Post>
          </PostContainer>
        ))}
      </Posts>

    );
  };

  return (
    <AnimationRevealPage>
      <Header />
      <Container>
        <ContentWithPaddingXl>
          <HeadingRow>
            <Heading>{headingText}</Heading>
          </HeadingRow>
          {/*Search Bar*/}
          <div className="Search">
            <input
              className="SearchInput"
              type="text"
              onChange={(e) => {
                setInput(e.target.value);
              }}
              placeholder="Search by user, event, time..."
            />
            <button
              className="SearchSpan"
              onClick={(e) => setContainer("show")}
            >
              <span>
                <FiSearch />{" "}
              </span>
            </button>
          </div>
          <div className="btn-group">
            <span
              style={{
                margin: "0 auto",
                color: "darkslateblue",
                textAlign: "center",
              }}
            >
              <p>Choose an option to filter: </p>{" "}
            </span>
            <button onClick={toggleButtonU} className={buttonClassU}>
              {" "}
              Users{" "}
            </button>
            <button onClick={toggleButtonE} className={buttonClassE}>
              {" "}
              Events{" "}
            </button>
          </div>
          {/* End Search Bar*/}
          <div className="container">
            {container === "show" && <ShowResults value={input} />}
          </div>
          {showData()}
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
  imgSrc:
    "https://images.unsplash.com/photo-1418854982207-12f710b74003?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1024&q=80",
  category: "Travel Guide",
  date: "April 19, 2020",
  title: "Visit the beautiful Alps in Switzerland",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  url: "https://reddit.com",
});
