import { styled } from "styled-components";
import { useDragging } from "../hooks/useDragging";
import { useCallback, useState, useRef } from "react";

const Timeline = () => {
  const [isDragging, setIsDragging] = useState(false);
  const segmentRef = useRef(null);
  const containerRef = useRef(null);

  const handleDragStart = useCallback((event) => {
    setIsDragging(true);
   
    const segmentRect = segmentRef.current.getBoundingClientRect();
    segmentRef.current.offsetX = event.clientX - segmentRect.left;
  }, []);

  const handleDragMove = useCallback((event) => {
    if (isDragging) {

      const containerRect = containerRef.current.getBoundingClientRect();
      let newLeft = event.clientX - containerRect.left - segmentRef.current.offsetX;

     
      newLeft = Math.max(0, Math.min(newLeft, containerRect.width - segmentRef.current.offsetWidth));

 
      segmentRef.current.style.left = newLeft + 'px';
    }
  }, [isDragging]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const { handleMouseDown } = useDragging({
    handleDragStart,
    handleDragMove,
    handleDragEnd,
  });

  return (
    <Container ref={containerRef}>
      <Segment ref={segmentRef} onMouseDown={handleMouseDown} />
    </Container>
  );
};

export default Timeline;

const Container = styled.div`
  width: 80%;
  margin-top: 10px;
  height: 100px;
  background-color: #ccc;
  position: relative; 
  display: flex;
  align-items: center;
`;

const Segment = styled.div`
  height: 80%;
  width: 300px;
  background-color: black;
  position: absolute; 
  cursor: pointer; 
`;
