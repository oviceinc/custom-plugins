import { useCallback, useEffect, useRef, useState } from "react";
import { useMeetingTimerAction } from "./useMeetingTimerAction";

export const useTimer = () => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isStoped, setIsStoped] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const {
    startMeeting,
    stopMeeting,
    clearMeeting,
    pasuseMeeting,
    resumeMeeting,
  } = useMeetingTimerAction();

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const newElapsedTime = elapsedTime + now - startTime;
        setElapsedTime(newElapsedTime);
        setStartTime(now);
      }, 1000);
    } else {
      clearInterval(intervalRef.current!);
    }

    return () => clearInterval(intervalRef.current!);
  }, [isRunning, elapsedTime, startTime]);

  const handleStart = useCallback(() => {
    if (!isRunning) {
      const now = Date.now();
      startMeeting(now);
      setStartTime(now);
      setIsRunning(true);
      setIsStarted(true);
    }
  }, [isRunning, startMeeting]);

  const handleStop = useCallback(() => {
    if (isPaused || isRunning) {
      stopMeeting(elapsedTime, startTime);
      setIsRunning(false);
      setIsStoped(true);
      setIsPaused(false);
    }
  }, [elapsedTime, isPaused, isRunning, stopMeeting, startTime]);

  const handlePause = useCallback(() => {
    if (isRunning) {
      pasuseMeeting(elapsedTime, startTime);
      setIsRunning(false);
      setIsPaused(true);
    }
  }, [elapsedTime, isRunning, pasuseMeeting, startTime]);

  const handleResume = useCallback(() => {
    if (!isRunning) {
      const now = Date.now();
      resumeMeeting(elapsedTime, now);
      setStartTime(now);
      setIsRunning(true);
      setIsPaused(false);
    }
  }, [elapsedTime, isRunning, resumeMeeting]);

  const handleClear = useCallback(() => {
    clearMeeting();
    setIsRunning(false);
    setIsStoped(false);
    setIsStarted(false);
    setElapsedTime(0);
  }, [clearMeeting]);

  return {
    startTime,
    isRunning,
    elapsedTime,
    isStoped,
    isStarted,
    isPaused,
    handleStart,
    handleStop,
    handlePause,
    handleResume,
    handleClear,
    setStartTime,
    setElapsedTime,
    setIsRunning,
  };
};
