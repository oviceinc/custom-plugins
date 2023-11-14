import { Button, Stack, Typography } from "@mui/material";
import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  memo,
} from "react";
import { timeFormat } from "./util";

type TimerUpProps = {
  onStartMeeting?: () => void;
  onPauseMeeting?: (elapsedTime: number) => void;
  onStopMeeting?: (elapsedTime: number) => void;
  onResumeMeeting?: (elapsedTime: number) => void;
  onClearMeeting?: () => void;
  meetingStartTime?: number | null;
  meetingElpasedTime?: number | null;
  autoStart?: boolean;
  isHoster?: boolean;
};
const TimerUp = memo(
  ({
    onClearMeeting,
    onPauseMeeting,
    onResumeMeeting,
    onStartMeeting,
    onStopMeeting,
    meetingStartTime,
    meetingElpasedTime,
    autoStart,
    isHoster,
  }: TimerUpProps) => {
    const [startTime, setStartTime] = useState(meetingStartTime ?? 0);
    const [elapsedTime, setElapsedTime] = useState(meetingElpasedTime ?? 0);
    const [isRunning, setIsRunning] = useState(autoStart);
    const [isStoped, setIsStoped] = useState(false);
    const [isStarted, setIsStarted] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
      setStartTime(meetingStartTime ?? 0);
    }, [meetingStartTime]);

    useEffect(() => {
      setIsRunning(autoStart);
    }, [autoStart]);

    useEffect(() => {
      setElapsedTime(meetingElpasedTime ?? 0);
    }, [meetingElpasedTime]);

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
        onStartMeeting?.();
        setStartTime(Date.now());
        setIsRunning(true);
        setIsStarted(true);
      }
    }, [isRunning, onStartMeeting]);

    const handleStop = useCallback(() => {
      if (isRunning) {
        onStopMeeting?.(elapsedTime);
        setIsRunning(false);
        setIsStoped(true);
      }
    }, [elapsedTime, isRunning, onStopMeeting]);

    const handlePause = useCallback(() => {
      if (isRunning) {
        onPauseMeeting?.(elapsedTime);
        setIsRunning(false);
        setIsPaused(true);
      }
    }, [elapsedTime, isRunning, onPauseMeeting]);

    const handleResume = useCallback(() => {
      if (!isRunning) {
        onResumeMeeting?.(elapsedTime);
        setStartTime(Date.now());
        setIsRunning(true);
        setIsPaused(false);
      }
    }, [elapsedTime, isRunning, onResumeMeeting]);

    const handleClear = useCallback(() => {
      onClearMeeting?.();
      setIsRunning(false);
      setIsStoped(false);
      setIsStarted(false);
      setElapsedTime(0);
    }, [onClearMeeting]);

    const formatTime = useMemo(() => {
      return timeFormat(elapsedTime);
    }, [elapsedTime]);

    return (
      <Stack gap={5} padding={1}>
        <Typography
          sx={{ backgroundColor: "#E0E0E0" }}
          paddingLeft={2}
          paddingRight={2}
          variant="h2"
        >
          {formatTime}
        </Typography>

        {isHoster && (
          <Stack
            flexDirection={"row"}
            gap={5}
            justifyContent={"center"}
            alignItems={"center"}
          >
            {!isStarted && (
              <Button
                sx={{ backgroundColor: "#C8F7D9", color: "black" }}
                variant="contained"
                onClick={handleStart}
                disableElevation
              >
                Start
              </Button>
            )}

            {isRunning && !isPaused && (
              <Button
                sx={{ backgroundColor: "#8F8F8F", color: "white" }}
                variant="contained"
                onClick={handlePause}
                disableElevation
              >
                Pause
              </Button>
            )}
            {isPaused && (
              <Button
                sx={{ backgroundColor: "#F2D988", color: "black" }}
                variant="contained"
                onClick={handleResume}
                disableElevation
              >
                Resume
              </Button>
            )}
            {!isStoped && isStarted && (
              <Button
                sx={{ backgroundColor: "#F7A38F", color: "black" }}
                variant="contained"
                onClick={handleStop}
                disableElevation
              >
                Stop
              </Button>
            )}
            {isStoped && !isRunning && (
              <Button
                sx={{ backgroundColor: "#C8F7D9", color: "black" }}
                variant="contained"
                onClick={handleClear}
                disableElevation
              >
                Clear
              </Button>
            )}
          </Stack>
        )}
      </Stack>
    );
  }
);
TimerUp.displayName = "TimerUp";
export default TimerUp;
