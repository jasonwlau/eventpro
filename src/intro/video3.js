import React from "react";
import VideoPlayer from "react-video-js-player";
import Car from "./Intro3Screen.mp4"
import "./video.css"

const VideoJS = () => {
    
    const videoSrc = Car;
    return (
        <div className="App">
        <VideoPlayer
            src={videoSrc}
            width="720" height="420"
        />

        </div>
    );
}

export default VideoJS;