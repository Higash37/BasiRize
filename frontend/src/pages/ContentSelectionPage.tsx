import {useLocation} from "react-router-dom";

function ContentSelectionPage(){
    const location = useLocation();
    const level = location.state?.level;

    return (
        <div>
            <h1>内容を選んでください({level})</h1>
        </div>
    )
}

export default ContentSelectionPage