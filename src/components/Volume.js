import styled from "styled-components";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDragging } from "../hooks/useDragging";

const Volume = (props) => {
  const { direction ,changeVolume,defaultVolumeValue} = props;
  const knobRef = useRef(null);
  const trackRef = useRef(null);
  const [volumeState, setVolumeState] = useState({
    knobPosition: 0,
    isDragging: false,
  });
useEffect(() => {
  const  volume = defaultVolumeValue.current.volume * 100
  const perToPixels =
          (volume / 100) * trackRef.current.clientWidth;
  setVolumeState((prevState)=>({
    ...prevState,
    knobPosition:perToPixels - 10
  }))

}, [])

  const setNewVolume = useCallback(
    (e) => {
      if (direction === "horizontal") {
        const total = e.clientX - trackRef.current.getBoundingClientRect().left;
        // Calculate the new volume as a percentage of the track width
        const percentage = (total / trackRef.current.clientWidth) * 100;

        // Ensure the percentage is within the 0 - 100 range
        const newPercentage = Math.min(100, Math.max(0, percentage));

        // Calculate the new volume in pixels
        const perToPixels =
          (newPercentage / 100) * trackRef.current.clientWidth;
        //minus 10 will keep volume knob on the center when you drag it
        setVolumeState((prevState) => ({
          ...prevState,
          knobPosition: perToPixels - 10
        }));
        changeVolume(newPercentage)
      } else {
        const total = e.clientY - trackRef.current.getBoundingClientRect().top;

        // Calculate the new volume as a percentage of the track height
        const percentage = (total / trackRef.current.clientHeight) * 100;

        // Ensure the percentage is within the 0 - 100 range
        const newPercentage = Math.min(100, Math.max(0, percentage));

        // Calculate the new volume in pixels
        const newVolume = (newPercentage / 100) * trackRef.current.clientHeight;

        setVolumeState((prevState) => ({
          ...prevState,
          knobPosition: newVolume - 5
        
        }));
        changeVolume(newPercentage)
      }
    },
    [changeVolume, direction]
  );

  const handleDragStart = (event) => {
    setVolumeState((prevState) => ({
      ...prevState,
      isDragging: true,
    }));
    setNewVolume(event);
  };

  const handleDragMove = useCallback(
    (event) => {
      if (volumeState.isDragging) {
        setNewVolume(event);
      }
    },
    [setNewVolume, volumeState.isDragging]
  );

  const handleDragEnd = useCallback(() => {
    setVolumeState((prevState) => ({
      ...prevState,
      isDragging: false,
    }));
  }, []);

  const { handleMouseDown, clearEventListeners } = useDragging({
    handleDragStart,
    handleDragMove,
    handleDragEnd,
  });
  return (
    <VolumeContainer direction={direction}>
      <VolumeTrack
        ref={trackRef}
        direction={direction}
        onMouseDown={handleDragStart}
      >
        <VolumeKnob
          direction={direction}
          onMouseDown={handleMouseDown}
          ref={knobRef}
          volume={volumeState}
        ></VolumeKnob>
      </VolumeTrack>
    </VolumeContainer>
  );
};

const VolumeContainer = styled.div`
  ${({ direction }) =>
    direction === "horizontal"
      ? "width: 200px; height: 40px;"
      : "width: 40px; height: 200px;"};
  background-color: white;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const VolumeTrack = styled.div`
  ${({ direction }) =>
    direction === "horizontal"
      ? "width: 150px; height: 10px;"
      : "width: 10px; height: 150px;"};
  background-color: gray;
  position: relative;
  border-radius: 10px;
`;

const VolumeKnob = styled.span`
  ${({ direction, volume }) =>
    direction === "horizontal"
      ? `width: 20px;  top: -1px; left:${volume.knobPosition}px;`
      : `width: 10px; left:-1px; top:${volume.knobPosition}px;`};
  border-radius: 10px;
  border-color: black;

  height: 10px;

  border: 1px solid black;

  background-color: white;
  position: absolute;
`;
export default Volume;
