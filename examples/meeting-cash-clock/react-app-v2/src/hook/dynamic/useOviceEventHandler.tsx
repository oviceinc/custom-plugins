import { useCallback } from "react";
import { OviceEvent, OvicePayloadType } from "../../page/type";
import { v4 as uuidv4 } from "uuid";
import { useMeetingContext } from "../../context/MeetingContext";
import { useIframePostMessage } from "../useIframePostMessage";

export const useOviceRecievedEventHandler = () => {
  const { meeting, currentUser, setMeeting, setCurrentUser } =
    useMeetingContext();
  const postMessage = useIframePostMessage();
  const addParticipant = useCallback(
    (payload: OvicePayloadType) => {
      setMeeting((prev) => {
        if (!prev) {
          return prev;
        }
        const oldMeeting = { ...prev };
        const index = oldMeeting.participants.findIndex(
          (part) => part.id === payload.id
        );
        if (index === -1) {
          const timeSpent =
            oldMeeting.startTime && oldMeeting.status !== "ended"
              ? Date.now() - oldMeeting.startTime
              : 0;
          oldMeeting.participants.push({
            id: payload.id,
            name: payload.name,
            timeSpent,
            totalCost: 0,
            left: false,
          });
        }
        return oldMeeting;
      });
    },
    [setMeeting]
  );

  const sendMeetingDetails = useCallback(
    (to: string) => {
      if (currentUser) {
        postMessage({
          type: "ovice_emit_message",
          payload: {
            objectId: currentUser.objectId,
            source: currentUser.id.toString(),
            event: "meeting_details",
            to: to.toString(),
            message: meeting,
          },
        });
      }
    },
    [currentUser, meeting, postMessage]
  );
  const handleOtherParticipantsEvents = useCallback(
    (event: OviceEvent) => {
      if (!currentUser?.isHost) {
        return;
      }
      if (event.type === "ovice_participant_joined") {
        addParticipant(event.payload);
        if (currentUser) {
          sendMeetingDetails(event.payload.id);
        }
      } else if (
        event.type === "ovice_participant_left" ||
        event.type === "ovice_participant_unsubscribed"
      ) {
        setMeeting((prev) => {
          if (!prev) {
            return prev;
          }
          const oldMeeting = { ...prev };
          const index = oldMeeting.participants.findIndex(
            (part) => part.id === event.payload.id
          );
          if (index > -1) {
            const part = { ...oldMeeting.participants[index] };
            let durration = 0;
            if (oldMeeting.elapsedTime) {
              durration = oldMeeting.elapsedTime - (part.timeSpent ?? 0);
            } else if (oldMeeting.startTime) {
              durration = Date.now() - oldMeeting.startTime;
              durration -= part.timeSpent ?? 0;
            }
            part.timeSpent = durration;
            part.left = true;
            oldMeeting.participants[index] = part;
          }

          return oldMeeting;
        });
        sendMeetingDetails(event.payload.id);
      }
    },
    [addParticipant, currentUser, sendMeetingDetails, setMeeting]
  );

  const handleSelfEvents = useCallback(
    (event: OviceEvent) => {
      if (event.type === "ovice_participant_joined") {
        if (event.payload.isHost) {
          setMeeting({
            id: uuidv4(),
            costPerHour: 0,
            status: "ready",
            participants: [],
          });
          addParticipant(event.payload);
        }
        setCurrentUser(event.payload);
      } else if (
        event.type === "ovice_participant_left" ||
        event.type === "ovice_participant_unsubscribed"
      ) {
        setCurrentUser(undefined);
        setMeeting(undefined);
      }
    },
    [addParticipant, setCurrentUser, setMeeting]
  );

  const handleMessageEvents = useCallback(
    (event: OviceEvent) => {
      if (event.type === "ovice_message") {
        if (event.payload.event === "meeting_details") {
          setMeeting(event.payload.message);
        }
      }
    },
    [setMeeting]
  );

  return useCallback(
    (eventData: OviceEvent) => {
      switch (eventData.type) {
        case "ovice_participant_joined":
        case "ovice_participant_left":
        case "ovice_participant_subscribed":
        case "ovice_participant_unsubscribed":
          const participantHandler = eventData.payload.isSelf
            ? handleSelfEvents
            : handleOtherParticipantsEvents;
          participantHandler(eventData);
          break;
        case "ovice_message":
          handleMessageEvents(eventData);
          break;
      }
    },
    [handleMessageEvents, handleOtherParticipantsEvents, handleSelfEvents]
  );
};
