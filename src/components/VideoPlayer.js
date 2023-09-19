import { useCallback, useRef, useState,useEffect } from "react";
import { styled } from "styled-components";
import Volume from "./Volume";

const VideoPlayer = () => {
  const videoRef = useRef();
  const [isPlaying, setisPlaying] = useState(false);

  const setVolume = useCallback((newVolume)=>{
    const volume = newVolume / 100;
    videoRef.current.volume = volume;
  },[]);
  
  const playPause = () => {
    if (isPlaying) {
      setisPlaying(false);
      videoRef.current.pause();
    } else {
      setisPlaying(true);
      videoRef.current.play();
    }
  };
  return (
    <Container>
      <video ref={videoRef} src="https://www.w3schools.com/html/mov_bbb.mp4" />

      <Volume
        changeVolume={setVolume}
        direction="horizontal"
        defaultVolumeValue={videoRef}
      />
      <Play onClick={playPause}>play/pause</Play>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
    justify-content: center;
    align-items: start;
`;
const Play = styled.button`
  width: 78px;
  height: 39px;
`;
export default VideoPlayer;
