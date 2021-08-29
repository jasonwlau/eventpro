import "tailwindcss/dist/base.css";
import "styles/globalStyles.css";
import React,{Component} from "react";
import Main from './src2/Component/Main/Main'
import Login from './login/config/Login'
import Profile from './src2/Component/Profile/Profile'
import { css } from "styled-components/macro"; //eslint-disable-line
import {toast, ToastContainer} from 'react-toastify'
import Feed from "pages/Feed"
/*
 * This is the entry point component of this project. You can change the below exported default App component to any of
 * the prebuilt landing page components by uncommenting their import and export lines respectively.
 * See one of the landing page components to better understand how to import and render different components (Always
 * make sure if you are building your own page, the root component should be the AnimationRevealPage component. You can
 * disable the animation by using the disabled prop.
 *
 * The App component below is using React router to render the landing page that you see on the live demo website
 * and the component previews.
 *
 */

/* Use AnimationRevealPage as a wrapper component for your pages if you are custom building it */
// import AnimationRevealPage from "helpers/AnimationRevealPage.js";

/*
 * Hero section is the top most section on the page. It contains the header as well.
 * So you dont need to import headers
 * separately
 */

// import Hero from "components/hero/TwoColumnWithVideo.js";
// import Hero from "components/hero/TwoColumnWithInput.js";
// import Hero from "components/hero/TwoColumnWithFeaturesAndTestimonial.js";
// import Hero from "components/hero/TwoColumnWithPrimaryBackground.js";
// import Hero from "components/hero/FullWidthWithImage.js";
// import Hero from "components/hero/BackgroundAsImage.js";
// import Hero from "components/hero/BackgroundAsImageWithCenteredContent.js";

// import Features from "components/features/ThreeColSimple.js";
// import Features from "components/features/ThreeColWithSideImage.js";
// import Features from "components/features/ThreeColWithSideImageWithPrimaryBackground.js";
// import Features from "components/features/VerticalWithAlternateImageAndText.js";
// import Features from "components/features/DashedBorderSixFeatures";
// import MainFeature from "components/features/TwoColWithButton.js";
// import MainFeature from "components/features/TwoColSingleFeatureWithStats.js";
// import MainFeature2 from "components/features/TwoColSingleFeatureWithStats2.js";
// import MainFeature from "components/features/TwoColWithTwoHorizontalFeaturesAndButton.js";
// import FeatureWithSteps from "components/features/TwoColWithSteps.js";
// import FeatureStats from "components/features/ThreeColCenteredStatsPrimaryBackground.js";

// import Pricing from "components/pricing/ThreePlans.js";
// import Pricing from "components/pricing/ThreePlansWithHalfPrimaryBackground.js";
// import Pricing from "components/pricing/TwoPlansWithDurationSwitcher.js";

// import SliderCard from "components/cards/ThreeColSlider.js";
// import TrendingCard from "components/cards/TwoTrendingPreviewCardsWithImage.js";
// import Portfolio from "components/cards/PortfolioTwoCardsWithImage.js";
// import TabGrid from "components/cards/TabCardGrid.js";

// import Blog from "components/blogs/ThreeColSimpleWithImage.js";
// import Blog from "components/blogs/ThreeColSimpleWithImageAndDashedBorder.js";
// import Blog from "components/blogs/PopularAndRecentBlogPosts.js";
// import Blog from "components/blogs/GridWithFeaturedPost.js";

// import Testimonial from "components/testimonials/TwoColumnWithImage.js";
// import Testimonial from "components/testimonials/TwoColumnWithImageAndProfilePictureReview.js";
// import Testimonial from "components/testimonials/TwoColumnWithImageAndRating.js";
// import Testimonial from "components/testimonials/ThreeColumnWithProfileImage.js";
// import Testimonial from "components/testimonials/SimplePrimaryBackground.js";

// import FAQ from "components/faqs/SimpleWithSideImage.js";
// import FAQ from "components/faqs/SingleCol.js";
// import FAQ from "components/faqs/TwoColumnPrimaryBackground.js";

// import ContactUsForm from "components/forms/SimpleContactUs.js";
// import ContactUsForm from "components/forms/TwoColContactUsWithIllustration.js";
// import SubscribeNewsLetterForm from "components/forms/SimpleSubscribeNewsletter.js";
//
// import GetStarted from "components/cta/GetStarted.js";
// import GetStarted from "components/cta/GetStartedLight.js";
// import DownloadApp from "components/cta/DownloadApp.js";

// import Footer from "components/footers/SimpleFiveColumn.js";
// import Footer from "components/footers/FiveColumnWithInputForm.js";
// import Footer from "components/footers/FiveColumnWithBackground.js";
// import Footer from "components/footers/FiveColumnDark.js";
// import Footer from "components/footers/MiniCenteredFooter.js";

/* Ready Made Pages (from demos folder) */
// import EventLandingPage from "demos/EventLandingPage.js";
// import HotelTravelLandingPage from "demos/HotelTravelLandingPage.js";
// import AgencyLandingPage from "demos/AgencyLandingPage.js";
// import SaaSProductLandingPage from "demos/SaaSProductLandingPage.js";
// import RestaurantLandingPage from "demos/RestaurantLandingPage.js";
// import ServiceLandingPage from "demos/ServiceLandingPage.js";
// import HostingCloudLandingPage from "demos/HostingCloudLandingPage.js";

/* Inner Pages */
// import LoginPage from "pages/Login.js";
// import SignupPage from "pages/Signup.js";
// import PricingPage from "pages/Pricing.js";
// import AboutUsPage from "pages/AboutUs.js";
// import ContactUsPage from "pages/ContactUs.js";
// import BlogIndexPage from "pages/BlogIndex.js";
// import TermsOfServicePage from "pages/TermsOfService.js";
// import PrivacyPolicyPage from "pages/PrivacyPolicy.js";

import Login2 from "./pages/Login"
import ComponentRenderer from "ComponentRenderer.js";
import SuggestionRendered from "SuggestionRendered.js"
import MeetingRenderer from "MeetingRenderer.js";
import MainLandingPage from "MainLandingPage.js";
import ProfileRenderer from "ProfileRenderer.js";
import RequestRenderer from "RequestRenderer.js";
import JoinGroupRenderer from "joinGroupRenderer.js";
import { firebase } from "./backend/config";
import Welcome from 'react-welcome-page'
import Stats from './pages/Stats'

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import NotificationPage from "pages/NotificationPage";

export default class App extends Component{
  // return <AnimationRevealPage disabled></AnimationRevealPage>;
  showToast = (type, message) => {
    // 0 = warning, 1 = success
    switch (type) {
        case 0:
            toast.warning(message)
            break
        case 1:
            toast.success(message)
            break
        default:
            break
    }
  }
  
  render()
  {
    
    return (
      
    <Router>
      
      <Switch>
        <Route path="/Suggestion/:groupID">
          <SuggestionRendered/>
        </Route>
        <Route path="/login2">
          <Login2 />
        </Route>
        <Route path="/Profile/feed">
          <Feed/>
        </Route>
        <Route path="/Profile/:id">
          <ProfileRenderer/>
        </Route>
        <Route path="/Meeting/:type/:id">
          <MeetingRenderer/>
        </Route>
        <Route path="/components/:type/Meeting/:id">
          <MeetingRenderer />
        </Route>
        <Route path="/components/:type/:subtype/:name">
          <ComponentRenderer />
        </Route>
        <Route path="/components/:type/:name">
          <ComponentRenderer />
        </Route>
        <Route path="/notifications">
          <NotificationPage />
        </Route>
        <Route path="/request/:sender/:receiver">
          <RequestRenderer />
        </Route>
        <Route path="/joinGroup/:sender/:chatId">
          <JoinGroupRenderer/>
        </Route>
        <Route path="/stats/:groupID">
          <Stats/>
        </Route>

        <Route
              path="/chatlogin"
              render={props => <Login showToast={this.showToast} {...this.props} />}
          />
          <Route
              exact
              path="/main"
              render={props => <Main showToast={this.showToast} {...this.props} />}
          />
          
           <Route
              exact
              path="/">
                              <Welcome
		loopDuration={1000}
                  data={[
                  {
                  image: require('./src2/images/mimi4.gif'),
                  text: 'Proevento',
                  imageAnimation: "flipInX",
                  textAnimation: 'bounce',
                  backgroundColor: '#6619b7',
                  textColor: '#002134'
                  },
                  {
                    image: require('./src2/images/mimi2.gif'),
                    textAnimation: "slideInLeft",
                    imageAnimation: "slideInUp",
                    backgroundColor: '#6639b8',
                    text: 'From USC Students',
                  },
                  {
                    image: require('./src2/images/mimi5.gif'),
                    text: 'Ready to Meet Up?',
                    imageAnimation: "flipInX",
                    backgroundColor: '#6415ff',
                    textAnimation: 'fadeInDown'
                  }
                ]}
              />
                  <Login2 />
            </Route>
          <Route
              exact
              path="/profile"
              render={props => (
                  <Profile showToast={this.showToast} {...this.props} />
              )}
          />
      </Switch>
    </Router>

  );
              }
}

// export default EventLandingPage;
// export default HotelTravelLandingPage;
// export default AgencyLandingPage;
// export default SaaSProductLandingPage;
// export default RestaurantLandingPage;
// export default ServiceLandingPage;
// export default HostingCloudLandingPage;

// export default LoginPage;
// export default SignupPage;
// export default PricingPage;
// export default AboutUsPage;
// export default ContactUsPage;
// export default BlogIndexPage;
// export default TermsOfServicePage;
// export default PrivacyPolicyPage;

// export default MainLandingPage;
