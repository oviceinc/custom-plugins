// Types for the ovice Custom Plugin postMessage protocol.
// Spec: https://github.com/oviceinc/custom-plugins/blob/main/docs/technical_details_for_developers.md
// Checked against the real host (ovice-ui custom_plugin.tsx); see the ovice-plugin-api skill.

export type ParticipantStatus = 'subscribed' | 'joined' | 'left' | 'unsubscribed';
export type ObjectType = 'static' | 'dynamic';

/** Participant as sent by ovice. ids may be numbers: use `normalizeParticipant`. */
export type RawParticipant = {
  id: string | number;
  name: string;
  avatarUrl: string;
  objectId: string | number;
  objectType: ObjectType;
  workspaceId: string | number;
  isSelf?: boolean;
  isHost?: boolean;
  isVisitor?: boolean;
  /** Only in ovice_participants ("joined" | "subscribed"); events have no status. */
  status?: ParticipantStatus;
  /** Events only; ovice spells it `languge`. */
  languge?: string;
  /** Only when the org owner allows it in the custom plugin settings. */
  email?: string;
};

/** Participant with ids normalised to strings. */
export type Participant = Omit<RawParticipant, 'id' | 'objectId' | 'workspaceId'> & {
  id: string;
  objectId: string;
  workspaceId: string;
};

/**
 * A delivered broadcast/emit: exactly what the sender posted. ovice adds no `source` and no
 * `objectId`; put the sender id inside `message` when receivers need it.
 */
export type OviceMessage<T = unknown> = {
  event: string;
  message: T;
  /** Only for direct (emit) messages. */
  to?: string;
};

/**
 * Allowed `message` values (ovice rejects anything else, including null/undefined and
 * nested arrays).
 */
export type MessageValue =
  | string
  | number
  | boolean
  | Record<string, unknown>
  | Array<string | number | boolean | Record<string, unknown>>;

export type ObjectData = Record<string, unknown>;

/** Messages ovice posts into the plugin iframe. */
export type IncomingEvent =
  | { type: 'ovice_participants'; payload: RawParticipant[] }
  | { type: 'ovice_participant_subscribed'; payload: RawParticipant }
  | { type: 'ovice_participant_unsubscribed'; payload: RawParticipant }
  | { type: 'ovice_participant_joined'; payload: RawParticipant }
  | { type: 'ovice_participant_left'; payload: RawParticipant }
  | { type: 'ovice_message'; payload: OviceMessage }
  | { type: 'ovice_saved_data'; payload: ObjectData }
  | { type: 'ovice_shared_data'; payload: ObjectData }
  | { type: 'ovice_data_saved_success'; payload: ObjectData & { updated_at?: number } }
  | { type: 'ovice_errors'; payload: string | string[] }
  | { type: 'ovice_confirmation'; payload?: undefined };

/** Messages the plugin posts to ovice (window.parent). */
export type OutgoingEvent =
  | { type: 'ovice_get_participants' }
  | { type: 'ovice_get_data' }
  | { type: 'ovice_save_and_emit_data'; payload: ObjectData }
  | { type: 'ovice_broadcast_message'; payload: { event: string; message: MessageValue } }
  | { type: 'ovice_emit_message'; payload: { event: string; message: MessageValue; to: string } }
  | { type: 'ovice_ready_confirmed' };

export const PARTICIPANT_EVENT_TYPES = [
  'ovice_participant_subscribed',
  'ovice_participant_unsubscribed',
  'ovice_participant_joined',
  'ovice_participant_left',
] as const;

export const normalizeParticipant = (p: RawParticipant): Participant => ({
  ...p,
  id: String(p.id),
  objectId: String(p.objectId),
  workspaceId: String(p.workspaceId),
  name: (p.name ?? '').replace(/\s+/g, ' '),
});

export const isIncomingEvent = (data: unknown): data is IncomingEvent =>
  typeof data === 'object' &&
  data !== null &&
  typeof (data as { type?: unknown }).type === 'string' &&
  (data as { type: string }).type.startsWith('ovice_');
