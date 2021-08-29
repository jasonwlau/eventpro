import Suggestion from "pages/Suggestion.js"
import { useParams } from 'react-router-dom';


export default () => {
    const {groupID}=useParams()
    return (
        Suggestion(groupID)
    );
}
