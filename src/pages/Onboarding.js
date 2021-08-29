import React from "react";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro"; //eslint-disable-line
import { SectionHeading, Subheading as SubheadingBase } from "components/misc/Headings.js";
import { SectionDescription } from "components/misc/Typography.js";
import { PrimaryButton as PrimaryButtonBase } from "components/misc/Buttons.js";
import { Container, ContentWithPaddingXl } from "components/misc/Layouts.js";
import { ReactComponent as SvgDecoratorBlob } from "images/svg-decorator-blob-6.svg";
import firebase from '../Firebase';
import "firebase";
import { getUser } from '../backend/util';

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



class Onboarding extends React.Component{
    constructor()
    {
        super();
        this.state = {
            categories: [],
            selectedCategories: [],
            user: null, 
            userId: ''
        }
    }

    //fetches the categories in the collection
    componentDidMount(){
        const fetchFirebaseAPIs = async () => {
            const events = await firebase.firestore().collection('categories')
    events.get()
    .then(querySnapshot => {
        var categoriesData=[]
        console.log(querySnapshot, "querysnapshot")
        querySnapshot.docs.forEach(
          doc => {
            console.log(doc.data());
            categoriesData.push(doc.data())
          }
        );
        this.setState({categories: categoriesData});
        console.log(categoriesData, "categories data");
    })
    .catch(console.log);
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
            const {userId }  = this.state;
            console.log(usersData, "usrsdata");
            usersData.forEach(user => {
                //console.log(user, "user");

                if(user.uid === userId){
                    this.setState({ user }); //the name is the same so it can directly modify the this.state
                }
            })
        })
        .catch(console.log);
        }
        fetchFirebaseAPIs();
    }

    handleOnChange = (e) => {
        const { user, userId, selectedCategories } = this.state; 
        console.log(selectedCategories, "selected values")
        // Music
        //const { value } = e.target.value;
        //console.log(e.target.options, "options");
        //this.setState({ selectedCategories: value});
        const { name, value } = e.target; // Music

        //push if only if it is not in selected Categories yet
        if (!selectedCategories.includes(value))
        {
            selectedCategories.push(value);
            this.setState({ selectedCategories });
            user.category.push(value);
            const users = firebase.firestore().collection('users');
            users.doc(userId).update(user);        
        }
    }

    buttonHandler = async (history) => {
        window.location.href = "/components/innerPages/Intro1";
    };

    
    render(){
        const { categories, selectedCategories, user } = this.state;
        console.log(user, "user render");
        const subheading = "Welcome!";
        const heading = "Onboarding Screen.";
        const description = "Choose categories of your interest!";
        return (
          <Container>
          <ContentWithPaddingXl>
          <HeaderContainer>
          {subheading && <Subheading>{subheading}</Subheading>}
          <Heading>{heading}</Heading>
          {description && <Description>{description}</Description>}
          </HeaderContainer>

            <div>
                <select multiple={true} name="categories" onChange={this.handleOnChange}>

                {categories.map((category, i) => {
                    return <option value={category.name}>{category.name}</option>
                })}
                </select>

                <div> Seleted Categories: {selectedCategories.map(selectedCategory => {
                    return <span>{selectedCategory}, </span>
                })}</div>

                <button className="nextbutton" onClick={this.buttonHandler}>
                Next
                </button>
            </div>
            </ContentWithPaddingXl>
          </Container>
        )
    }
}

export default Onboarding;