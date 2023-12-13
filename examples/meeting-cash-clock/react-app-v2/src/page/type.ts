import { Meeting } from "../context/MeetingContext";

export type UpdateCostPerHourEvent = {
  type: "update_cost_per_hour";
  data: {
    meetingId: string;
    hosterId: string;
    newCost: number;
  };
};

export type OvicePayloadType = {
  name: string;
  id: string;
  objectId: string;
  objectType: string;
  isHost?: boolean;
  isSelf: boolean;
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

type OviceMessageEventPayload = {
  source: string;
  event: "meeting_details";
  objectId: string;
  to: string;
  message: Meeting;
};

type OviceMessageEvent = {
  type: "ovice_message";
  payload: OviceMessageEventPayload;
};

export type OviceEvent =
  | OviceParticipantJoinedEvent
  | OviceParticipantLeftEvent
  | OviceParticipantUnSubscribedEvent
  | OviceParticipantSubscribedEvent
  | OviceMessageEvent;
