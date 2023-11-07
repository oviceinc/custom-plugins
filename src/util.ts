import { WebSocket } from "ws";
import {
  Meeting,
  MeetingCostUpdatedEvent,
  MeetingDetails,
  MeetingDetailsEvent,
  Participant,
  ParticipantAssignedAsHostEvent,
} from "./type";

export const sendMessage = (
  ws: WebSocket,
  payload:
    | MeetingDetailsEvent
    | MeetingCostUpdatedEvent
    | ParticipantAssignedAsHostEvent
) => {
  ws.send(JSON.stringify(payload));
};

export const sendMessageToParticipants = (
  meeting: Meeting,
  payload: MeetingDetailsEvent | MeetingCostUpdatedEvent
) => {
  meeting?.participants.forEach((participant) => {
    if (participant.socket?.readyState === WebSocket.OPEN) {
      sendMessage(participant.socket, payload);
    }
  });
};

export const sendMeetingDetailsToParticipants = (meeting: Meeting) => {
  sendMessageToParticipants(meeting, {
    type: "meeting_details",
    data: toMeetingDetails(meeting),
  });
};

export const sendMeetingDetailsToSelf = (ws: WebSocket, meeting: Meeting) => {
  sendMessage(ws, {
    type: "meeting_details",
    data: toMeetingDetails(meeting),
  });
};

export const toMeetingDetails = (meeting: Meeting): MeetingDetails => {
  return {
    id: meeting.id,
    costPerHour: meeting.costPerHour,
    startTime: meeting.startTime,
    elapsedTime: meeting.elapsedTime,
    status: meeting.status,
    participants: meeting.participants.map((participant) => {
      return {
        id: participant.id,
        name: participant.name,
        timeSpent: participant.timeSpent,
        totalCost: participant.totalCost,
      };
    }),
  };
};

export const buildParticipant = (
  id: string,
  name: string,
  ws: WebSocket
): Participant => {
  return {
    id,
    name,
    socket: ws,
    timeSpent: null,
    elapsedTime: null,
    totalCost: null,
  };
};
