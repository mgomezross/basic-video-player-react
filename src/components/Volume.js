import styled from "styled-components";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDragging } from "../hooks/useDragging";

const Volume = (props) => {
  const { direction, changeVolume, currentVolume } = props;
  const knobRef = useRef(null);
  const trackRef = useRef(null);
  const VERTICAL_OFFSET = 5;
  const HORIZONTAL_OFFSET = 10;
  const [volumeState, setVolumeState] = useState({
    knobPosition: 0,
    isDragging: false,
  });

  useEffect(() => {
    //VERTICAL
    const perToPixels = currentVolume.current.volume * trackRef.current.clientY;

    //HORIZONTAL
    // const  volume = currentVolume.current.volume * 100
    // const perToPixels =
    //         (volume / 100) * trackRef.current.clientWidth;
    setKnobPosition(perToPixels - 5);
  }, []);

  const setKnobPosition = useCallback(
    (position) => {
      let newPosition;
      if (direction === "horizontal") {
        newPosition = position - HORIZONTAL_OFFSET;
      } else {
        newPosition = position - VERTICAL_OFFSET;
      }
      setVolumeState((prevState) => ({
        ...prevState,
        knobPosition: newPosition,
      }));
    },
    [direction]
  );

  const calculateVolume = useCallback(
    (e) => {
      let newPercentage;

      if (direction === "horizontal") {
        const total = e.clientX - trackRef.current.getBoundingClientRect().left;
        const percentage = (total / trackRef.current.clientWidth) * 100;
        newPercentage = Math.min(100, Math.max(0, percentage));
        const perToPixels =
          (newPercentage / 100) * trackRef.current.clientWidth;
        setKnobPosition(perToPixels);
      } else {
        const total =
          trackRef.current.getBoundingClientRect().bottom - e.clientY;
        const percentage =
          (total / trackRef.current.getBoundingClientRect().height) * 100;
        newPercentage = Math.min(100, Math.max(0, percentage));
        const perToPixels =
          (newPercentage / 100) * trackRef.current.clientHeight;
        setKnobPosition(trackRef.current.clientHeight - perToPixels);
      }

      changeVolume(newPercentage);
    },
    [changeVolume, direction, setKnobPosition]
  );

  const handleDragStart = (event) => {
    setVolumeState((prevState) => ({
      ...prevState,
      isDragging: true,
    }));
    calculateVolume(event);
  };

  const handleDragMove = useCallback(
    (event) => {
      if (volumeState.isDragging) {
        calculateVolume(event);
      }
    },
    [calculateVolume, volumeState.isDragging]
  );

  const handleDragEnd = useCallback(() => {
    setVolumeState((prevState) => ({
      ...prevState,
      isDragging: false,
    }));
  }, []);

  const { handleMouseDown } = useDragging({
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
  position: absolute;
  top: 74px;
  right: 18px;
  ${({ direction }) =>
    direction === "horizontal"
      ? "width: 200px; height: 40px;"
      : "width: 17px; height: 156px;"};

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
  border-radius: 6px;
  border-color: black;
  cursor: pointer;
  height: 10px;

  border: 1px solid black;

  background-color: white;
  position: absolute;
`;
export default Volume;
