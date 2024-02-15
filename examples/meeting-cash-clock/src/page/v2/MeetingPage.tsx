import { useCallback, useEffect, useMemo, useState } from "react";
import { useMeetingContext } from "../../context/MeetingContext";
import { useOviceRecievedEventHandler } from "../../hook/dynamic/useOviceEventHandler";
import { usePostMessageMeetingDetails } from "../../hook/useIframePostMessage";
import { useMessageEventListener } from "../../hook/useMessageEventListener";
import { OviceEvent } from "../type";
import { Stack, Typography } from "@mui/material";
import { Cost } from "../../components/v2/Cost";
import { Time } from "../../components/v2/Time";
import { TotalAmount } from "../../components/v2/TotalAmount";
import { Control } from "../../components/v2/Control";
import { UserList } from "../../components/v2/UserList";
import { useTimer } from "../../hook/useTimer";
import { getTime } from "../util";
import { millisecondsToSeconds } from "date-fns";

export const MeetingPage = () => {
  const [costPerHour, setCostPerHour] = useState(0);
  const { meeting, currentUser, setMeeting } = useMeetingContext();
  const [isCostEditing, setIsCostEditing] = useState(false);
  const [newCostPerHour, setNewCostPerHour] = useState(costPerHour);
  const handleRecievedMessages = useOviceRecievedEventHandler();
  const postMessageMeetingDetails = usePostMessageMeetingDetails();
  useMessageEventListener(
    useCallback(
      (event: MessageEvent) => {
        handleRecievedMessages(event.data as OviceEvent);
      },
      [handleRecievedMessages]
    )
  );

  const {
    startTime,
    elapsedTime,
    handleClear,
    handlePause,
    handleResume,
    handleStart,
    handleStop,
    isPaused,
    isRunning,
    isStarted,
    isStoped,
    setElapsedTime,
    setIsRunning,
    setStartTime,
  } = useTimer();

  const editCost = () => {
    if (meeting?.status === "ready") {
      setIsCostEditing(true);
    }
  };

  const saveCost = () => {
    if (meeting?.status !== "ready" || !currentUser) {
      return;
    }
    setIsCostEditing(false);
    setCostPerHour(newCostPerHour);
    setMeeting((prev) => {
      if (!prev) {
        return prev;
      }
      const meeting = { ...prev };
      meeting.costPerHour = newCostPerHour;
      postMessageMeetingDetails(meeting, currentUser);
      return meeting;
    });
  };

  const totalCostV2 = useMemo(() => {
    if (!meeting || meeting?.status === "ready") {
      return 0;
    }
    const userCosts = meeting.participants.map((participant) => {
      let durration = 0;
      if (participant.leftAt) {
        durration =
          Number(participant.leftAt) -
          Number(participant.joinedAt) +
          participant.elapsedTime;
      } else {
        durration =
          startTime - Number(participant.joinedAt) + participant.elapsedTime;
      }
      return meeting.costPerHour * (millisecondsToSeconds(durration) / 3600);
    });
    return Math.abs(userCosts.reduce((acc, cost) => acc + cost, 0));
  }, [meeting, startTime]);

  const participants = useMemo(() => {
    if (!meeting) {
      return [];
    }
    return meeting.participants.map((participant) => ({
      name: participant.name,
      cost: participant.totalCost ?? undefined,
      totalTime: participant.timeSpent ?? undefined,
    }));
  }, [meeting]);

  const meetingElpasedTime = useMemo(() => {
    if (currentUser?.isHost) {
      return null;
    }
    return meeting?.status === "ready" ? 0 : meeting?.elapsedTime;
  }, [currentUser?.isHost, meeting?.elapsedTime, meeting?.status]);

  const autoStart = useMemo(() => {
    return meeting?.status === "started" && !currentUser?.isHost;
  }, [currentUser?.isHost, meeting?.status]);

  const meetingStartTime = useMemo(() => {
    if (currentUser?.isHost) {
      return null;
    }
    return meeting?.status === "ready" ? 0 : meeting?.startTime;
  }, [currentUser?.isHost, meeting?.startTime, meeting?.status]);

  const time = useMemo(() => {
    return getTime(elapsedTime);
  }, [elapsedTime]);

  useEffect(() => {
    setStartTime(meetingStartTime ?? 0);
  }, [meetingStartTime, setStartTime]);

  useEffect(() => {
    setIsRunning(autoStart);
  }, [autoStart, setIsRunning]);

  useEffect(() => {
    setElapsedTime(meetingElpasedTime ?? 0);
  }, [meetingElpasedTime, setElapsedTime]);

  if (!meeting) {
    return (
      <Stack
        alignItems={"center"}
        sx={{ backgroundColor: "#F9F9F9" }}
        justifyContent={"center"}
        height={"100vh"}
        fontWeight={600}
      >
        <Typography fontSize={"2rem"} variant="h2">
          {"Meeting not yet Started"}
        </Typography>
      </Stack>
    );
  }

  if (!currentUser) {
    return (
      <Stack
        alignItems={"center"}
        sx={{ backgroundColor: "#F9F9F9" }}
        justifyContent={"center"}
        height={"100vh"}
      >
        <Typography fontSize={"2rem"} fontWeight={600} variant="h2">
          {"Please Link to the object to join the meeting"}
        </Typography>
      </Stack>
    );
  }

  return (
    <Stack
      alignItems={"center"}
      sx={{
        backgroundColor: "#F9F9F9",
      }}
      justifyContent={"center"}
      spacing={2}
      maxWidth={"350px"}
      position={"relative"}
    >
      <Cost
        costPerHour={
          currentUser?.isHost ? costPerHour : meeting?.costPerHour ?? 0
        }
        editCost={editCost}
        isCostEditing={isCostEditing}
        saveCost={saveCost}
        newCostPerHour={newCostPerHour}
        setNewCostPerHour={setNewCostPerHour}
        canEdit={currentUser?.isHost && meeting?.status === "ready"}
      />
      <Time hours={time.hours} minutes={time.minutes} seconds={time.seconds} />
      {(isStoped || meeting.status === "ended") && (
        <UserList participants={participants} />
      )}
      <TotalAmount total={totalCostV2} />
      {currentUser?.isHost && (
        <Control
          isPaused={isPaused}
          isRunning={isRunning}
          isStarted={isStarted}
          isStoped={isStoped}
          onClear={handleClear}
          onPause={handlePause}
          onResume={handleResume}
          onStart={handleStart}
          onStop={handleStop}
        />
      )}
    </Stack>
  );
};
