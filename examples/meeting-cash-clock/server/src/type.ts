import { WebSocket } from "ws";

type MeetingStatus = "ready" | "started" | "ended" | "paused";
export type Participant = {
  id: string;
  name: string;
  socket: WebSocket;
  elapsedTime?: number | null;
  timeSpent: number | null;
  totalCost: number | null;
};

export type Hoster = Pick<Participant, "id" | "name" | "socket">;
export type Meeting = {
  id: string;
  hoster: Hoster | null;
  costPerHour: number;
  startTime?: number | null;
  elapsedTime?: number | null;
  status: MeetingStatus;
  participants: Participant[];
};

export type MeetingDetails = {
  participants: Omit<Participant, "socket" | "elapsedTime">[];
} & Omit<Meeting, "hoster" | "participants">;

export type JoinMeetingEvent = {
  type: "join_meeting";
  data: {
    meetingId: string;
    participantName: string;
    participantId: string;
  };
};

export type LeaveMeetingEvent = {
  type: "leave_meeting";
  data: {
    participantId: string;
    meetingId: string;
  };
};

export type MeetingDetailsEvent = {
  type: "meeting_details";
  data: MeetingDetails;
};

export type MeetingCostUpdatedEvent = {
  type: "meeting_cost_updated";
  data: {
    meetingId: string;
    costPerHour: number;
  };
};

export type ParticipantAssignedAsHostEvent = {
  type: "participant_assigned_as_host";
  data: MeetingDetails;
};

export type MeetingEvent =
  | JoinMeetingEvent
  | LeaveMeetingEvent
  | MeetingDetailsEvent
  | MeetingCostUpdatedEvent;

export type StartTimerEvent = {
  type: "start_timer";
  data: {
    meetingId: string;
    participantId: string;
    costPerHour: number;
  };
};

export type PauseTimerEvent = {
  type: "pause_timer";
  data: {
    meetingId: string;
    participantId: string;
    elapsedTime: number;
  };
};

export type ResumeTimerEvent = {
  type: "resume_timer";
  data: {
    meetingId: string;
    participantId: string;
    elapsedTime: number;
  };
};

export type StopTimerEvent = {
  type: "stop_timer";
  data: {
    meetingId: string;
    participantId: string;
    elapsedTime: number;
  };
};

export type ClearTimerEvent = {
  type: "clear_timer";
  data: {
    meetingId: string;
    participantId: string;
  };
};

export type TimerEvent =
  | StartTimerEvent
  | PauseTimerEvent
  | ResumeTimerEvent
  | StopTimerEvent
  | ClearTimerEvent;

export type UpdateCostPerHourEvent = {
  type: "update_cost_per_hour";
  data: {
    meetingId: string;
    participantId: string;
    newCost: number;
  };
};
export type CostPerHourEvent = UpdateCostPerHourEvent;