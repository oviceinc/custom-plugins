import { useState, useCallback, useMemo } from "react";
import { OviceEvent } from "./type";
import TimerUp from "./TimerUp";
import { Button, Stack, TextField, Typography } from "@mui/material";
import { useMessageEventListener } from "../hook/useMessageEventListener";
import { useMeetingContext } from "../context/MeetingContext";
import { useOviceRecievedEventHandler } from "../hook/dynamic/useOviceEventHandler";
import { ParticipantList } from "../components/ParticipantList";
import { useMeetingTimerAction } from "../hook/useMeetingTimerAction";
import { usePostMessageMeetingDetails } from "../hook/useIframePostMessage";

const MeetingCashClock = () => {
  const [costPerHour, setCostPerHour] = useState(0);
  const { meeting, currentUser, setMeeting } = useMeetingContext();
  const [isCostEditing, setIsCostEditing] = useState(false);
  const [newCostPerHour, setNewCostPerHour] = useState(costPerHour);
  const handleRecievedMessages = useOviceRecievedEventHandler();
  const postMessageMeetingDetails = usePostMessageMeetingDetails();
  const {
    startMeeting,
    stopMeeting,
    clearMeeting,
    pasuseMeeting,
    resumeMeeting,
  } = useMeetingTimerAction();
  useMessageEventListener(
    useCallback(
      (event: MessageEvent) => {
        handleRecievedMessages(event.data as OviceEvent);
      },
      [handleRecievedMessages]
    )
  );

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

  const totalCost = useMemo(() => {
    if (meeting?.status !== "ended") {
      return 0;
    }
    const userCosts = meeting.participants.map(
      (participant) => participant.totalCost ?? 0
    );
    return userCosts.reduce((acc, cost) => acc + cost, 0);
  }, [meeting]);

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

  const costPerHourView = useMemo(() => {
    if (!isCostEditing) {
      return (
        <Typography variant="button">
          {`$${currentUser?.isHost ? costPerHour : meeting?.costPerHour ?? 0}`}
        </Typography>
      );
    }
    if (currentUser?.isHost) {
      return (
        <TextField
          label="Amount"
          type="number"
          value={newCostPerHour}
          size="small"
          onChange={(e) => setNewCostPerHour(Number(e.target.value))}
        />
      );
    }
  }, [
    costPerHour,
    isCostEditing,
    currentUser?.isHost,
    meeting?.costPerHour,
    newCostPerHour,
  ]);

  if (!meeting) {
    return (
      <Typography fontSize={"3rem"} variant="h2">
        {"Meeting not yet Started"}
      </Typography>
    );
  }

  if (!currentUser) {
    return (
      <Typography fontSize={"3rem"} variant="h2">
        {"Please Link to the object to join the meeting"}
      </Typography>
    );
  }

  return (
    <Stack paddingTop={2} paddingBottom={2}>
      <Stack
        flexDirection={"row"}
        alignItems={"center"}
        justifyContent={"center"}
        padding={1}
        gap={5}
      >
        <Stack alignItems={"center"}>
          <Stack
            flexDirection={"row"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <Typography variant="button">{"Cost Per Hour:"}</Typography>
            {costPerHourView}
            {currentUser?.isHost && isCostEditing && (
              <Button
                variant="text"
                color="success"
                onClick={saveCost}
                disableElevation
              >
                Save
              </Button>
            )}
            {currentUser?.isHost && !isCostEditing && (
              <Button variant="text" onClick={editCost} disableElevation>
                Edit
              </Button>
            )}
          </Stack>
          <TimerUp
            meetingStartTime={currentUser?.isHost ? null : meeting?.startTime}
            onStartMeeting={startMeeting}
            onClearMeeting={clearMeeting}
            onPauseMeeting={pasuseMeeting}
            onResumeMeeting={resumeMeeting}
            onStopMeeting={stopMeeting}
            autoStart={meeting?.status === "started" && !currentUser?.isHost}
            meetingElpasedTime={meetingElpasedTime}
            isHost={currentUser?.isHost}
          />
        </Stack>

        <Stack spacing={1} alignItems={"stretch"} alignSelf={"flex-start"}>
          <Typography sx={{ alignSelf: "start" }} variant="button">
            {"Participants :"}
          </Typography>
          <ParticipantList participants={participants} />
          <Typography
            variant="button"
            sx={{ backgroundColor: "#E0E0E0", padding: 1 }}
          >{`Total Cost: $${totalCost.toFixed(2)}`}</Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default MeetingCashClock;
