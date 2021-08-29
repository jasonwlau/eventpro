import Meeting from "pages/Meeting.js";
import MeetingLanding from 'pages/MeetingLanding.js';
import { useParams } from 'react-router-dom';


export default () => {
    const {type,id}=useParams()
  if(type=="landing")return MeetingLanding(id);
  return (
     Meeting(id)
  );
}
