import React, { Component, useState } from "react";
import moment from "moment";
import ReactLoading from "react-loading";
import { withRouter } from "react-router-dom";
import firebase from "firebase";
import images from "../Themes/Images";
import WelcomeBoard from "../WelcomeBoard/WelcomeBoard";
import "./Main.css";
import ChatBoard from "./../ChatBoard/ChatBoard";
import Head from "../../../components/headers/light.js";
import { Multiselect } from "multiselect-react-dropdown";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import ThreeColSimpleWithImageAndDashedBorder from "components/blogs/ThreeColSimpleWithImageAndDashedBorder";

const myFirebase = firebase;
const myFirestore = firebase.firestore();

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isOpenDialogConfirmLogout: false,
      currentPeerUser: null,
      friends: [],
      modal: false,
      open: false,
      selectPeopleId: [], 
      categories: ["Sports","Gaming","Music","Education","Food","Study","Piano","Animals","Technology",
      "Writing","Hiking","Cooking","Guitar","Dessert","Soccer","Journaling","Traveling","Books","Coding","Running","Pets","Gym"],
      selectCategories: []
    };
    this.currentUserId = 0;
    this.currentUserAvatar = "";
    this.currentUserNickname = "";
    this.listUser = [];
    this.data = {
      ID: "id",
      PHOTO_URL: "photoUrl",
      NICKNAME: "nickname",
      ABOUT_ME: "aboutMe",
      NODE_MESSAGES: "messages",
      NODE_USERS: "users",
      UPLOAD_CHANGED: "state_changed",
      DOC_ADDED: "added",
      PREFIX_IMAGE: "image/",
    };
  }

  componentDidMount() {
    this.checkLogin();
  }

  checkLogin = async () => {
    myFirebase.auth().onAuthStateChanged(async (user) =>{
        if (!user) {
            this.setState({isLoading: false}, () => {
                this.props.history.push('/components/innerPages/LoginPage2')
            })
        } 
        else {
            //alert("here")//alert(user.uid)
            if (user) {
                const result = await myFirestore
                    .collection(this.data.NODE_USERS)
                    .where("uid", '==', user.uid)
                    .get()

                if (result.docs.length === 0) {
                    // Set new data since this is a new user
                    alert(user.uid)
                    myFirestore
                        .collection('users')
                        .doc(user.uid)
                        .set({
                            uid:user.uid,
                            id: user.uid,
                            name: user.displayName,
                            bio: '',
                            photoURL: user.photoURL,
                            friends: [],
                            events: []
                        },{ merge: true })
                        .then(data => {
                            // Write user info to local
                            this.data.ID= user.uid
                            this.data.NICKNAME= user.displayName
                            this.data.PHOTO_URL=user.photoURL
                            this.currentUserAvatar=this.data.PHOTO_URL
                            this.currentUserNickname=this.data.NICKNAME
                            this.setState({isLoading: false}, () => {
                                this.props.showToast(1, 'Login success')
                                this.props.history.push('/main')
                            })
                            this.getListUser();
                        })
                } else {
                    // Write user info to local
                    this.data.ID=result.docs[0].data().uid
                    this.data.NICKNAME=result.docs[0].data().name
                    this.data.PHOTO_URL=result.docs[0].data().photoURL
                    this.data.ABOUT_ME=result.docs[0].data().aboutMe
                    this.setState({isLoading: false}, () => {
                        this.props.showToast(1, 'Login success')
                        //this.props.history.push('/main')
                    })
                    this.getListUser();
                }
                this.currentUserAvatar=this.data.PHOTO_URL
                this.currentUserNickname=this.data.NICKNAME
                var outputList = [];
                const res = await myFirestore.collection("users").doc(this.data.ID).get();
                console.log("here")
                console.log(res.data().friends);
                alert(res.data())
                this.state.friends = res.data().friends;
                for (var i = 0; i < this.state.friends.length; i++) {
                    console.log("Current item: " + this.state.friends[i]);
                    let promise = myFirestore.collection("users").doc(this.state.friends[i]).get()
                        .then(doc => {
                                outputList.push(
                                  {
                                    id: doc.data().uid,
                                    name: doc.data().name
                                  }
                                );
                            })
                        .catch(err => {
                            console.log('Error getting documents', err);
                        });
                }
                this.state.friends = outputList
                console.log(this.state.friends)
            } else {
                this.props.showToast(0, 'User info not available')
            }
        }
    });
}

  getListUser = async () => {
    const res = await myFirestore
      .collection("messages")
      .where("users", "array-contains", this.data.ID)
      .get();
    // const chatNames=res.data().chatId
    console.log(res);
    // if(!friends.length)return;
    // const result = await myFirestore.collection("users").where("uid","in",friends).get()
    if (res.docs.length > 0) {
      this.listUser = [...res.docs];
      this.setState({ isLoading: false });
    }
  };

  onLogoutClick = () => {
    this.setState({
      isOpenDialogConfirmLogout: true,
    });
  };

  doLogout = () => {
    this.setState({ isLoading: true });
    myFirebase
      .auth()
      .signOut()
      .then(() => {
        this.setState({ isLoading: false }, () => {
          localStorage.clear();
          this.props.showToast(1, "Logout success");
          this.props.history.push("/components/innerPages/LoginPage2");
        });
      })
      .catch(function (err) {
        this.setState({ isLoading: false });
        this.props.showToast(0, err.message);
      });
  };

  hideDialogConfirmLogout = () => {
    this.setState({
      isOpenDialogConfirmLogout: false,
    });
  };

  createRoom = async () => {
    var roomName = document.getElementById('chatId').value;
    var photoURL= document.getElementById('photoURL').value
    this.state.selectPeopleId.push(this.data.ID)
    var chatUsers = this.state.selectPeopleId
    var chatCats = this.state.selectCategories
    console.log(chatCats)
    console.log(chatUsers)
    var timestamp = moment().valueOf().toString();
    const result2 = await myFirestore
      .collection("messages")
      .where("chatId", "==", roomName)
      .get();
    if (result2.docs.length == 0) {
      const db = firebase.firestore();

      var doc = await firebase
        .firestore()
        .collection("users")
        .doc(this.data.ID)
        .get();
      var friends2 = doc.data().friends;
      const userRef = db
        .collection("messages")
        .doc(roomName)
        .set({
          hostId: this.data.ID,
          users: chatUsers,
          messages: [
            {
              content: "A new chat!",
              timestamp: timestamp,
              type: 0,
              idFrom: this.data.ID,
              photo: photoURL,
              nickname: this.data.NICKNAME,
            },
          ],
          chatId: roomName,
          categories: chatCats,
          photoURL: photoURL
        })
        .then(() => {
          console.log("Document successfully written!");
        })
        .catch((error) => {
          console.error("Error writing document: ", error);
        });
      this.state.selectPeopleId = []
      this.state.selectCategories = []
      this.getListUser();
      this.renderListUser();
      this.onCloseModal();
    } else {
      alert("Name already exists!");
    }
  };

  onProfileClick = () => {
    this.props.history.push("/Profile/");
  };

  handleModalShowHide() {
    this.setState({ showHide: !this.state.showHide });
  }

  renderListUser = () => {
    if (this.listUser.length > 0) {
      console.log(this.listUser);
      let viewListUser = [];
      this.listUser.forEach((item, index) => {
        console.log(item.data());
        if (item.data().id !== this.data.ID) {
          viewListUser.push(
            <button
              key={index}
              className={
                this.state.currentPeerUser &&
                this.state.currentPeerUser.id === item.data().id
                  ? "viewWrapItemFocused"
                  : "viewWrapItem"
              }
              onClick={() => {
                this.setState({ currentPeerUser: item.data() });
              }}
            >
              <img
                className="viewAvatarItem"
                src={item.data().messages.slice(-1)[0].photo}
                alt="icon avatar"
              />
              <div className="viewWrapContentItem">
                <span className="textItem">{`Chat Name: ${
                  item.data().chatId
                }`}</span>
                <span className="textItem">{`Users: ${
                  item.data().users.length ? item.data().users.length : "Not available"
                }`}</span>
              </div>
            </button>
          );
        }
      });
      return viewListUser;
    } else {
      return null;
    }
  };

  friendsNull = () => {
    if (this.state.friends == null) {
      return true;
    } else {
      return false;
    }
  };
  renderDialogConfirmLogout = () => {
    return (
      <div>
        <div className="viewWrapTextDialogConfirmLogout">
          <span className="titleDialogConfirmLogout">
            Are you sure to logout?
          </span>
        </div>
        <div className="viewWrapButtonDialogConfirmLogout">
          <button className="btnYes" onClick={this.doLogout}>
            YES
          </button>
          <button className="btnNo" onClick={this.hideDialogConfirmLogout}>
            CANCEL
          </button>
        </div>
      </div>
    );
  };
  renderDialogConfirmLogout = () => {
    return (
      <div>
        <div className="viewWrapTextDialogConfirmLogout">
          <span className="titleDialogConfirmLogout">
            Are you sure to logout?
          </span>
        </div>
        <div className="viewWrapButtonDialogConfirmLogout">
          <button className="btnYes" onClick={this.doLogout}>
            YES
          </button>
          <button className="btnNo" onClick={this.hideDialogConfirmLogout}>
            CANCEL
          </button>
        </div>
      </div>
    );
  };
  onOpenModal = () => {
    this.setState({ open: true });
  };

  onCloseModal = () => {
    this.setState({ open: false });
  };
  
  onSelect = (selectedList, selectedItem) => {
      this.state.selectPeopleId.push(selectedItem.id)
  }
  onSelect2 = (selectedList, selectedItem) => {
    this.state.selectCategories = selectedList
  }
  onRemove = (selectedList, removedItem) => {
    console.log("here")
    var temp = []
    for (var i = 0; i < selectedList.length; i++) {
      console.log(selectedList);
      temp.push(selectedList[i].id)
  }
  this.state.selectPeopleId = temp
    // this.state.selectPeopleId = this.state.selectPeopleId.filter(function(item) {
    //   return item !== index
    // })
  }
  onRemove2 = (selectedList, removedItem) => {
    this.state.selectCategories = selectedList
  }

  render() {
    const { open } = this.state;
    return (
      <div className="root">
        {/* Header */}
        {<Head />}
        {/* Body */}
        {/* <div>
                    <AddRoom/>
                </div> */}

        <div className="body">
          <div className="viewListUser">
          <button onClick={this.onOpenModal}>Create a New Chat</button>
            <Modal open={open} 
            onClose={this.onCloseModal}
            center
            classNames={{
              overlay: 'customOverlay',
              modal: 'customModal',
            }}
            >
              <h2>Create a New Chat!</h2>
              <form>
                <p>
                    Chat Name
                    <input type="text" id="chatId" />
                </p>
                <p>
                  Photo URL
                  <input type="text" id="photoURL" />
                </p>
                Friends
                <Multiselect options={this.state.friends} displayValue="name" id ="chatUsers" onSelect={this.onSelect} onRemove={this.onRemove}/>
                Categories
                <Multiselect options={this.state.categories} isObject={false} onSelect={this.onSelect2} onRemove={this.onRemove2}/>
                <button type = "button" aria-label="new-room" onClick={this.createRoom}> Create Chat </button>
              </form>
            </Modal>
            {/* <button aria-label="new-room" onClick={this.createRoom}>
              New Chat
            </button> */}
            {this.renderListUser()}
          </div>
          <div className="viewBoard">
            {this.state.currentPeerUser ? (
              <ChatBoard
                currentPeerUser={this.state.currentPeerUser}
                currentUserAvatar={this.currentUserAvatar}
                currentUserNickname={this.currentUserNickname}
                friends={this.state.friends}
                showToast={this.props.showToast}
              />
            ) : (
              <WelcomeBoard
                currentUserNickname={this.currentUserNickname}
                currentUserAvatar={this.currentUserAvatar}
              />
            )}
          </div>
        </div>

        {/* Dialog confirm */}
        {this.state.isOpenDialogConfirmLogout ? (
          <div className="viewCoverScreen">
            {this.renderDialogConfirmLogout()}
          </div>
        ) : null}

        {/* Loading */}
        {this.state.isLoading ? (
          <div className="viewLoading">
            <ReactLoading
              type={"spin"}
              color={"#203152"}
              height={"3%"}
              width={"3%"}
            />
          </div>
        ) : null}
      </div>
    );
  }

  renderDialogConfirmLogout = () => {
    return (
      <div>
        <div className="viewWrapTextDialogConfirmLogout">
          <span className="titleDialogConfirmLogout">
            Are you sure to logout?
          </span>
        </div>
        <div className="viewWrapButtonDialogConfirmLogout">
          <button className="btnYes" onClick={this.doLogout}>
            YES
          </button>
          <button className="btnNo" onClick={this.hideDialogConfirmLogout}>
            CANCEL
          </button>
        </div>
      </div>
    );
  };
}

export default withRouter(Main);
