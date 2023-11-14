type MeetingStatus = "ready" | "started" | "ended" | "paused";
export type Participant = {
  id: string;
  name: string;
  timeSpent: number | null;
  totalCost: number | null;
};
export type Meeting = {
  id: string;
  costPerHour: number;
  startTime?: number | null;
  elapsedTime?: number | null;
  status: MeetingStatus;
  participants: Participant[];
};

export type JoinMeetingEvent = {
  type: "join_meeting";
  data: {
    meetingId: string;
    participantName: string;
    isHost?: boolean;
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
  data: Meeting;
};

export type MeetingCostUpdatedEvent = {
  type: "meeting_cost_updated";
  data: {
    id: string | number;
    costPerHour: number;
  };
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
    hosterId: string;
  };
};

export type PauseTimerEvent = {
  type: "pause_timer";
  data: {
    meetingId: string;
    hosterId: string;
  };
};

export type ResumeTimerEvent = {
  type: "resume_timer";
  data: {
    meetingId: string;
    hosterId: string;
  };
};

export type StopTimerEvent = {
  type: "stop_timer";
  data: {
    meetingId: string;
    hosterId: string;
  };
};

export type ClearTimerEvent = {
  type: "clear_timer";
  data: {
    meetingId: string;
    hosterId: string;
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
    hosterId: string;
    newCost: number;
  };
};
export type CostPerHourEvent = UpdateCostPerHourEvent;

export type ParticipantAssignedAsHostEvent = {
  type: "participant_assigned_as_host";
  data: Meeting;
};

export type MessageEvents =
  | CostPerHourEvent
  | MeetingEvent
  | ParticipantAssignedAsHostEvent;

type OvicePayloadType = {
  name: string;
  objectId: string;
};

type OviceParticipantJoinedEvent = {
  type: "ovice_participant_joined";
  payload: OvicePayloadType;
};

type OviceParticipantLeftEvent = {
  type: "ovice_participant_left";
  payload: OvicePayloadType;
};

type OviceParticipantSubscribedEvent = {
  type: "ovice_participant_subscribed";
  payload: OvicePayloadType;
};

type OviceParticipantUnSubscribedEvent = {
  type: "ovice_participant_unsubscribed";
  payload: OvicePayloadType;
};

type OviceParticipantsEvent = {
  type: "ovice_participants";
  payload: OvicePayloadType[];
};

export type OviceEvent =
  | OviceParticipantJoinedEvent
  | OviceParticipantLeftEvent
  | OviceParticipantUnSubscribedEvent
  | OviceParticipantSubscribedEvent
  | OviceParticipantsEvent;
