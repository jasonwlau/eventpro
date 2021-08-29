import React from 'react';
import firebase from '../Firebase';
import "firebase";
import "../backend/util"
import { getUser } from '../backend/util';
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro"; //eslint-disable-line
import { SectionHeading, Subheading as SubheadingBase } from "components/misc/Headings.js";
import { SectionDescription } from "components/misc/Typography.js";
import { PrimaryButton as PrimaryButtonBase } from "components/misc/Buttons.js";
import { Container, ContentWithPaddingXl } from "components/misc/Layouts.js";
import { ReactComponent as SvgDecoratorBlob } from "images/svg-decorator-blob-6.svg";
import "./Deactivate.css";


const HeaderContainer = tw.div`mt-10 w-full flex flex-col items-center`;
const Subheading = tw(SubheadingBase)`mb-4`;
const Heading = tw(SectionHeading)`w-full`;
const Description = tw(SectionDescription)`w-full text-center`;

const PlansContainer = tw.div`flex justify-between flex-col lg:flex-row items-center lg:items-stretch relative`;
const Plan = styled.div`
  ${tw`w-full max-w-sm mt-16 lg:mr-8 lg:last:mr-0 text-center px-8 rounded-lg shadow relative pt-2 text-gray-900 bg-white flex flex-col`}
  .planHighlight {
    ${tw`rounded-t-lg absolute top-0 inset-x-0 h-2`}
  }

  ${props =>
    props.featured &&
    css`
      background: rgb(100,21,255);
      background: linear-gradient(135deg, rgba(100,21,255,1) 0%, rgba(128,64,252,1) 100%);
background: rgb(85,60,154);
background: linear-gradient(135deg, rgba(85,60,154,1) 0%, rgba(128,90,213,1) 100%);
background: rgb(76,81,191);
background: linear-gradient(135deg, rgba(76,81,191,1) 0%, rgba(102,126,234,1) 100%);
      ${tw`bg-primary-500 text-gray-100`}
      .planHighlight {
        ${tw`hidden`}
      }
      .duration {
        ${tw`text-gray-200!`}
      }
      ${PlanFeatures} {
        ${tw`border-indigo-500`}
      }
      .feature:not(.mainFeature) {
        ${tw`text-gray-300!`}
      }
      ${BuyNowButton} {
        ${tw`bg-gray-100 text-primary-500 hocus:bg-gray-300 hocus:text-primary-800`}
    `}
`;

const PlanHeader = styled.div`
  ${tw`flex flex-col uppercase leading-relaxed py-8`}
  .name {
    ${tw`font-bold text-xl`}
  }
  .price {
    ${tw`font-bold text-4xl sm:text-5xl my-1`}
  }
  .duration {
    ${tw`text-gray-500 font-bold tracking-widest`}
  }
`;
const PlanFeatures = styled.div`
  ${tw`flex flex-col -mx-8 px-8 py-8 border-t-2 border-b-2 flex-1`}
  .feature {
    ${tw`mt-5 first:mt-0 font-medium`}
    &:not(.mainFeature) {
      ${tw`text-gray-600`}
    }
  }
  .mainFeature {
    ${tw`text-xl font-bold tracking-wide`}
  }
`;

const PlanAction = tw.div`px-4 sm:px-8 xl:px-16 py-8`;
const BuyNowButton = styled(PrimaryButtonBase)`
  ${tw`rounded-full uppercase tracking-wider py-4 w-full text-sm hover:shadow-xl transform hocus:translate-x-px hocus:-translate-y-px focus:shadow-outline`}
`;

const DecoratorBlob = styled(SvgDecoratorBlob)`
  ${tw`pointer-events-none -z-20 absolute left-0 bottom-0 h-64 w-64 opacity-25 transform -translate-x-1/2 translate-y-1/2`}
`;


class Deactivate extends React.Component {
    constructor()
    {
        super();
        this.state = {
            user: null,
            username:'',
            userId: ''
        }
    }

    componentDidMount(){

        const fetchFirebaseAPIs = async () =>
        {

            let userId = '';
            await getUser().then(response => {
                 console.log(response.uid, "uid");
                 userId = response.uid;
             });
             this.setState({userId});

            const users = await firebase.firestore().collection('users')
                users.get()
                .then(querySnapshot => {
                var usersData=[];
                console.log(querySnapshot, "querysnapshot")
                querySnapshot.docs.forEach(
                doc => {
                    usersData.push(doc.data())
                }
                );

                const { userId }  = this.state;
                console.log(usersData, "usrsdata");
                usersData.forEach(user => {
                    if(user.uid === userId){
                        this.setState({ user });
                        var username = user.name;
                        this.setState({ username} );
                    }
                })

            });
        }

        fetchFirebaseAPIs();
    }

    YesHandler = async (history) => {

        let user = null;
        await getUser().then(response => {
            user = response;
        })
        user.delete().then(function() {
            // User deleted.
          }).catch(function(error) {
            // An error happened.
          });

        window.location.href = "/components/innerPages/LoginPage";
    };

    NoHandler = async (history) => {
        window.location.href = "/components/innerPages/BlogIndexPage";
    };


    render(){
        const { user , userId , username} = this.state;
        console.log(user, "user render");
        console.log(username, "username render");
        console.log(userId, "userId render");
        const subheading = "User Name: ";
        const heading = "Are you sure you want to deactivate?";
        const description = "";
        return (
            <Container>
          <ContentWithPaddingXl>
          <HeaderContainer>
          {subheading && <Subheading>{subheading} {username}</Subheading>}
          <Heading>{heading}</Heading>
          {description && <Description>{description}</Description>}
          </HeaderContainer>
            <div align = "center">
                <button className="Yesbutton" onClick={this.YesHandler}>
                Yes
                </button>
                <button className="Nobutton" onClick={this.NoHandler}>
                No
                </button>


            </div>
            </ContentWithPaddingXl>
          </Container>
        )
    }
}

export default Deactivate;