import Meeting from "pages/Meeting.js";
import MeetingLanding from 'pages/MeetingLanding.js';
import { useParams } from 'react-router-dom';
import Profile from 'pages/AboutUs.js'


export default () => {
    const {id}=useParams()
    return Profile(id);
}
