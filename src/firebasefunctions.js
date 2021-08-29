import firebase from "./backend/config";

var uniqid = require("uniqid");

const firebase_functions = {
  //CS310 FUNCTIONS
  createUser: async function (name, email, bio, firebaseRef) {
    global.userId = uniqid();
    firebaseRef
      .child("users_public/" + global.userId)
      .once("value")
      .then(function (snapshot) {
        if (!snapshot.child("email").exists()) {
          firebase
            .database()
            .ref("users_public/" + global.userId) //username
            .set({
              email: email,
              name: name,
              id: global.userId,
              bio: bio,
              img: "https://pbs.twimg.com/media/ET1UHOxWoAMP75a.jpg",
              events: [],
              friends: [],
            });
        }
      });
  },

  fetchUser: async function (firebaseRef) {
    const response = await firebaseRef
      .child("users_public")
      .child(global.userId)
      .once("value");
    if (!response) {
      return "error";
    }

    return response.val();
  },

  // Creates Deal object for users
  createEvent: async function (
    host_name,
    img_,
    zoom_id,
    start_time,
    firebaseRef,
    event_title,
    category,
    startTime
  ) {
    //create unique event id
    var event_id = uniqid;
    ////adds to event array
    firebaseRef.child("events").child(event_id).set({
      host: host_name,
      id: event_id,
      url: zoom_id,
      event_image: img_,
      event_title: event_title,
      category: category,
      startTime: startTime,
    });
    console.log("event created!");
    firebaseRef
      .child("users_public/" + global.userId)
      .child("events")
      .child(event_id);
    console.log("event added to user!");
  },

  searchEventbyName: async function (firebaseRef, title) {
    let events = this.fetchEvents(firebaseRef);
    let results = [];
    events.forEach((element) => {
      if (element.event_title === title) {
        results.push(element);
      }
    });

    return results;
  },

  searchEventbyUser: async function (firebaseRef, user) {
    let events = this.fetchEvents(firebaseRef);
    let results = [];
    events.forEach((element) => {
      if (element.host_name === user) {
        results.push(element);
      }
    });

    return results;
  },
  fetchEvents: async function (firebaseRef) {
    console.log("in Fetch Deal");
    // const response = await firebaseRef
    //   .child("users_public")
    //   .child(global.userId)
    //   .child("deals")
    //   .once("value");
    // if (!response) {
    //   return "error";
    // }
    // //recieve all pending, active, completed
    // let user_deals = response.val();

    let dealObjects = [];
    let dealIDs = [];
    const promises = [];

    // PLAN HERE
    // Instead of storing by pending/active/completed, store each deal inside of
    // user data and they have their own status field. So then we grab all of the
    // deals initially with our for each loop using userSnap into one array.
    // Then loop through the array of all deal ID's, and by checking each ID's status
    // we can sort the current deal into pending/acive/completed respectively.
    await firebaseRef
      .child("events")
      .once("value", async function (snapshot) {
        console.log("First firebase call");
        let numDeals = Object.keys(snapshot.val());
        for (let i = 0; i < numDeals.length; i++) {
          //console.log(numDeals[i]);
          dealIDs.push(numDeals[i]);
        }
      })
      .then(async () => {
        // For each dealID inside of dealIDs, we are going into the deals object in
        // firebase and pushing the object into the dealObjects array. Once the counter
        // get to zero and we have pushed all of the users deals, we return the final array.

        dealIDs.forEach(async function (deal) {
          console.log("IN DEALID FOREACH LOOP");
          promises.push(
            firebaseRef
              .child("events")
              .child(deal)
              .once("value", function (snap) {
                console.log("IN FIREBASE QUERY FUNCTION");
                dealObjects.push(snap.val());
              })
          );
        });
        return Promise.all(promises).then(() => {
          console.log("LEAVING FETCHDEALS");

          return dealObjects;
        });
      });
    return dealObjects;
  },

  setName: async function (name, firebaseRef) {
    firebaseRef.child("users_public").child(global.userId).update({
      name: name,
    });
  },
  setPic: function (img_src, firebaseRef) {
    firebaseRef.child("users_public").child(global.userId).update({
      img: img_src,
    });
  },
  setBio: function (bio, firebaseRef) {
    firebaseRef.child("users_public").child(global.userId).update({
      bio: bio,
    });
  },
};

export default firebase_functions;
