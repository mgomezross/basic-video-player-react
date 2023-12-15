import { useCallback, useRef, useState, useEffect } from "react";
import { styled } from "styled-components";
import Volume from "./Volume";
import { useDragging } from "../hooks/useDragging";
const VideoPlayer = () => {
  const videoRef = useRef();
  const timelineRef = useRef();
  const [isPlaying, setisPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const animationFrameRef = useRef(null); // To store the animation frame reference
  const [showVolume, setShowVolume] = useState(false);
  const handleLoadedMetadata = () => {
    setDuration(videoRef.current.duration);
  };

  useEffect(() => {
    videoRef.current.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      videoRef.current.removeEventListener(
        "loadedmetadata",
        handleLoadedMetadata
      );
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  const setVolume = useCallback((newVolume) => {
    const volume = newVolume / 100;
    videoRef.current.volume = volume;
  }, []);
  const updateTimeline = () => {
    console.log("updateTimeline running");
    setCurrentTime(videoRef.current.currentTime);
    animationFrameRef.current = requestAnimationFrame(updateTimeline);
  };
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
    const frames = String(Math.floor((time % 1) * 100)).padStart(2, "0");
    //If the value is less than 10, padStart adds a leading zero to make it two digits.
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}:${frames}`;
  };

  const handleTimelineClick = useCallback(
    (e) => {
      const clickX =
        e.clientX - timelineRef.current.getBoundingClientRect().left;
      const timelineWidth = timelineRef.current.clientWidth;

      const newTime = (clickX / timelineWidth) * duration;
      if (newTime > duration || newTime < 0) {
        return;
      }
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    },
    [duration]
  );
  const handleShowVolume = () => {
    setShowVolume((prev) => !prev);
  };
  const handleDragStart = useCallback(
    (event) => {
      handleTimelineClick(event);
    },
    [handleTimelineClick]
  );

  const handleDragMove = useCallback(
    (event) => {
      handleTimelineClick(event);
    },
    [handleTimelineClick]
  );
  const handleDragEnd = useCallback(
    (event) => {
      handleTimelineClick(event);
    },
    [handleTimelineClick]
  );

  const { handleMouseDown } = useDragging({
    handleDragStart,
    handleDragMove,
    handleDragEnd,
  });

  return (
    <>
      <Container>
        <Player
          ref={videoRef}
          src="https://www.w3schools.com/html/mov_bbb.mp4"
        />
        <Timeline ref={timelineRef} onMouseDown={handleMouseDown}>
          <TimelineProgress
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
        </Timeline>
        <ControlsContainer>
          <TimeCode>{formatTime(currentTime)}</TimeCode>

          <Play onClick={playPause}>{isPlaying ? "Pause" : "Play"}</Play>
          <ShowVolume onClick={handleShowVolume}>V</ShowVolume>
          {showVolume && (
            <Volume
              changeVolume={setVolume}
              direction="vertical"
              currentVolume={videoRef}
            />
          )}
        </ControlsContainer>
      </Container>
    </>
  );
};
const Player = styled.video`
  width: 100%;
`;
const Container = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: center;
  align-items: start;
  width: 400px;
`;
const ControlsContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  background-color: #51596b;
  align-items: center;
`;
const Play = styled.button`
     width: 50px;
    height: 30px;
`;
const ShowVolume = styled.button`
      width: 50px;
    height: 30px;
`;
const Timeline = styled.div`
  width: 100%;
  height: 10px;
  background-color: #ccc;
  cursor: pointer;
  position: relative;
  overflow: hidden;
`;

const TimelineProgress = styled.div`
  height: 100%;
  background-color: #4875ce;
`;
const TimeCode = styled.div`
  margin-left: 10px;
  font-family: monospace;
`;
export default VideoPlayer;
