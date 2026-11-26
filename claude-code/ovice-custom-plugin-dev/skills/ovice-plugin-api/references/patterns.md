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
| State must survive everyone leaving | Not possible in production (data store is ignored there) | `majority` backup works only in dev builds |
| Late joiners need current state | Newcomer asks on start, leader answers via emit (`request-data` → `update-cache`) | `useCacheStore` |

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
  const entry = { from: self.id, name: self.name, time: Date.now() };
  setResults(prev => [...prev, entry]);            // update myself first (no echo comes back)
  broadcast('game:answered', entry);               // then tell others
}
onMessage(m => {
  // ovice_message has no `source`: the sender id is whatever you put in `message`.
  if (m.event === 'game:answered') setResults(prev => [...prev, m.message]);
});
```

Include everything receivers need in `message` (e.g. the time) — don't make them read
their own clock, or results differ per user. Include `from: self.id` whenever a receiver
must know the sender (to reply, to check that it came from the leader, …).

Never add extra keys next to `event`/`message` (`source`, `objectId`, …): ovice rejects the
whole request. Never send `message: undefined` or `null` (use `{}`).

## 3. Leader-owned shared cache (`useCacheStore`)

Implemented in `examples/*/public/js/hooks/useCacheStore.js`. Protocol (all event names
prefixed `use-cache-`):

| Event | Sender → receiver | Meaning |
| --- | --- | --- |
| `update-request` | follower → all (broadcast) | "please apply this new value". The leader applies it and re-broadcasts. |
| `update-cache` | leader → all / one | authoritative value; everyone replaces their cache. |
| `request-data` | newcomer → all | "I just arrived, send me the current value". `message` is `{ from: <newcomer id> }`; the leader answers with `update-cache` via emit to `message.from`. |
| `transfer-data` | leaving leader → next user (emit) | hands the cache and leadership over before leaving. |

Lifecycle:
1. As soon as the own user is known (from `ovice_participants`) and the cache is empty →
   broadcast `request-data`. Don't wait for an own `subscribed`/`joined` event: ovice
   loses it on startup.
2. Edits: leader broadcasts `update-cache`; followers send `update-request`.
3. On own `unsubscribed` while leader → `transfer-data` to the next user, or, if alone,
   `ovice_save_and_emit_data` as backup (dev builds only).
4. If the leader is alone and the cache differs from the store, it backs up after 5 s
   (dev builds only).
5. On `ovice_saved_data` with no cache → the leader restores from the store (dev builds only).

In production steps 3–5 do nothing, so state survives only while somebody is on the object.

Constraints: cache must be a flat object whose values are primitives or plain objects
(no arrays at top level — `majority` stores choices as a comma-joined string).

Usage:

```js
const client = useCustomObjectClient();
const { cache, updateCache } = useCacheStore({ ...client, enableBackup: true });
updateCache({ ...cache, value: newText });
```

## 4. Persistence with the object data store

**Production ovice ignores `ovice_get_data` / `ovice_save_and_emit_data`.** Treat the data
store as an optional extra that only works in dev builds; the plugin must sync correctly
without it. In dev builds:

- Read once on start: `ovice_get_data` → `ovice_saved_data`.
- Write with `ovice_save_and_emit_data`; others receive `ovice_shared_data`, you receive
  `ovice_data_saved_success` (static objects only).
- It replaces the whole value — always write the full object (`{ ...store, changed }`).
- Concurrent writers overwrite each other: route writes through the leader, or debounce.
- 50 KB max. Dynamic objects aren't persisted.

## 5. Late-joiner sync

A newcomer's arrival produces **no** event: ovice fires the initial `subscribed`/`joined`
before the newcomer's iframe exists and loses it, and the relay to the others is lost too.
So the newcomer has to ask:

```js
// newcomer, once self is known from ovice_participants and it has no state yet
broadcast('game:request-state', { from: self.id });

// leader
onMessage(m => {
  if (m.event === 'game:request-state') emitTo(String(m.message.from), 'game:state', state);
});
```

Retry the request every few seconds until state arrives (the leader may not have loaded
yet). The leader can additionally push state when it sees another user's
`ovice_participant_joined`, which *is* delivered when someone links later.

## 6. Refreshing the participant list

The reference client re-sends `ovice_get_participants` 1 s after the last
`ovice_participant_*` event (debounced with `setTimeout`/`clearTimeout`). Do the same
instead of patching the list by hand from individual events, and also poll every few
seconds: newcomers don't produce an event.

## 7. Staying under the rate limit

ovice drops broadcast/emit/save requests beyond **100 per minute per iframe**. Send on
discrete user actions, not per keystroke, mouse move or animation frame; debounce text
input; send full state (not deltas) so that one dropped message is repaired by the next.
