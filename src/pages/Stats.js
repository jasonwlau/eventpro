import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import firebase from "firebase";

function User(props) {
  var out = (u, n) => u.map((x, i) => <div>{x} - {n[i]} </div>)
  return(
    <div style = {{ marginLeft : '30%'}}>
      {out(props.u, props.n)}
    </div>
  )
}

function Stats() {
  let { groupID } = useParams();
  const [mtable, setmTable] = useState([]);
  const [ctable, setcTable] = useState([]);

  useEffect(() => {
    const load = async () => {
      let db = firebase.firestore();
      let asdf = await db.collection("votingStats").where("groupID", "==", groupID).get().then(res => {
        res.forEach(async (doc) => {
          let member = doc.data().userID;
          let user = await db.collection("users").doc(member).get();
          let name = await user.data().name;
          let count = doc.data().count;
          setmTable(prev => [...prev, name]);
          setcTable(prev => [...prev, count]);
        });
      })
    }
    load(); 
  }, [])

  return (
    <div>
      <h1>
        Events Set
      </h1>
      {ctable.length > 0 &&
        <User u={mtable} n={ctable}/>
      }
      
    </div>
  )
}

export default Stats; 