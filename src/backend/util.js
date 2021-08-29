import firebase from "firebase";

export const getUser = () => {
  return new Promise((resolve, reject) => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        resolve(user);
      } else {
        resolve(null);
      }
    });
  });
};

export const getMeetingFromDB = async (id) => {
  const query = await firebase
    .firestore()
    .collection("Events")
    .where("MeetingNumber", "==", id.toString())
    .get();
  if (query.docs.length === 0) return null;
  return query.docs[0].data();
};

export const getGroup=async (id)=>{
  alert(id)
  const query = await firebase
    .firestore()
    .collection("messages")
    .where("chatId", "==", id.toString())
    .get();
  if (query.docs.length === 0) return null;
  return query.docs[0];
}

export const errorComponent = () => {
  return true;
};

export const getFriends = async () => {
  var user = await getUser();
  if (user === null) window.location.href = "components/innerPages/LoginPage";
  var doc = await firebase
    .firestore()
    .collection("users")
    .doc(user.uid.toString())
    .get();
  return doc.data().friends;
};

export const getUserById=async(id)=>{
  var doc = await firebase
    .firestore()
    .collection("users")
    .doc(id.toString())
    .get();
  return doc.data();
}

export const getFriendsData=async()=>{
  const friends=await getFriends()
  let res=[]
  for(let i=0;i<friends.length;i++)
  {
    let data=await getUserById(friends[i].toString())
    res.push(data)
  }
  return res
}

export const addUserToEvent=async(Meeting,friendUID)=>{
  if(Meeting.authorized!==undefined)
  {
    if(!Meeting.authorized.includes(friendUID))
    {
      Meeting.authorized.push(friendUID)
      alert(Meeting.authorized[0])
      
      const query=await firebase.firestore().collection("Events")
      .where("MeetingNumber", "==", Meeting.MeetingNumber.toString())
      .get()

      alert(query.docs.length)
      
      await query.docs[0].ref.set(Meeting)
      alert("done")
    }
  }
}
