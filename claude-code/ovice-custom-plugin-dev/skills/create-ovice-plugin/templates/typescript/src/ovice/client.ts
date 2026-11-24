// Framework-agnostic client for the ovice Custom Plugin postMessage protocol.
// Usage:
//   const client = new OviceClient();
//   const stop = client.start();            // listens + requests participants (and data)
//   client.on('ovice_message', m => ...);   // returns an unsubscribe function
//   client.broadcast('my-plugin:ping', {});
import {
  type IncomingEvent,
  type ObjectData,
  type OutgoingEvent,
  type OviceMessage,
  type Participant,
  PARTICIPANT_EVENT_TYPES,
  isIncomingEvent,
  normalizeParticipant,
} from './types';

export type OviceSnapshot = {
  /** The user running this iframe (undefined until ovice_participants arrives). */
  self: Participant | undefined;
  /** Everyone subscribed/joined to the object, in ovice's order (same on every client). */
  participants: Participant[];
  /** Latest object data (ovice_saved_data / ovice_shared_data / own saves). */
  data: ObjectData;
  /** Static object = placed in the space, nobody is host. */
  isStaticObject: boolean;
  /** Linked (status "joined") to the object. */
  isJoined: boolean;
  /** Deterministic single leader: dynamic-object owner, or first participant on static objects. */
  isLeader: boolean;
};

type EventOf<T extends IncomingEvent['type']> = Extract<IncomingEvent, { type: T }>;
type Handler<T extends IncomingEvent['type']> = (payload: EventOf<T>['payload']) => void;

export type OviceClientOptions = {
  /** Also request persisted object data on start (data store is "under development"). */
  loadData?: boolean;
  /** Debounce for re-requesting participants after a participant event. */
  refreshDelayMs?: number;
  /** Log every incoming/outgoing message to the console. */
  debug?: boolean;
};

const EMPTY: OviceSnapshot = {
  self: undefined,
  participants: [],
  data: {},
  isStaticObject: false,
  isJoined: false,
  isLeader: false,
};

export class OviceClient {
  private handlers = new Map<string, Set<(payload: unknown) => void>>();
  private changeListeners = new Set<() => void>();
  private refreshTimer: ReturnType<typeof setTimeout> | undefined;
  private snapshot: OviceSnapshot = EMPTY;
  private readonly options: Required<OviceClientOptions>;

  constructor(options: OviceClientOptions = {}) {
    this.options = { loadData: true, refreshDelayMs: 1000, debug: false, ...options };
  }

  /** Start listening. Returns a stop function (use it as a React effect cleanup). */
  start(): () => void {
    const listener = (e: MessageEvent) => this.handle(e.data);
    window.addEventListener('message', listener);
    this.requestParticipants();
    if (this.options.loadData) this.requestData();
    return () => {
      window.removeEventListener('message', listener);
      clearTimeout(this.refreshTimer);
    };
  }

  getSnapshot = (): OviceSnapshot => this.snapshot;

  /** Subscribe to snapshot changes (participants, self, data). */
  subscribe = (listener: () => void): (() => void) => {
    this.changeListeners.add(listener);
    return () => this.changeListeners.delete(listener);
  };

  /** Subscribe to a raw ovice event. Returns an unsubscribe function. */
  on<T extends IncomingEvent['type']>(type: T, handler: Handler<T>): () => void {
    const set = this.handlers.get(type) ?? new Set();
    set.add(handler as (payload: unknown) => void);
    this.handlers.set(type, set);
    return () => set.delete(handler as (payload: unknown) => void);
  }

  /** Subscribe to one custom broadcast/emit event name. */
  onMessage<T = unknown>(event: string, handler: (message: T, raw: OviceMessage<T>) => void) {
    return this.on('ovice_message', raw => {
      if (raw.event !== event) return;
      handler(raw.message as T, raw as OviceMessage<T>);
    });
  }

  requestParticipants() {
    this.post({ type: 'ovice_get_participants' });
  }

  requestData() {
    this.post({ type: 'ovice_get_data' });
  }

  /** Send to everyone on the object. Message max 2 MB. You may not receive your own copy. */
  broadcast(event: string, message: unknown) {
    this.post({ type: 'ovice_broadcast_message', payload: { event, message } });
  }

  /** Send to one user. Message max 2 MB. */
  emit(to: string | number, event: string, message: unknown) {
    this.post({ type: 'ovice_emit_message', payload: { event, message, to: String(to) } });
  }

  /** Persist the whole object data (max 500 KB, last write wins) and push it to others. */
  saveData(data: ObjectData) {
    this.setSnapshot({ data });
    this.post({ type: 'ovice_save_and_emit_data', payload: data });
  }

  private post(message: OutgoingEvent) {
    if (this.options.debug) console.debug('[ovice →]', message);
    window.parent.postMessage(message, '*');
  }

  private handle(data: unknown) {
    if (!isIncomingEvent(data)) return;
    if (this.options.debug) console.debug('[ovice ←]', data);

    switch (data.type) {
      case 'ovice_participants': {
        const participants = (data.payload ?? [])
          .filter(p => p && p.id != null && p.workspaceId != null)
          .map(normalizeParticipant);
        this.setSnapshot({
          participants,
          self: participants.find(p => p.isSelf) ?? this.snapshot.self,
        });
        break;
      }
      case 'ovice_saved_data':
      case 'ovice_shared_data':
        this.setSnapshot({ data: data.payload ?? {} });
        break;
      case 'ovice_confirmation':
        // Undocumented handshake kept for compatibility with the reference client.
        this.post({ type: 'ovice_ready_confirmed' });
        break;
      default:
        if ((PARTICIPANT_EVENT_TYPES as readonly string[]).includes(data.type)) {
          const p = normalizeParticipant(data.payload as never);
          if (p.isSelf) this.setSnapshot({ self: p });
          this.scheduleRefresh();
        }
    }

    this.handlers.get(data.type)?.forEach(h => h(data.payload));
  }

  private scheduleRefresh() {
    clearTimeout(this.refreshTimer);
    this.refreshTimer = setTimeout(() => this.requestParticipants(), this.options.refreshDelayMs);
  }

  private setSnapshot(patch: Partial<OviceSnapshot>) {
    const next = { ...this.snapshot, ...patch };
    const { self, participants } = next;
    next.isStaticObject = participants.length > 0 && participants.every(p => !p.isHost);
    next.isJoined = !!self && participants.some(p => p.id === self.id && p.status === 'joined');
    next.isLeader =
      !!self && (self.isHost === true || (next.isStaticObject && participants[0]?.id === self.id));
    this.snapshot = next;
    this.changeListeners.forEach(l => l());
  }
}
