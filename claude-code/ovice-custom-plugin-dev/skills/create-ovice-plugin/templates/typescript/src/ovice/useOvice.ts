// React binding for OviceClient (React 18+).
//   const { self, participants, isLeader, client } = useOvice();
//   useOviceMessage<{ n: number }>(client, 'my-plugin:count', m => setCount(m.n));
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { OviceClient, type OviceClientOptions, type OviceSnapshot } from './client';
import type { OviceMessage } from './types';

export function useOvice(options?: OviceClientOptions): OviceSnapshot & { client: OviceClient } {
  const [client] = useState(() => new OviceClient(options));
  useEffect(() => client.start(), [client]);
  const snapshot = useSyncExternalStore(client.subscribe, client.getSnapshot);
  return { ...snapshot, client };
}

/** Listen to one custom event name; the latest handler is always used (no stale closures). */
export function useOviceMessage<T = unknown>(
  client: OviceClient,
  event: string,
  handler: (message: T, raw: OviceMessage<T>) => void,
) {
  const ref = useRef(handler);
  ref.current = handler;
  useEffect(() => client.onMessage<T>(event, (m, raw) => ref.current(m, raw)), [client, event]);
}
