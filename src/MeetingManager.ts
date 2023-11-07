import { Meeting, Participant } from "./type";
import { millisecondsToSeconds } from "date-fns";

export class MeetingManager {
  private meetings: Meeting[] = [];
  private static instance: MeetingManager;
  private constructor() {}

  public static getInstance(): MeetingManager {
    if (!MeetingManager.instance) {
      MeetingManager.instance = new MeetingManager();
    }

    return MeetingManager.instance;
  }

  createMeeting(id: string): Meeting {
    const meeting = this.meetings.find((m) => m.id === id);
    if (meeting) {
      return meeting;
    }
    const newMeeting: Meeting = {
      id,
      status: "ready",
      costPerHour: 0,
      participants: [],
      hoster: null,
      startTime: null,
      elapsedTime: null,
    };
    this.meetings.push(newMeeting);
    return newMeeting;
  }

  getMeeting(id: string): Meeting | undefined {
    return this.meetings.find((m) => m.id === id);
  }

  private canAddParticipant(id: string, meeting: Meeting) {
    return meeting.participants.findIndex((valuey) => valuey.id === id) === -1;
  }

  joinMeeting(
    meetingId: string,
    participant: Participant
  ): Meeting | undefined {
    const meeting = this.getMeeting(meetingId);
    if (meeting && this.canAddParticipant(participant.id, meeting)) {
      if (!meeting.hoster?.id && !meeting.participants.length) {
        meeting.hoster = {
          id: participant.id,
          name: participant.name,
          socket: participant.socket,
        };
      }
      if (
        meeting.status === "started" &&
        meeting.hoster?.id !== participant.id
      ) {
        const now = Date.now();
        participant.elapsedTime = now - Number(meeting.startTime);
      }
      if (meeting.hoster?.id !== participant.id) {
        meeting.participants.push(participant);
      }
      return meeting;
    }
    return undefined;
  }

  leaveMeeting(meetingId: string, participantId: string): Meeting | undefined {
    const meeting = this.getMeeting(meetingId);
    if (meeting) {
      if (meeting.hoster?.id === participantId) {
        meeting.hoster = null;
      } else {
        meeting.participants = meeting.participants.filter(
          (p) => p.id !== participantId
        );
      }
      return meeting;
    }
    return undefined;
  }

  startMeeting(
    meetingId: string,
    hostId: string,
    costPerHour: number
  ): Meeting | undefined {
    const meeting = this.getMeeting(meetingId);
    if (meeting && meeting.hoster?.id === hostId) {
      meeting.status = "started";
      const now = Date.now();
      meeting.startTime = now;
      meeting.costPerHour = costPerHour;
      meeting.participants = meeting.participants.map((participant) => ({
        ...participant,
        elapsedTime: null,
        timeSpent: null,
        totalCost: null,
      }));
      return meeting;
    }
    return undefined;
  }

  pauseMeeting(
    meetingId: string,
    hostId: string,
    elapsedTime: number
  ): Meeting | undefined {
    const meeting = this.getMeeting(meetingId);
    if (
      meeting &&
      meeting.hoster?.id === hostId &&
      meeting.status === "started"
    ) {
      meeting.status = "paused";
      meeting.startTime = Date.now();
      meeting.elapsedTime = elapsedTime;
      return meeting;
    }
    return undefined;
  }

  formatTime(elapsedTime: number) {
    const totalSeconds = Math.floor(elapsedTime / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  }

  stopMeeting(
    meetingId: string,
    hostId: string,
    elapsedTime: number
  ): Meeting | undefined {
    const meeting = this.getMeeting(meetingId);
    if (meeting && meeting.hoster?.id === hostId) {
      meeting.status = "ended";
      meeting.elapsedTime = elapsedTime;
      meeting.participants = meeting.participants.map((participant) => {
        let durration = 0;
        if (participant.elapsedTime) {
          durration = elapsedTime - Number(participant.elapsedTime);
        } else {
          durration = elapsedTime;
        }

        const totalCost =
          (millisecondsToSeconds(durration) / 3600) * meeting.costPerHour;
        return {
          ...participant,
          timeSpent: durration,
          totalCost: totalCost,
        };
      });
      return meeting;
    }
    return undefined;
  }

  resumeMeeting(
    meetingId: string,
    hostId: string,
    elapsedTime: number
  ): Meeting | undefined {
    const meeting = this.getMeeting(meetingId);
    if (meeting && meeting.hoster?.id === hostId) {
      meeting.status = "started";
      meeting.startTime = Date.now();
      meeting.elapsedTime = elapsedTime;
      return meeting;
    }
    return undefined;
  }

  resetMeeting(meetingId: string, hostId: string): Meeting | undefined {
    const meeting = this.getMeeting(meetingId);
    if (meeting && meeting.hoster?.id === hostId) {
      meeting.status = "ready";
      meeting.startTime = null;
      meeting.elapsedTime = null;
      meeting.participants = meeting.participants.map((participant) => ({
        ...participant,
        elapsedTime: null,
        timeSpent: null,
        totalCost: null,
      }));
      return meeting;
    }
    return undefined;
  }

  endMeeting(meetingId: string): void {
    const meeting = this.getMeeting(meetingId);
    if (meeting && !meeting.participants.length && !meeting.hoster) {
      this.meetings = this.meetings.filter((m) => m.id !== meetingId);
    }
  }

  getMeetingParticpants(meetingId: string): Participant[] {
    const meeting = this.getMeeting(meetingId);
    if (!meeting) {
      return [];
    }
    return meeting.participants;
  }

  getMeetings(): Meeting[] {
    return this.meetings;
  }

  updateMeetingCost(
    meetingId: string,
    cost: number,
    hosterId: string
  ): Meeting | undefined {
    const meeting = this.getMeeting(meetingId);
    if (!meeting || meeting.hoster?.id !== hosterId) {
      return undefined;
    }
    meeting.costPerHour = cost;
    return meeting;
  }
}
