import { useCallback } from "react";
import { OviceEvent, OvicePayloadType } from "../../page/type";
import { v4 as uuidv4 } from "uuid";
import { useMeetingContext } from "../../context/MeetingContext";
import { useIframePostMessage } from "../useIframePostMessage";

type SelfEvent =
  | "ovice_participant_joined"
  | "ovice_participant_left"
  | "ovice_participant_subscribed"
  | "ovice_participant_unsubscribed";

type OtherParticipantsEvent =
  | "ovice_other_participant_joined"
  | "ovice_other_participant_left"
  | "ovice_other_participant_subscribed"
  | "ovice_other_participant_unsubscribed";

const selfEvents: SelfEvent[] = [
  "ovice_participant_joined",
  "ovice_participant_left",
  "ovice_participant_subscribed",
  "ovice_participant_unsubscribed",
];

const otherParticipantsEvents: OtherParticipantsEvent[] = [
  "ovice_other_participant_joined",
  "ovice_other_participant_left",
  "ovice_other_participant_subscribed",
  "ovice_other_participant_unsubscribed",
];

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
          oldMeeting.participants.push({
            id: payload.id,
            name: payload.name,
            timeSpent: oldMeeting.startTime
              ? Date.now() - oldMeeting.startTime
              : 0,
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
          type: "ovice_emit_to",
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
      if (event.type === "ovice_other_participant_joined") {
        addParticipant(event.payload);
        if (currentUser) {
          sendMeetingDetails(event.payload.id);
        }
      } else if (
        event.type === "ovice_other_participant_left" ||
        event.type === "ovice_other_participant_unsubscribe"
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
            console.log("handleOtherParticipantsEvents part", part);
            console.log("handleOtherParticipantsEvents oldMeeting", oldMeeting);

            if (oldMeeting.elapsedTime) {
              durration = oldMeeting.elapsedTime - (part.timeSpent ?? 0);
            } else if (oldMeeting.startTime) {
              durration = Date.now() - oldMeeting.startTime;
              durration -= part.timeSpent ?? 0;
            }
            console.log(durration / 1000, "s");
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
    [setCurrentUser, setMeeting]
  );

  const handleMessageEvents = useCallback(
    (event: OviceEvent) => {
      if (event.type === "ovice_event_message") {
        if (event.payload.event === "meeting_details") {
          setMeeting(event.payload.message);
        }
      }
    },
    [setMeeting]
  );

  return useCallback(
    (eventData: OviceEvent) => {
      if (selfEvents.includes(eventData.type as SelfEvent)) {
        handleSelfEvents(eventData);
      } else if (
        otherParticipantsEvents.includes(
          eventData.type as OtherParticipantsEvent
        )
      ) {
        handleOtherParticipantsEvents(eventData);
      } else if (eventData.type === "ovice_event_message") {
        handleMessageEvents(eventData);
      }
    },
    [handleMessageEvents, handleOtherParticipantsEvents, handleSelfEvents]
  );
};
