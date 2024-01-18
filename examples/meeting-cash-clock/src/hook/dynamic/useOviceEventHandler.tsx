import { useCallback } from "react";
import { OviceEvent, OvicePayloadType } from "../../page/type";
import { useMeetingContext } from "../../context/MeetingContext";
import { useIframePostMessage } from "../useIframePostMessage";

export const useOviceRecievedEventHandler = () => {
  const { meeting, currentUser, setMeeting, setCurrentUser } =
    useMeetingContext();
  const postMessage = useIframePostMessage();
  const addParticipant = useCallback(
    (payload: OvicePayloadType) => {
      const now = Date.now();
      setMeeting((prev) => {
        if (!prev) {
          return prev;
        }
        const oldMeeting = { ...prev };
        const index = oldMeeting.participants.findIndex(
          (part) => part.id === payload.id
        );

        if (index === -1) {
          oldMeeting.participants.push({
            id: payload.id,
            name: payload.name,
            isSelf: payload.isSelf,
            owner: payload.isHost,
            joinedAt: now,
            leftAt: null,
            elapsedTime: 0,
            timeSpent: 0,
            totalCost: 0,
            left: false,
          });
          return oldMeeting;
        }
        const oldParticipant = { ...oldMeeting.participants[index] };
        if (
          oldParticipant.left &&
          oldParticipant.leftAt &&
          oldParticipant.joinedAt
        ) {
          oldParticipant.elapsedTime +=
            oldParticipant.leftAt - oldParticipant.joinedAt;
          oldParticipant.joinedAt = now;
          oldParticipant.leftAt = null;
          oldParticipant.left = false;
          oldMeeting.participants[index] = oldParticipant;
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
        const now = Date.now();
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
            part.leftAt = now;
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

  const updateMeeting = useCallback(
    (data: OvicePayloadType) => {
      if (data.isHost && !meeting.hasOwner && data.isSelf) {
        setMeeting((prev) => {
          const oldMeeting = { ...prev };
          oldMeeting.hasOwner = true;
          return oldMeeting;
        });
      }
      if (data.isSelf) {
        setCurrentUser(data);
      }
      addParticipant(data);
    },
    [addParticipant, meeting.hasOwner, setCurrentUser, setMeeting]
  );

  const handleSelfEvents = useCallback(
    (event: OviceEvent) => {
      if (event.type === "ovice_participant_joined") {
        updateMeeting(event.payload);
      } else if (
        event.type === "ovice_participant_left" ||
        event.type === "ovice_participant_unsubscribed"
      ) {
        setMeeting((prev) => {
          const oldMeeting = { ...prev };
          oldMeeting.hasOwner = false;
          return oldMeeting;
        });
        setCurrentUser(undefined);
      }
    },
    [setCurrentUser, setMeeting, updateMeeting]
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
        case "ovice_participants":
          eventData.payload.forEach((part) => {
            if (part.status === "joined") {
              updateMeeting(part);
            }
          });
      }
    },
    [
      handleSelfEvents,
      handleOtherParticipantsEvents,
      handleMessageEvents,
      updateMeeting,
    ]
  );
};
