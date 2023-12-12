import { useCallback, useRef, useState, useEffect } from "react";
import { styled } from "styled-components";
import Volume from "./Volume";

const VideoPlayer = () => {
  const videoRef = useRef();
  const timelineRef = useRef();
  const [isPlaying, setisPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const animationFrameRef = useRef(null); // To store the animation frame reference

  const updateTimeline = () => {
    console.log('updateTimeline running')
    setCurrentTime(videoRef.current.currentTime);
    animationFrameRef.current = requestAnimationFrame(updateTimeline);
  };

  const handleLoadedMetadata = () => {
    setDuration(videoRef.current.duration);
  };

  useEffect(() => {
    videoRef.current.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      videoRef.current.removeEventListener("loadedmetadata", handleLoadedMetadata);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  const setVolume = useCallback((newVolume) => {
    const volume = newVolume / 100;
    videoRef.current.volume = volume;
  }, []);

  const playPause = () => {
    if (isPlaying) {
      setisPlaying(false);
      videoRef.current.pause();
      // Cancel the animation frame when the video is paused
      cancelAnimationFrame(animationFrameRef.current);
    } else {
      setisPlaying(true);
      videoRef.current.play();
      // Start the animation frame when video plays
      animationFrameRef.current = requestAnimationFrame(updateTimeline);
    }
  };

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    const frames = String(Math.floor(time % 1 * 100)).padStart(2, "0");

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}:${frames}`;
  };

  const handleTimelineClick = (e) => {
    const clickX = e.clientX - timelineRef.current.getBoundingClientRect().left;
    const timelineWidth = timelineRef.current.clientWidth;
    const newTime = (clickX / timelineWidth) * duration;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  return (
    <Container>
      <video ref={videoRef} src="https://www.w3schools.com/html/mov_bbb.mp4" />
      <Timeline ref={timelineRef} onClick={handleTimelineClick}>
        <TimelineProgress
          style={{ width: `${(currentTime / duration) * 100}%` }}
        />
      </Timeline>
      <TimeCode>{formatTime(currentTime)}</TimeCode>
      <Play onClick={playPause}>{isPlaying ? "Pause" : "Play"}</Play>

      <Volume
        changeVolume={setVolume}
        direction="vertical"
        currentVolume={videoRef}
      />
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

const Timeline = styled.div`
  width: 100%;
  height: 10px;
  background-color: #ccc;
  cursor: pointer;
  position: relative;
`;

const TimelineProgress = styled.div`
  height: 100%;
  background-color: red;
`;
const TimeCode = styled.div`
  margin-left: 10px;
  font-family: monospace;
`;
export default VideoPlayer;
