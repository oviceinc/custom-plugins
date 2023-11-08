import { useState, useCallback, useMemo } from "react";
import useWebSocket from "./hook/useWebSocket";
import { Meeting, MessageEvents, OviceEvent } from "./type";
import { nameList } from "./constants";
import TimerUp from "./TimerUp";
import { v4 as uuidv4 } from "uuid";
import { ParticipantList } from "./components/ParticipantList";
import { Button, Stack, TextField, Typography } from "@mui/material";
import { useMessageEventListener } from "./hook/useMessageEventListener";

const participantId = uuidv4();
const MeetingCashClock = () => {
  const [costPerHour, setCostPerHour] = useState(0);
  const [meeting, setMeeting] = useState<Meeting>();
  const [isHoster, setIsHoster] = useState<boolean>(false);
  const [isCostEditing, setIsCostEditing] = useState(false);
  const [newCostPerHour, setNewCostPerHour] = useState(costPerHour);

  const { sendMessage } = useWebSocket(
    useCallback((message: MessageEvents) => {
      console.log("Socket message ", message);
      if (message.type === "participant_assigned_as_host") {
        setIsHoster(true);
        setMeeting(message.data);
      } else if (message.type === "meeting_details") {
        setMeeting(message.data);
      } else if (message.type === "meeting_cost_updated") {
        setMeeting((prev) => {
          if (!prev) {
            return prev;
          }
          return {
            ...prev,
            costPerHour: message.data.costPerHour,
          };
        });
        setCostPerHour(message.data.costPerHour);
        setNewCostPerHour(message.data.costPerHour);
      }
    }, [])
  );

  useMessageEventListener(
    useCallback(
      (event: MessageEvent) => {
        const data: OviceEvent = event.data;
        console.log("Received message:", data);
        if (data.type === "ovice_participant_joined") {
          sendMessage({
            type: "join_meeting",
            data: {
              meetingId: data.payload.objectId,
              participantId: participantId,
              participantName: data.payload.name,
            },
          });
        } else if (
          data.type === "ovice_participant_left" ||
          data.type === "ovice_participant_unsubscribed"
        ) {
          sendMessage({
            type: "leave_meeting",
            data: {
              meetingId: data.payload.objectId,
              participantId: participantId,
            },
          });
        }
      },
      [sendMessage]
    )
  );

  const onStartMeeting = () => {
    sendMessage({
      type: "start_timer",
      data: {
        meetingId: meeting?.id,
        participantId: participantId,
        costPerHour: costPerHour,
      },
    });
  };

  const onResumeMeeting = (elapsedTime: number) => {
    sendMessage({
      type: "resume_timer",
      data: {
        meetingId: meeting?.id,
        participantId: participantId,
        costPerHour: costPerHour,
        elapsedTime,
      },
    });
  };

  const onStopMeeting = (elapsedTime: number) => {
    sendMessage({
      type: "stop_timer",
      data: {
        meetingId: meeting?.id,
        participantId: participantId,
        costPerHour: costPerHour,
        elapsedTime,
      },
    });
  };

  const onPauseMeeting = (elapsedTime: number) => {
    sendMessage({
      type: "pause_timer",
      data: {
        meetingId: meeting?.id,
        participantId: participantId,
        costPerHour: costPerHour,
        elapsedTime: elapsedTime,
      },
    });
  };

  const onClearMeeting = () => {
    sendMessage({
      type: "clear_timer",
      data: {
        meetingId: meeting?.id,
        participantId: participantId,
        costPerHour: 0,
      },
    });
  };

  const editCost = () => {
    if (meeting?.status === "ready" && isHoster) {
      setIsCostEditing(true);
    }
  };

  const saveCost = () => {
    if (meeting?.status === "ready" && isHoster) {
      setIsCostEditing(false);
      setCostPerHour(newCostPerHour);
      sendMessage({
        type: "update_cost_per_hour",
        data: {
          meetingId: meeting?.id,
          participantId: participantId,
          newCost: newCostPerHour,
        },
      });
    }
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

  // TODO remove this after integration with IFrame
  const join = useCallback(() => {
    sendMessage({
      type: "join_meeting",
      data: {
        meetingId: "L123",
        participantId: participantId,
        participantName: nameList[Math.floor(Math.random() * nameList.length)],
      },
    });
  }, [sendMessage]);

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
    if (isHoster) {
      return null;
    }
    return meeting?.status === "ready" ? 0 : meeting?.elapsedTime;
  }, [isHoster, meeting?.elapsedTime, meeting?.status]);

  const costPerHourView = useMemo(() => {
    if (!isCostEditing) {
      return (
        <Typography variant="button">
          {`$${isHoster ? costPerHour : meeting?.costPerHour ?? 0}`}
        </Typography>
      );
    }
    if (isHoster) {
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
    isHoster,
    meeting?.costPerHour,
    newCostPerHour,
  ]);

  return (
    <Stack paddingTop={10} paddingBottom={10}>
      <Typography variant="h2">{"Meeting Cash Clock"}</Typography>
      {/* <Button variant="contained" onClick={join} disableElevation>
        JOIN
      </Button> */}
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
            {isHoster && isCostEditing && (
              <Button
                variant="text"
                color="success"
                onClick={saveCost}
                disableElevation
              >
                Save
              </Button>
            )}
            {isHoster && !isCostEditing && (
              <Button variant="text" onClick={editCost} disableElevation>
                Edit
              </Button>
            )}
          </Stack>
          <TimerUp
            meetingStartTime={isHoster ? null : meeting?.startTime}
            onStartMeeting={onStartMeeting}
            onClearMeeting={onClearMeeting}
            onPauseMeeting={onPauseMeeting}
            onResumeMeeting={onResumeMeeting}
            onStopMeeting={onStopMeeting}
            autoStart={meeting?.status === "started" && !isHoster}
            meetingElpasedTime={meetingElpasedTime}
            isHoster={isHoster}
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
