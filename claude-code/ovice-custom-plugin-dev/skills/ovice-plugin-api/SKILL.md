---
name: ovice-plugin-api
description: Reference for the ovice Custom Plugin postMessage protocol (ovice_get_participants, ovice_participants, ovice_participant_joined/left/subscribed/unsubscribed, ovice_broadcast_message, ovice_emit_message, ovice_message, ovice_get_data, ovice_save_and_emit_data, ovice_shared_data …), participant payloads, static vs dynamic objects, size limits and multi-user state patterns. Use whenever writing, reviewing or debugging code for an ovice custom plugin / custom object (iframe embedded in an ovice space), or when the user asks about ovice カスタムプラグイン / カスタムオブジェクト のイベント・API・仕様.
---

# ovice Custom Plugin API

An ovice Custom Plugin is an ordinary web page that ovice embeds in an **iframe** attached
to an object in a space. There is no SDK: the page talks to ovice only through
`window.postMessage`.

- **Plugin → ovice**: `window.parent.postMessage({ type, payload? }, '*')`
- **ovice → plugin**: `window.addEventListener('message', e => { const { type, payload } = e.data })`

Every user near the object runs **their own copy** of the page. Anything that must be
shared between users has to go through broadcast/emit messages or the object data store.

## Event map

| Direction | `type` | Purpose |
| --- | --- | --- |
| plugin → ovice | `ovice_get_participants` | Ask for everyone joined/subscribed to the object (incl. self). **Send on startup.** |
| ovice → plugin | `ovice_participants` | Reply: `payload` is an array of participants; find yourself with `isSelf`. |
| ovice → plugin | `ovice_participant_subscribed` / `_joined` / `_left` / `_unsubscribed` | A participant's status changed. `payload` is one participant. |
| plugin → ovice | `ovice_broadcast_message` | Send `{ event, message }` (nothing else) to every *other* user on the object. |
| plugin → ovice | `ovice_emit_message` | Send `{ event, message, to }` (nothing else) to one user. |
| ovice → plugin | `ovice_message` | Delivered broadcast/emit: exactly the sender's `{ event, message, to? }`. **No `source`, no `objectId`.** |
| plugin → ovice | `ovice_get_data` | Read the object's persisted data. *(ignored by production ovice)* |
| ovice → plugin | `ovice_saved_data` | Reply with the persisted object (`payload`). |
| plugin → ovice | `ovice_save_and_emit_data` | Persist `payload` and push it to the other users. *(ignored by production ovice)* |
| ovice → plugin | `ovice_shared_data` | Someone else saved; `payload` is the new data. |
| ovice → plugin | `ovice_data_saved_success` | Your save succeeded; `payload` = saved data (static objects only). |
| ovice → plugin | `ovice_errors` | Your request was rejected (validation, size, rate limit). `payload`: string or string[]. |

Full payload schemas, JSON examples and sequence diagrams: [references/events.md](references/events.md).
Proven multi-user patterns (leader election, shared cache, persistence): [references/patterns.md](references/patterns.md).

## Participant status

- `subscribed` – user is within range of the object but not linked.
- `joined` – user is linked to the object.
- `left` – user was linked and unlinked, but is still in range.
- `unsubscribed` – user moved out of range (from linked or in-range).

## Static vs dynamic objects

- `objectType: "static"` – placed in the space; **nobody** has `isHost: true`.
- `objectType: "dynamic"` – created by a user; that owner has `isHost: true`.

To pick a single "controller" user (game master, data owner…) the examples use:

```js
const isStaticObject = users.length > 0 && users.every(u => !u.isHost);
const isMaster = user.isHost || (isStaticObject && users[0]?.id === user.id);
// or, for "whoever is linked can control it" on static objects:
const isGameMaster = user.isHost || (isStaticObject && isJoined);
```

## Rules and gotchas (check these whenever writing or reviewing plugin code)

These come from the real host (ovice-ui `routes/workspace/SpaceObject/plugins/custom_plugin.tsx`
and `CustomPlugin/schema.ts`). The public spec and older examples differ in places; the host wins.

1. **Send only `{ event, message }` (+ `to`).** The host validates broadcast/emit payloads
   with a *strict* schema. With any extra key (`source`, `objectId`, `from`, …) the request
   is **silently dropped** (you only get `ovice_errors`). The spec's examples that include
   `source`/`objectId` in the payload are wrong. Also: `event` 3–256 chars; `message`
   must be number / string / boolean / object / array of (string | number | boolean | object)
   — `null`, `undefined` (or omitting it) and nested arrays are rejected; `to` must be a string.
2. **Received messages have no sender id.** `ovice_message.payload` is exactly what the
   sender posted. If receivers need to know who sent it (reply with emit, ignore own
   messages, check the leader), put it **inside `message`**, e.g.
   `broadcast('quiz:answer', { from: self.id, ... })`. Never read `payload.source`.
3. **Broadcasts never echo back**, and emitting to yourself is ignored. Update local state
   first, then broadcast.
4. **Request participants on mount and keep refreshing.** The iframe is created when the
   user comes into range, and that user's own `subscribed`/`joined` event fires *before*
   the iframe is ready, so neither the newcomer nor the others receive it. Learn who you
   are from `ovice_get_participants` (`isSelf: true`), re-request ~1 s after any
   `ovice_participant_*` event, and also poll (e.g. every few seconds) so others notice
   newcomers. Never block on a participant event or on a handshake.
5. **Participant events are relayed to everyone.** The user's own iframe gets `isSelf: true`;
   the others get the same payload with `isSelf: false`. Event payloads have **no `status`**
   (derive it from the event type) and spell the language key `languge`. In
   `ovice_participants`, `status` is only `"joined"` or `"subscribed"`.
6. **Rate limit: 100 broadcast/emit/save requests per minute per iframe.** Further requests
   are dropped with `ovice_errors`. Don't send per keystroke, mouse move or timer tick;
   batch or debounce, and send state, not deltas, so a dropped message heals itself.
7. **IDs are strings** (`id`, `workspaceId`, `objectId`). Still compare with
   `String(a) === String(b)` and always send `to` as a string.
8. **The object data store does not work in production.** Production ovice ignores the
   legacy `ovice_get_data` / `ovice_save_and_emit_data` messages (the JSON-RPC variants
   aren't blocked, but the feature is still under development). Never use it for sync or
   as the only copy of state. In dev builds: 50 KB limit, static objects only (dynamic objects
   aren't persisted), last-write-wins.
9. **Message size**: broadcast/emit `message` ≤ 2 MB (checked by the receiver).
10. **Namespace your `event` names** (e.g. `quiz:answer`). Emits go to *every* custom
    plugin iframe the target user has open, not only this object's.
11. **No handshake.** ovice never sends `ovice_confirmation` and ignores `ovice_ready`.
    Answering `ovice_confirmation` (as the reference client does) is harmless but
    never wait for it.
12. **JSON-RPC duplicates.** ovice also posts every event as a JSON-RPC 2.0 notification
    (`{ jsonrpc: '2.0', method, params }`). Dispatch on `data.type` and ignore the rest.
13. **`email` is conditional**: only your own, and only if the organisation owner allowed it.
14. **Visitors/guests** have `isVisitor: true`; decide explicitly whether they can act.
15. **Use `'*'` as targetOrigin when posting to the parent.** When *receiving*, ignore
    messages whose `data.type` does not start with `ovice_`, and never `eval`/render
    untrusted `message` content as HTML. Serve the plugin from the exact registered origin
    (no redirect): ovice ignores messages from other origins.
16. **Layout**: the page runs in a small iframe – design for ~300×350 px and full-height
    (`h-screen`) layouts; avoid modals that assume a large viewport.

## Where to look in this repository

If the current working directory is the `oviceinc/custom-plugins` repository:

- Spec: `docs/technical_details_for_developers.md`
- Canonical client hook (no-build React): `examples/memo/public/js/hooks/useCustomObjectClient.js`
- Shared-state cache with leader hand-off: `examples/memo/public/js/hooks/useCacheStore.js`
- TypeScript/CRA examples: `examples/meeting-cash-clock`, `examples/locate-me`
- Mock ovice host for local testing: the `test-ovice-plugin` skill (`tools/test/` is older
  and much more lenient than real ovice)

Related skills: `create-ovice-plugin` (scaffold a new plugin), `test-ovice-plugin`
(run it against a mock ovice host).
