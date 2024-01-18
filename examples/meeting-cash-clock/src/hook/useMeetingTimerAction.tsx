import { useCallback } from "react";
import { useMeetingContext } from "../context/MeetingContext";
import { usePostMessageMeetingDetails } from "./useIframePostMessage";
import { millisecondsToSeconds } from "date-fns";

export const useMeetingTimerAction = () => {
  const { meeting, currentUser, setMeeting } = useMeetingContext();
  const postMessageMeetingDetails = usePostMessageMeetingDetails();

  const startMeeting = useCallback(
    (startTime: number) => {
      if (meeting?.status !== "ready" || !currentUser) {
        return;
      }
      setMeeting((prev) => {
        if (!prev) {
          return prev;
        }
        const meeting = { ...prev };
        meeting.startTime = startTime;
        meeting.status = "started";
        meeting.participants = meeting.participants
          .filter((part) => !part.left)
          .map((participant) => {
            return {
              ...participant,
              joinedAt: Date.now(),
              elapsedTime: 0,
              timeSpent: 0,
              totalCost: 0,
            };
          });
        postMessageMeetingDetails(meeting, currentUser);
        return meeting;
      });
    },
    [currentUser, meeting?.status, postMessageMeetingDetails, setMeeting]
  );
  const pasuseMeeting = useCallback(
    (elapsedTime: number, startTime: number) => {
      if (meeting?.status !== "started" || !currentUser) {
        return;
      }
      setMeeting((prev) => {
        if (!prev) {
          return prev;
        }
        const meeting = { ...prev };
        meeting.elapsedTime = elapsedTime;
        meeting.status = "paused";
        meeting.participants = meeting.participants.map((participant) => {
          if (!participant.left) {
            return {
              ...participant,
              elapsedTime:
                participant.elapsedTime +
                (startTime - Number(participant.joinedAt)),
              joinedAt: startTime,
            };
          }
          return participant;
        });
        postMessageMeetingDetails(meeting, currentUser);
        return meeting;
      });
    },
    [currentUser, meeting?.status, postMessageMeetingDetails, setMeeting]
  );
  const resumeMeeting = useCallback(
    (elapsedTime: number, startTime: number) => {
      if (meeting?.status !== "paused" || !currentUser) {
        return;
      }
      setMeeting((prev) => {
        if (!prev) {
          return prev;
        }
        const meeting = { ...prev };
        meeting.startTime = startTime;
        meeting.elapsedTime = elapsedTime;
        meeting.status = "started";
        meeting.participants = meeting.participants.map((participant) => {
          if (!participant.left) {
            return {
              ...participant,
              joinedAt: startTime,
            };
          }
          return participant;
        });
        postMessageMeetingDetails(meeting, currentUser);
        return meeting;
      });
    },
    [currentUser, meeting?.status, postMessageMeetingDetails, setMeeting]
  );
  const stopMeeting = useCallback(
    (elapsedTime: number, endTime: number) => {
      if (
        meeting.status === "ended" ||
        meeting.status === "ready" ||
        !currentUser
      ) {
        return;
      }
      setMeeting((prev) => {
        if (!prev) {
          return prev;
        }
        const meeting = { ...prev };
        meeting.elapsedTime = elapsedTime;
        meeting.status = "ended";
        meeting.participants = meeting.participants.map((participant) => {
          let durration = 0;
          if (participant.leftAt) {
            durration =
              Number(participant.leftAt) -
              Number(participant.joinedAt) +
              participant.elapsedTime;
          } else {
            durration =
              endTime - Number(participant.joinedAt) + participant.elapsedTime;
          }
          const totalCost =
            (millisecondsToSeconds(durration) / 3600) * meeting.costPerHour;
          return {
            ...participant,
            timeSpent: durration,
            totalCost: totalCost,
          };
        });
        postMessageMeetingDetails(meeting, currentUser);
        return meeting;
      });
    },
    [currentUser, meeting?.status, postMessageMeetingDetails, setMeeting]
  );
  const clearMeeting = useCallback(() => {
    if (meeting?.status !== "ended" || !currentUser) {
      return;
    }
    setMeeting((prev) => {
      if (!prev) {
        return prev;
      }
      const meeting = { ...prev };
      meeting.startTime = null;
      meeting.elapsedTime = null;
      meeting.status = "ready";
      meeting.participants = meeting.participants
        .filter((part) => !part.left)
        .map((participant) => {
          return {
            ...participant,
            timeSpent: 0,
            totalCost: 0,
          };
        });
      postMessageMeetingDetails(meeting, currentUser);
      return meeting;
    });
  }, [currentUser, meeting?.status, postMessageMeetingDetails, setMeeting]);

  return {
    startMeeting,
    pasuseMeeting,
    resumeMeeting,
    stopMeeting,
    clearMeeting,
  };
};
