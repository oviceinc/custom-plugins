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
  isHost: boolean;
  isSelf: boolean;
  status: 'joined' | 'subscribed'
};

type OviceParticipantJoinedEvent = {
  type: "ovice_participant_joined";
  payload: OvicePayloadType;
};

type OviceParticipantLeftEvent = {
  type: "ovice_participant_left";
  payload: OvicePayloadType;
};

export type GetParticipantsRequest = {
  type: 'ovice_get_participants'
}

type OviceParticipantSubscribedEvent = {
  type: "ovice_participant_subscribed";
  payload: OvicePayloadType;
};

type OviceParticipantUnSubscribedEvent = {
  type: "ovice_participant_unsubscribed";
  payload: OvicePayloadType;
};

type CustomPluginParticipantsEvent = {
  type: 'ovice_participants'
  payload: OvicePayloadType[]
}

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
  | CustomPluginParticipantsEvent
  | OviceMessageEvent;
