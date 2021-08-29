import React, { useState } from "react";
import { FiSearch, FiFilter } from "react-icons/fi";
import "styles/search.css";
//import test from "./test.json";
import Fuse from "fuse.js";
import fire from "../backend/config";

function Search() {
  const [search, setSearch] = useState("");

  const UserResult = ({ image, name, username }) => {
    return (
      <div className="ResultWrapper">
        <div className="ResImg">
          <img className="img" src={image} alt={name} />
        </div>
        <div className="ResInfo">
          <div className="Header">
            <div className="InfoTitle">{name}</div>
          </div>
          <div className="InfoDescr">@{username}</div>
        </div>
      </div>
    );
  };
  // Need function to search firebase event data (start time) based on search term
  // Need function to search firebase event and user data (user, username, event name) based on search tearm
  const searchData = (pattern) => {
    console.log(pattern);
    if (!pattern) {
      setSearch(test);
      return;
    }
    const fuse = new Fuse(search, {
      keys: ["image", "name", "username"],
    });
    console.log("here");
    const result = fuse.search(pattern);
    const matches = [];

    if (!result.length) {
      //document.getElementById(SearchContainer).innerHTML =  "Sorry, no results for " ({pattern});
      setSearch([]);
    } else {
      result.forEach(({ item }) => {
        matches.push(item);
      });
      setSearch(matches);
    }
  };

  return (
    <div>
      <div>
        <h1> Find Events and Users </h1>
        <div>
          <div className="Search">
            {/*Search Bar Component*/}
            <input
              className="SearchInput"
              type="text"
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              placeholder="Search by user, event, time..."
            />
            <button className="SearchSpan" onClick={(e) => searchData(search)}>
              <span>
                {" "}
                <FiSearch />{" "}
              </span>
            </button>
          </div>
          <div className="btn-group">
            <span style={{ color: "darkslateblue", margin: "auto", width: 50 }}>
              {" "}
              <FiFilter />{" "}
            </span>
            <button className="SearchButton"> Users </button>
            <button className="SearchButton"> Events </button>
          </div>
        </div>
      </div>
      {/*end Search Bar component*/}
      <div id="SearchContainer">
        {test.map((item) => (
          <UserResult {...item} key={item.name} />
        ))}
      </div>
    </div>
  );
}

export default Search;
//
// const fetchItem = async() => {
//     const response = db.collection('Events');
//     const data = await response.get();
//     data.docs.forEach((item) => {
//       showResults([...blogs,item.data()])
//     });
//
// }
