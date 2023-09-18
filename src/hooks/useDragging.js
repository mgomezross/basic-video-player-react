import { useEffect, useState, useCallback } from 'react';

export const InteractionEvents = {
  MouseDown: 'mousedown',
  MouseMove: 'mousemove',
  MouseUp: 'mouseup',
  TouchStart: 'touchstart',
  TouchMove: 'touchmove',
  TouchEnd: 'touchend',
};

export const useDragging = (args) => {
  const {
    handleDragStart,
    handleDragMove,
    handleDragEnd,
    disabled = false,
  } = args;
  const [eventType, setEventType] = useState();

  /* DRAG START: */
  const handleMouseDown = useCallback(
    (event) => {
      if (disabled) {
        return;
      }
      setEventType(event.type);
      handleDragStart(event);
    },
    [disabled, handleDragStart]
  );

  /* DRAG MOVE: */
  const handleMouseMove = useCallback(
    (e) => {
      handleDragMove(e);
    },
    [handleDragMove]
  );

  /* DRAG END: */
  const clearEventListeners = useCallback(() => {
    window.removeEventListener(InteractionEvents.MouseMove, handleMouseMove);
    window.removeEventListener(InteractionEvents.TouchMove, handleMouseMove);
    setEventType(undefined);
  }, [handleMouseMove]);

  const handleMouseUp = useCallback(
    (e) => {
      handleDragEnd(e);
      clearEventListeners();
      // removes self after the first invoke
      window.removeEventListener(InteractionEvents.MouseUp, handleMouseUp);
    },
    [clearEventListeners, handleDragEnd]
  );

  useEffect(() => {
    if (eventType === InteractionEvents.MouseDown) {
      window.addEventListener(InteractionEvents.MouseUp, handleMouseUp);
      window.addEventListener(InteractionEvents.MouseMove, handleMouseMove);
    } else {
      window.addEventListener(InteractionEvents.TouchEnd, handleMouseUp);
      window.addEventListener(InteractionEvents.TouchMove, handleMouseMove);
    }
  }, [eventType, handleMouseMove, handleMouseUp]);

  // cleanup function to remove event listeners on every un-mount (empty dependency array)
  useEffect(() => {
    return () => {
      clearEventListeners();
      console.log('clear')
    };
  }, []);

  return { handleMouseDown, clearEventListeners };
};