# Multi-user patterns for ovice Custom Plugins

Each user runs an independent copy of the plugin. These patterns come from the example
plugins in `oviceinc/custom-plugins` and solve the recurring problems.

## Choosing a pattern

| Need | Pattern | Example |
| --- | --- | --- |
| Show who is here / who I am | Participant list only | `locate-me`, `meeting-cash-clock` |
| Fire-and-forget actions (buzzer, start/stop) | Broadcast events, optimistic local update | `fast-press-game` |
| One person controls, others follow | Leader election + broadcast | `grouping`, `fast-press-game` |
| Shared editable state everyone sees | Leader-owned cache (`useCacheStore`) | `memo`, `majority` |
| State must survive everyone leaving | Cache + backup to object data store | `majority` (`enableBackup` defaults to `true`) |
| Late joiners need current state | Ask leader via emit (`requestData` → `updateCache`) | `useCacheStore`, `meeting-cash-clock` |

## 1. Leader election

There is no server, so pick one "leader" deterministically on every client:

```js
const isStatic = users.length > 0 && users.every(u => !u.isHost);
// dynamic object: the owner leads. static object: first user in the participants list.
const isLeader = self.isHost === true || (isStatic && String(users[0]?.id) === String(self.id));
```

All clients see the same `ovice_participants` order, so they agree on the leader.
Re-evaluate whenever the participant list changes.

For "anyone linked to the object may control it" use
`self.isHost || (isStatic && isJoined)` instead (fast-press-game, grouping).

## 2. Broadcast with optimistic update

```js
function answer() {
  const entry = { name: self.name, time: Date.now() };
  setResults(prev => [...prev, entry]);            // update myself first
  broadcast('game:answered', entry);               // then tell others
}
onMessage(m => {
  if (String(m.source) === String(self.id)) return; // ignore echo if any
  if (m.event === 'game:answered') setResults(prev => [...prev, m.message]);
});
```

Include everything receivers need in `message` (e.g. the time) — don't make them read
their own clock, or results differ per user.

## 3. Leader-owned shared cache (`useCacheStore`)

Implemented in `examples/*/public/js/hooks/useCacheStore.js`. Protocol (all event names
prefixed `use-cache-`):

| Event | Sender → receiver | Meaning |
| --- | --- | --- |
| `update-request` | follower → all (broadcast) | "please apply this new value". The leader applies it and re-broadcasts. |
| `update-cache` | leader → all / one | authoritative value; everyone replaces their cache. |
| `request-data` | newcomer → all | "I just arrived, send me the current value". Leader answers with `update-cache` via emit. |
| `transfer-data` | leaving leader → next user (emit) | hands the cache and leadership over before leaving. |

Lifecycle:
1. On own `subscribed`/`joined` with empty cache → broadcast `request-data`.
2. Edits: leader broadcasts `update-cache`; followers send `update-request`.
3. On own `unsubscribed` while leader → `transfer-data` to the next user, or, if alone,
   `ovice_save_and_emit_data` as backup.
4. If the leader is alone and the cache differs from the store, it backs up after 5 s.
5. On `ovice_saved_data` with no cache → the leader restores from the store.

Constraints: cache must be a flat object whose values are primitives or plain objects
(no arrays at top level — `majority` stores choices as a comma-joined string).

Usage:

```js
const client = useCustomObjectClient();
const { cache, updateCache } = useCacheStore({ ...client, enableBackup: true });
updateCache({ ...cache, value: newText });
```

## 4. Persistence with the object data store

- Read once on start: `ovice_get_data` → `ovice_saved_data`.
- Write with `ovice_save_and_emit_data`; others receive `ovice_shared_data`, you receive
  `ovice_data_saved_success`.
- It replaces the whole value — always write the full object (`{ ...store, changed }`).
- Concurrent writers overwrite each other: route writes through the leader, or debounce.
- 500 KB max. Still "under development": keep real-time messaging as the primary channel.

## 5. Late-joiner sync without the cache hook

`meeting-cash-clock`: the host listens for `ovice_participant_joined` of *other* users and
`emit`s the full meeting state to `payload.id`:

```js
if (self.isHost && e.type === 'ovice_participant_joined' && !e.payload.isSelf) {
  emitTo(String(e.payload.id), 'meeting_details', meetingState);
}
```

## 6. Refreshing the participant list

The reference client re-sends `ovice_get_participants` 1 s after the last
`ovice_participant_*` event (debounced with `setTimeout`/`clearTimeout`). Do the same
instead of patching the list by hand from individual events.
