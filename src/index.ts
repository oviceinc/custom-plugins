import * as WebSocket from "ws";
import http from "http";
import express from "express";
import {
  CostPerHourEvent,
  MeetingEvent,
  ParticipantAssignedAsHostEvent,
  TimerEvent,
} from "./type";
import { MeetingManager } from "./MeetingManager";
import {
  buildParticipant,
  sendMeetingDetailsToParticipants,
  sendMeetingDetailsToSelf,
  sendMessage,
  sendMessageToParticipants,
  toMeetingDetails,
} from "./util";

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve the HTML file
app.use(express.static("public"));

// WebSocket server
wss.on("connection", (ws: WebSocket) => {
  ws.on("message", (message: string) => {
    try {
      const event:
        | MeetingEvent
        | TimerEvent
        | CostPerHourEvent
        | ParticipantAssignedAsHostEvent = JSON.parse(message);
      if (event.type === "join_meeting") {
        const { meetingId, participantId, participantName } = event.data;
        MeetingManager.getInstance().createMeeting(meetingId);
        const newParticpant = buildParticipant(
          participantId,
          participantName,
          ws
        );
        const meeting = MeetingManager.getInstance().joinMeeting(
          meetingId,
          newParticpant
        );
        if (meeting) {
          if (meeting.hoster) {
            if (participantId === meeting.hoster.id) {
              sendMessage(ws, {
                type: "participant_assigned_as_host",
                data: toMeetingDetails(meeting),
              });
            } else {
              sendMeetingDetailsToSelf(meeting.hoster.socket, meeting);
            }
          }
          sendMeetingDetailsToParticipants(meeting);
        }
      } else if (event.type === "leave_meeting") {
        const { meetingId, participantId } = event.data;
        console.log("leave_meeting", meetingId, participantId)
        const meeting = MeetingManager.getInstance().leaveMeeting(
          meetingId,
          participantId
        );
        if (meeting) {
          if(meeting.hoster) {
            sendMeetingDetailsToSelf(meeting.hoster.socket, meeting)
          }
          sendMeetingDetailsToParticipants(meeting);
        }
        MeetingManager.getInstance().endMeeting(meetingId);
      } else if (event.type === "start_timer") {
        const { meetingId, participantId, costPerHour } = event.data;
        const meeting = MeetingManager.getInstance().startMeeting(
          meetingId,
          participantId,
          costPerHour
        );
        if (meeting) {
          sendMeetingDetailsToParticipants(meeting);
        }
      } else if (event.type === "pause_timer") {
        const { meetingId, participantId, elapsedTime } = event.data;
        const meeting = MeetingManager.getInstance().pauseMeeting(
          meetingId,
          participantId,
          elapsedTime
        );
        if (meeting) {
          sendMeetingDetailsToParticipants(meeting);
        }
      } else if (event.type === "resume_timer") {
        const { meetingId, participantId, elapsedTime } = event.data;
        const meeting = MeetingManager.getInstance().resumeMeeting(
          meetingId,
          participantId,
          elapsedTime
        );
        if (meeting) {
          sendMeetingDetailsToParticipants(meeting);
        }
      } else if (event.type === "stop_timer") {
        const { meetingId, participantId, elapsedTime } = event.data;
        const meeting = MeetingManager.getInstance().stopMeeting(
          meetingId,
          participantId,
          elapsedTime
        );
        if (meeting) {
          if (meeting.hoster) {
            sendMeetingDetailsToSelf(meeting.hoster.socket, meeting);
          }
          sendMeetingDetailsToParticipants(meeting);
        }
      } else if (event.type === "clear_timer") {
        const { meetingId, participantId } = event.data;
        const meeting = MeetingManager.getInstance().resetMeeting(
          meetingId,
          participantId
        );
        if (meeting) {
          if (meeting.hoster) {
            sendMeetingDetailsToSelf(meeting.hoster.socket, meeting);
          }
          sendMeetingDetailsToParticipants(meeting);
        }
      } else if (event.type === "update_cost_per_hour") {
        const { meetingId, newCost, participantId } = event.data;
        const meeting = MeetingManager.getInstance().updateMeetingCost(
          meetingId,
          newCost,
          participantId
        );
        if (meeting) {
          sendMessageToParticipants(meeting, {
            type: "meeting_cost_updated",
            data: {
              meetingId: meeting.id,
              costPerHour: newCost,
            },
          });
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        ws.send(JSON.stringify({ error: error.message }));
      } else if (typeof error === "string") {
        ws.send(JSON.stringify({ error: error }));
      }
      console.error("Error processing WebSocket message:", error);
    }
  });

  ws.on("close", () => {
    // Handle participant leaving the meeting
    const meetings = MeetingManager.getInstance().getMeetings();
    for (const meeting of meetings) {
      const isHoster = meeting.hoster?.socket === ws;
      const participantToRemove = isHoster
        ? meeting.hoster
        : meeting.participants.find((part) => part.socket === ws);
      if (participantToRemove) {
        const updatedMeeting = MeetingManager.getInstance().leaveMeeting(
          meeting.id,
          participantToRemove.id
        );
        if (updatedMeeting) {
          sendMeetingDetailsToParticipants(updatedMeeting);
          if (!isHoster && meeting.hoster) {
            sendMeetingDetailsToSelf(meeting.hoster?.socket, updatedMeeting);
          }
          MeetingManager.getInstance().endMeeting(updatedMeeting.id);
        }

        break;
      }
    }
  });
});

// Start the server
server.listen(4000, () => {
  console.log("Server is running on port 3000");
});

app.listen(8000, () => {
  console.log("Server successfully running on port 8080");
});
