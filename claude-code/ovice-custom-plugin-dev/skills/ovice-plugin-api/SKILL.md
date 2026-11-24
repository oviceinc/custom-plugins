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
| plugin → ovice | `ovice_broadcast_message` | Send `{ event, message }` to every user on the object. |
| plugin → ovice | `ovice_emit_message` | Send `{ event, message, to }` to one user. |
| ovice → plugin | `ovice_message` | Delivered broadcast/emit: `{ source, event, objectId, message, to? }`. |
| plugin → ovice | `ovice_get_data` | Read the object's persisted data. *(under development)* |
| ovice → plugin | `ovice_saved_data` | Reply with the persisted object (`payload`). |
| plugin → ovice | `ovice_save_and_emit_data` | Persist `payload` and push it to the other users. |
| ovice → plugin | `ovice_shared_data` | Someone else saved; `payload` is the new data. |
| ovice → plugin | `ovice_data_saved_success` | Your save succeeded; `payload` = data + `updated_at` (unix sec). |

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

1. **Request participants on mount.** Nothing is pushed until you send
   `ovice_get_participants`; the reply is your only reliable way to learn who *you* are
   (`isSelf: true`).
2. **Participant events are for everyone, not just you.** Filter with `payload.isSelf`
   when you only care about the local user. After any `ovice_participant_*` event, re-send
   `ovice_get_participants` (the examples debounce ~1 s) to refresh the list.
3. **Normalise IDs to strings.** `id`, `workspaceId` and `objectId` can arrive as string
   *or* number (`workspaceId: 987` in real payloads). Compare with `String(a) === String(b)`.
   Always send `to` as a string.
4. **Don't count on receiving your own broadcast.** Update local state optimistically and
   then broadcast (as `fast-press-game` does). Treat `ovice_message` from yourself
   (`source === self.id`) as a no-op if it does arrive.
5. **Namespace your `event` names** (e.g. `quiz:answer`) – `event` is free-form and is the
   only thing distinguishing your custom messages.
6. **Size limits**: broadcast/emit `message` ≤ **2 MB**; object data payload ≤ **500 KB**.
   Keep data JSON-serialisable; the bundled `useCacheStore` only accepts flat objects whose
   values are primitives or plain objects (no top-level arrays).
7. **Data store is "under development".** Prefer real-time messages for live state and use
   `ovice_save_and_emit_data` as a backup/persistence layer, not a database. It is
   last-write-wins; serialise writes through one leader (see patterns).
8. **`email` is conditional** – present only if the organisation owner allowed it in the
   custom plugin settings. Never require it.
9. **Visitors/guests** have `isVisitor: true`; decide explicitly whether they can act.
10. **Undocumented handshake**: the reference client answers an incoming
    `ovice_confirmation` with `{ type: 'ovice_ready_confirmed' }`. Keep that branch when
    writing your own client.
11. **Use `'*'` as targetOrigin when posting to the parent** (the ovice host origin is not
    fixed per environment). When *receiving*, ignore messages whose `data.type` does not
    start with `ovice_`, and never `eval`/render untrusted `message` content as HTML.
12. **Layout**: the page runs in a small iframe – design for ~300×350 px and full-height
    (`h-screen`) layouts; avoid modals that assume a large viewport.

## Where to look in this repository

If the current working directory is the `oviceinc/custom-plugins` repository:

- Spec: `docs/technical_details_for_developers.md`
- Canonical client hook (no-build React): `examples/memo/public/js/hooks/useCustomObjectClient.js`
- Shared-state cache with leader hand-off: `examples/memo/public/js/hooks/useCacheStore.js`
- TypeScript/CRA examples: `examples/meeting-cash-clock`, `examples/locate-me`
- Mock ovice host for local testing: `tools/test/`

Related skills: `create-ovice-plugin` (scaffold a new plugin), `test-ovice-plugin`
(run it against a mock ovice host).
