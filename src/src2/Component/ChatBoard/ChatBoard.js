import moment from 'moment'
import React, {Component} from 'react'
import ReactLoading from 'react-loading'
import 'react-toastify/dist/ReactToastify.css'
import {myFirebase, myFirestore, myStorage} from '../../Config/MyFirebase'
import images from '../Themes/Images'
import './ChatBoard.css'
import {AppString} from './../Const'
import firebase from "firebase"
import { Modal } from "react-responsive-modal";
import { Multiselect } from "multiselect-react-dropdown";


export default class ChatBoard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            isShowSticker: false,
            inputValue: '',
            open: false,
            open2: false, 
            selectFriend: null,
            time: null,
            day: null
        }
        this.currentUserId = myFirebase.auth().currentUser.uid
        this.currentUserAvatar =this.props.currentUserAvatar
        this.currentUserNickname = this.props.currentUserNickname
        this.friends = this.props.friends
        this.listMessage = []
        this.currentPeerUser = this.props.currentPeerUser
        this.groupChatId = null
        this.hostId = null
        this.removeListener = null
        this.currentPhotoFile = null
        this.photoUrl2 = ''
    }

    componentDidUpdate() {
        this.scrollToBottom()
    }

    componentDidMount() {
        // For first render, it's not go through componentWillReceiveProps
        this.getListHistory()
    }

    componentWillUnmount() {
        if (this.removeListener) {
            this.removeListener()
        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps.currentPeerUser) {
            this.currentPeerUser = newProps.currentPeerUser
            this.getListHistory()
        }
    }
    

    getListHistory = () => {
        if (this.removeListener) {
            this.removeListener()
        }
        this.listMessage.length = 0
        this.setState({isLoading: true})
        this.groupChatId = this.currentPeerUser.chatId
        this.hostId = this.currentPeerUser.hostId
        console.log(this.hostId)
        // Get history and listen new data added
        this.removeListener = myFirestore
            .collection(AppString.NODE_MESSAGES)
            .doc(this.groupChatId)
            // .onSnapshot({
            //     // Listen for document metadata changes
            //     includeMetadataChanges: true
            // }, (doc) => {
            //     // ...
            //     this.setState({isLoading: false})
            // },
            .onSnapshot(snapshot => {
                console.log(snapshot.data())
                console.log(snapshot.data().messages)
                this.listMessage = snapshot.data().messages
                console.log(this.listMessage)
                
                this.setState({isLoading: false})
            },
                err => {
                    this.props.showToast(0, err.toString())
                }
            )
    }

    openListSticker = () => {
        this.setState({isShowSticker: !this.state.isShowSticker})
    }

    onSendMessage = (content, type) => {
        if (this.state.isShowSticker && type === 2) {
            this.setState({isShowSticker: false})
        }

        if (content.trim() === '') {
            return
        }

        const timestamp = moment()
            .valueOf()
            .toString()
        console.log(this.currentUserId)
        console.log(this.currentUserNickname)
        var message = {
            content: content.trim(),
            timestamp: timestamp,
            type: type,
            idFrom: this.currentUserId,
            photo: this.currentUserAvatar,
            name: this.currentUserNickname
        }
        firebase.firestore().collection('messages').doc(this.groupChatId).update({
            messages: firebase.firestore.FieldValue.arrayUnion(message)
        })
        this.setState({inputValue: ''})
        // .catch(err => {
        //     this.props.showToast(0, err.toString())
        // })
    }

    onChoosePhoto = event => {
        if (event.target.files && event.target.files[0]) {
            this.setState({isLoading: true})
            this.currentPhotoFile = event.target.files[0]
            // Check this file is an image?
            const prefixFiletype = event.target.files[0].type.toString()
            if (prefixFiletype.indexOf(AppString.PREFIX_IMAGE) === 0) {
                this.uploadPhoto()
            } else {
                this.setState({isLoading: false})
                this.props.showToast(0, 'This file is not an image')
            }
        } else {
            this.setState({isLoading: false})
        }
    }

    uploadPhoto = () => {
        if (this.currentPhotoFile) {
            const timestamp = moment()
                .valueOf()
                .toString()

            const uploadTask = myStorage
                .ref()
                .child(timestamp)
                .put(this.currentPhotoFile)

            uploadTask.on(
                AppString.UPLOAD_CHANGED,
                null,
                err => {
                    this.setState({isLoading: false})
                    this.props.showToast(0, err.message)
                },
                () => {
                    uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
                        this.setState({isLoading: false})
                        this.onSendMessage(downloadURL, 1)
                    })
                }
            )
        } else {
            this.setState({isLoading: false})
            this.props.showToast(0, 'File is null')
        }
    }

    onKeyboardPress = event => {
        if (event.key === 'Enter') {
            if(this.state.inputValue != '') {
                this.onSendMessage(this.state.inputValue, 0)
            }
        }
    }

    scrollToBottom = () => {
        if (this.messagesEnd) {
            this.messagesEnd.scrollIntoView({})
        }
    }

    isHost = () => {
        console.log(this.currentUserId)
        console.log(this.hostId)
        if(this.currentUserId == this.hostId) {
            return true;
        }
        else {
            return false;
        }
    }

    onOpenModal = () => {
    this.setState({ open: true });
    };
    
      onCloseModal = () => {
    this.setState({ open: false });
    };
    
    onOpenModal2 = () => {
        this.setState({ open2: true });
        };
        
          onCloseModal2 = () => {
        this.setState({ open2: false });
        };
    
    onSelect = (selectedList, selectedItem) => {
        this.state.selectFriend = selectedItem.id
    }
    handleChange = (e) => {
        this.setState({
          [e.target.name]: e.target.value,
        });
      }

    addFriend = async () => {
        const chat = await myFirestore
            .collection("messages")
            .doc(this.groupChatId).get()
        const users = chat.data().users
        console.log(users)
        console.log(this.state.selectFriend)
        var n = users.includes(this.state.selectFriend)
        if (!n) {
            if(this.state.selectFriend==null)return
            firebase.firestore().collection('messages').doc(this.groupChatId).update({
                users: firebase.firestore.FieldValue.arrayUnion(this.state.selectFriend)
            })
            var notiObject = {
                msg: 'You were added to the group' + this.groupChatId,
                url: 'http://localhost:3000/main',
            };
            let l =
              "https://api.ravenhub.io/company/7RSvlrMSZE/subscribers/" +
              this.state.selectFriend +
              "/events/QqPrWQdgBS";
            fetch(l, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(notiObject),
            }).then((response) => {
                console.log(response)
                alert("user added")
                this.state.selectFriend = null
            })   
        }
        else {
            alert("Already in this chat!")
        }     
        
    }

    changeDeadline = async () => {
        firebase.firestore().collection('messages').doc(this.groupChatId).update({
            voteDeadline: this.state.time
        })
        this.onCloseModal2();
    }

    render() {
        const { open, open2 } = this.state;
        return (
            <div className="viewChatBoard">
                {/* Header */}
                <div className="headerChatBoard">
                  {/*}  <img
                        className="viewAvatarItem"
                        src={this.listMessage.slice(-1)[0].photo}
                        alt="icon avatar"
                    /> */}
                    <span className="textHeaderChatBoard">
            {this.currentPeerUser.nickname}
          </span>
                </div>

                {/* List message */}
                <div className="viewListContentChat">
                    {this.renderListMessage()}
                    <div
                        style={{float: 'left', clear: 'both'}}
                        ref={el => {
                            this.messagesEnd = el
                        }}
                    />
                </div>

                {/* Stickers */}
                {this.state.isShowSticker ? this.renderStickers() : null}

                {/* View bottom */}
                <div className="viewBottom">
                <img
                        className="icAddFriend"
                        src={images.ic_default_avatar}
                        alt="icon add friend"
                        onClick={this.onOpenModal}
                    />
                    <Modal open={open} 
                        onClose={this.onCloseModal}
                        center
                        classNames={{
                        overlay: 'customOverlay',
                        modal: 'customModal',
                        }}
                        >
                        <h2>Add a Friend!</h2>
                        <form>
                            Friend
                            <Multiselect options={this.friends} singleSelect displayValue="name" id ="chatUsers" onSelect={this.onSelect}/>
                            <button type = "button" aria-label="new-room" onClick={this.addFriend}> Add friend </button>
                        </form>
                    </Modal>
                        <Modal open={open2} 
                            onClose={this.onCloseModal2}
                            center
                            classNames={{
                            overlay: 'customOverlay',
                            modal: 'customModal',
                            }}
                            >
                            <h2>Select Voting Deadline</h2>
                            <form>
                            <input
                                type="datetime-local"
                                id="time"
                                data-testid="time"
                                name="time"
                                placeholder="Enter Time"
                                onChange={this.handleChange}
                                value={this.state.time}
                                required
                            />
                            <div></div>
                            <button type = "button" aria-label="new-room" onClick={this.changeDeadline}> Save Settings </button>
                            </form>
                        </Modal>
                    <img
                        className="icOpenGallery"
                        src={images.ic_photo}
                        alt="icon open gallery"
                        onClick={() => this.refInput.click()}
                    />
                    <input
                        ref={el => {
                            this.refInput = el
                        }}
                        accept="image/*"
                        className="viewInputGallery"
                        type="file"
                        onChange={this.onChoosePhoto}
                    />

                    <img
                        className="icOpenSticker"
                        src={images.ic_sticker}
                        alt="icon open sticker"
                        onClick={this.openListSticker}
                    />
                    {this.isHost() ? (
                                    <img
                                    className="icAddFriend"
                                    src={images.ic_custom}
                                    alt="icon add friend"
                                    onClick={this.onOpenModal2}
                                />
                                
                                ) :  null}

                    <input
                        className="viewInput"
                        placeholder="Type your message..."
                        value={this.state.inputValue}
                        onChange={event => {
                            this.setState({inputValue: event.target.value})
                        }}
                        onKeyPress={this.onKeyboardPress}
                    />
                    <img
                        className="icSend"
                        src={images.ic_send}
                        alt="icon send"
                        onClick={() => this.onSendMessage(this.state.inputValue, 0)}
                    />
                </div>

                {/* Loading */}
                {this.state.isLoading ? (
                    <div className="viewLoading">
                        <ReactLoading
                            type={'spin'}
                            color={'#203152'}
                            height={'3%'}
                            width={'3%'}
                        />
                    </div>
                ) : null}
            </div>
        )
    }

    renderListMessage = () => {
        console.log(typeof this.listMessage[0])

        if (this.listMessage.length > 0) {
            let viewListMessage = []
            this.listMessage.forEach((item, index) => {
                if (item.idFrom === this.currentUserId) {
                    // Item right (my message)
                    if (item.type === 0) {
                        viewListMessage.push(
                            <div className="viewItemRight" key={item.timestamp}>
                                <span className="textContentItem">{item.content}</span>
                            </div>
                        )
                    } else if (item.type === 1) {
                        viewListMessage.push(
                            <div className="viewItemRight2" key={item.timestamp}>
                                <img
                                    className="imgItemRight"
                                    src={item.content}
                                    alt="content message"
                                />
                            </div>
                        )
                    } else {
                        viewListMessage.push(
                            <div className="viewItemRight3" key={item.timestamp}>
                                <img
                                    className="imgItemRight"
                                    src={this.getGifImage(item.content)}
                                    alt="content message"
                                />
                            </div>
                        )
                    }
                } else {
                    
                    if (item.type === 0) {
                        viewListMessage.push(
                            <div className="viewWrapItemLeft" key={item.timestamp}>
                                <div className="viewWrapItemLeft3">
                                    {this.isLastMessageLeft(index) ? (
                                        <img
                                            src={item.photo}
                                            alt="avatar"
                                            className="peerAvatarLeft"
                                        />
                                    ) : (
                                        <div className="viewPaddingLeft"/>
                                    )}
                                    <div className="viewItemLeft">
                                        <span className="textContentItem">{item.content}</span>
                                    </div>
                                </div>
                                {this.isLastMessageLeft(index) ? (
                                    <span className="textTimeLeft">
                    {item.name + " "}{moment(Number(item.timestamp)).format('ll')}
                  </span>
                                ) : <span className="textTimeLeft">{item.name + " "}</span>}
                            </div>
                        )
                    } else if (item.type === 1) {
                        viewListMessage.push(
                            <div className="viewWrapItemLeft2" key={item.timestamp}>
                                <div className="viewWrapItemLeft3">
                                    {this.isLastMessageLeft(index) ? (
                                        <img
                                            src={item.photo}
                                            alt="avatar"
                                            className="peerAvatarLeft"
                                        />
                                    ) : (
                                        <div className="viewPaddingLeft"/>
                                    )}
                                    <div className="viewItemLeft2">
                                        <img
                                            className="imgItemLeft"
                                            src={item.content}
                                            alt="content message"
                                        />
                                    </div>
                                </div>
                                {this.isLastMessageLeft(index) ? (
                                    <span className="textTimeLeft">
                    {item.name + " "}{moment(Number(item.timestamp)).format('ll')}
                  </span>
                                ) :  <span className="textTimeLeft">{item.name + " "}</span>}
                            </div>
                        )
                    } else {
                        viewListMessage.push(
                            <div className="viewWrapItemLeft2" key={item.timestamp}>
                                <div className="viewWrapItemLeft3">
                                    {this.isLastMessageLeft(index) ? (
                                        <img
                                            src={item.photo}
                                            alt="avatar"
                                            className="peerAvatarLeft"
                                        />
                                    ) : (
                                        <div className="viewPaddingLeft"/>
                                    )}
                                    <div className="viewItemLeft3" key={item.timestamp}>
                                        <img
                                            className="imgItemLeft"
                                            src={this.getGifImage(item.content)}
                                            alt="content message"
                                        />
                                    </div>
                                </div>
                                {this.isLastMessageLeft(index) ? (
                                    <span className="textTimeLeft">
                    {item.name + " "}{moment(Number(item.timestamp)).format('ll')}
                  </span>
                                ) : <span className="textTimeLeft">{item.name + " "}</span>}
                            </div>
                        )
                    }
                }
            })
            return viewListMessage
        } else {
            return (
                <div className="viewWrapSayHi">
                    <span className="textSayHi">Say hi to new friend</span>
                    <img
                        className="imgWaveHand"
                        src={images.ic_wave_hand}
                        alt="wave hand"
                    />
                </div>
            )
        }
    }

    renderStickers = () => {
        return (
            <div className="viewStickers">
                <img
                    className="imgSticker"
                    src={images.mimi1}
                    alt="sticker"
                    onClick={() => this.onSendMessage('mimi1', 2)}
                />
                <img
                    className="imgSticker"
                    src={images.mimi2}
                    alt="sticker"
                    onClick={() => this.onSendMessage('mimi2', 2)}
                />
                <img
                    className="imgSticker"
                    src={images.mimi3}
                    alt="sticker"
                    onClick={() => this.onSendMessage('mimi3', 2)}
                />
                <img
                    className="imgSticker"
                    src={images.mimi4}
                    alt="sticker"
                    onClick={() => this.onSendMessage('mimi4', 2)}
                />
                <img
                    className="imgSticker"
                    src={images.mimi5}
                    alt="sticker"
                    onClick={() => this.onSendMessage('mimi5', 2)}
                />
                <img
                    className="imgSticker"
                    src={images.mimi6}
                    alt="sticker"
                    onClick={() => this.onSendMessage('mimi6', 2)}
                />
                <img
                    className="imgSticker"
                    src={images.mimi7}
                    alt="sticker"
                    onClick={() => this.onSendMessage('mimi7', 2)}
                />
                <img
                    className="imgSticker"
                    src={images.mimi8}
                    alt="sticker"
                    onClick={() => this.onSendMessage('mimi8', 2)}
                />
                <img
                    className="imgSticker"
                    src={images.mimi9}
                    alt="sticker"
                    onClick={() => this.onSendMessage('mimi9', 2)}
                />
            </div>
        )
    }

    hashString = str => {
        let hash = 7;
        for (let i = 0; i < str.length; i++) {
            hash = hash*31 + str.charCodeAt(i);
        }
        return hash
    }

    getGifImage = value => {
        switch (value) {
            case 'mimi1':
                return images.mimi1
            case 'mimi2':
                return images.mimi2
            case 'mimi3':
                return images.mimi3
            case 'mimi4':
                return images.mimi4
            case 'mimi5':
                return images.mimi5
            case 'mimi6':
                return images.mimi6
            case 'mimi7':
                return images.mimi7
            case 'mimi8':
                return images.mimi8
            case 'mimi9':
                return images.mimi9
            default:
                return null
        }
    }

    isLastMessageLeft(index) {
        if (
            (index + 1 < this.listMessage.length &&
                this.listMessage[index + 1].idFrom === this.currentUserId) ||
            index === this.listMessage.length - 1
        ) {
            return true
        } else {
            return false
        }
    }

    isLastMessageRight(index) {
        if (
            (index + 1 < this.listMessage.length &&
                this.listMessage[index + 1].idFrom !== this.currentUserId) ||
            index === this.listMessage.length - 1
        ) {
            return true
        } else {
            return false
        }
    }
}
