import React, {Component, useState} from 'react'
import ReactLoading from 'react-loading'
import {withRouter} from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'
import firebase from "firebase";
import images from './../Themes/Images';
import './Group.css';

let groupCats = firebase.firestore().collection('categories');
let groupCatsList = [];

class Group extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            description: '',
            photoURL: '',
            selCategories: [''],
            checked: false
        }
    }

    showCats = () => {
      groupCats.get()
      .then(querySnapshot => {
        querySnapshot.docs.forEach(
          doc => {
            groupCatsList.push(doc.data())
          }
        )
      });
      console.log("categories loaded: ", groupCatsList);
      console.log("categories loaded? ", groupCatsList.length);
      const newList = [...groupCatsList];

      return (
        <div>
          {groupCatsList.slice(0, 4).map((item, index) => (
            <div>
              <input type="checkbox" id={"opt"+index}/>
              <label key = {index} htmlFor={"opt"+index}>{item.name}</label>
              {//{console.log(index)}
              }
              <p>&emsp;</p>
            </div>
          ))}
        </div>
      );

    }

    onChangeName = event => {
        this.setState({name: event.target.value})
    }

    onChangeDescription = event => {
        this.setState({description: event.target.value})
    }

    onChangeLogo = event => {
        if (event.target.files && event.target.files[0]) {
           const prefixFiletype = event.target.files[0].type.toString()
           this.setState({photoURL: URL.createObjectURL(event.target.files[0])})
           } else {
          this.props.showToast(0, 'Something wrong with input file')
          }
    }
    onSelCategories = event => {

    }

    uploadAvatar = () => {
      this.addEvent();
      var modal = document.getElementById("modal");
      var btn = document.getElementById("modalBtn");
      var span = document.getElementsByClassName("close")[0];

      modal.style.display = "block";

    }

    updateUserInfo = (isUpdatePhotoUrl, downloadURL) => {

    }

    addEvent = () => {
      firebase.firestore().collection("groups").add({
        name: this.state.name,
        description: this.state.description,
        photoURL: this.state.photoURL,
        members: [],
        categories: [],
        creator: firebase.firestore().collection("users").doc(firebase.auth().currentUser.id)
      })
      .catch((error) => {
        console.error("Error adding group: ", error);
      });

    }


    render() {
        return (
            <div className="root">
                <div className="header">
                    <span>CREATE A GROUP</span>
                </div>
                <div className = "groupFormContainer">
                  <h6 style={{fontSize:'large', fontWeight:'bold'}}>Fill out this information to create a user group. </h6>

                  <div className = "groupName">
                    <br/>
                    <p><span style={{color:'red'}}>*</span> Name of group: </p>
                    <input
                        style={{width:'30%'}}
                        className="textInput"
                        value={this.state.name ? this.state.name : ''}
                        placeholder="Group name..."
                        onChange={this.onChangeName}
                        required
                    />
                  </div>
                  <div className = "groupCategories">
                    <br/>
                    <p>Select categories for your group:<br/>
                      </p>
                      <div>{this.showCats()}</div>
                  </div>
                  <div className = "groupDescription">
                    <br/>
                    <p><span style={{color:'red'}}>*</span> Describe your group briefly: </p>
                    <textarea
                        className="textInput"
                        value={this.state.description ? this.state.description : ''}
                        placeholder="Group description..."
                        onChange={this.onChangeDescription}
                        required
                    />
                  </div>
                  <div className = "groupImg">
                    <br/>
                    <p>Upload an image to be your group icon: </p>
                    <div className="viewWrapInputFile">
                        <img
                            className="imgInputFile"
                            alt="icon gallery"
                            src={images.ic_input_file}
                            onClick={() => this.refInput.click()}
                        />
                        <input
                            ref={el => {
                                this.refInput = el
                            }}
                            accept="image/*"
                            className="viewInputFile"
                            type="file"
                            onChange={this.onChangeLogo}
                        />
                    </div>
                  </div>

                  <button id = "modalBtn" className="btnUpdate" onClick={this.uploadAvatar}>
                      CREATE
                  </button>
                  <div id = "modal"class = "modal">
                    <div class="modal-content">

                      <p><span onClick = {() => {
                          document.getElementById('modal').style.display='none';
                          this.setState({
                              name: '',
                              description: '',
                              photoURL: '',
                              categories: ['']});}
                            }
                          class="close">&times;</span>
                      Group {this.state.name} created.</p>
                    </div>
                  </div>
                </div>

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
}
export default Group
