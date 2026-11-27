---
name: test-ovice-plugin
description: Run and test an ovice Custom Plugin locally without ovice, using a bundled mock ovice host that loads the plugin in several iframes (one per simulated user) and implements participants, status changes, broadcast/emit and the object data store. Use when the user wants to run, preview, debug or verify an ovice custom plugin / custom object, check multi-user sync, or asks "カスタムプラグインをローカルで動かしたい / テストしたい / 動作確認".
---

# Test an ovice Custom Plugin locally

The mock host is a single dependency-free file: `assets/mock-host.html` next to this
SKILL.md (the skill's base directory is shown when the skill loads). Inside the
`oviceinc/custom-plugins` repo there is also the older `tools/test/` harness; prefer the
mock host — it follows the real ovice host (ovice-ui `custom_plugin.tsx`): strict payload
validation, no `source` on delivered messages, rate limit, lost startup events, data store
off in production. The old harness is far more lenient and hides those bugs.

## 1. Serve the plugin over HTTP

`file://` does not work for no-build plugins (Babel loads `./js/*.js` via XHR).

- No-build plugin: `npx --yes serve -l 8080 <plugin-public-dir>` (or
  `python3 -m http.server 8080 -d <plugin-public-dir>`). Plugin URL: `http://localhost:8080/`.
- Vite plugin: `npm run dev` → usually `http://localhost:5173/`.
- CRA examples in the repo: `yarn start` → `http://localhost:3000/`.

Run the server in the background so you can keep working.

## 2. Open the mock host

Serve the mock host too (any port), or open it directly from disk — the host itself works
from `file://`:

```
<skill-dir>/assets/mock-host.html?url=http://localhost:8080/&users=4&type=static
```

Query params: `url` (plugin URL), `users` (1–12, default 4), `type` (`static`|`dynamic`).
Open it in the built-in browser pane (or tell the user to open it) and take a screenshot.

What it simulates (same rules as the real host):
- Users 1–2 `joined`, the rest `subscribed`; the last user is a visitor (when > 2 users).
  User ids are strings `"1001"`, `"1002"`, …; `workspaceId` is the string `"987"`.
- `dynamic` makes User 1 the host (`isHost: true`); `static` has no host.
- **Broadcast/emit validation**: the payload may contain only `event` + `message`
  (+ `to` for emit). Extra keys such as `source` or `objectId` → the request is dropped.
  `event` must be 3–256 chars; `message` must be number / string / boolean / object /
  array of those (no `null`, no `undefined`, no nested arrays); `to` must be a string.
  Failures are logged in red and sent to the plugin as `ovice_errors`.
- **`ovice_message` = exactly what the sender posted** (`{ event, message[, to] }`).
  There is **no `source` and no `objectId`**. Broadcasts never return to the sender;
  emits to yourself are ignored.
- **Rate limit**: 100 broadcast/emit/save requests per minute per iframe (counter next to
  each user); the rest are dropped with `ovice_errors`.
- **Startup**: the iframe exists only while the user is in range. When it loads, ovice
  sends **no** `ovice_participant_subscribed`/`joined`, either to that user or to the
  others, because the real host fires them before the iframe is ready. Plugins must
  call `ovice_get_participants` on start and keep refreshing.
- Status dropdown: `subscribed → joined` sends `joined`, `joined → left` sends `left`,
  `→ unsubscribed` sends (`left`,) `unsubscribed` and then unloads the iframe; back from
  `unsubscribed` = fresh iframe (returning user, no event). The user gets `isSelf: true`;
  the others get the same payload with `isSelf: false`. Event payloads have **no
  `status`** and the language key is spelled `languge` (as in ovice). In
  `ovice_participants`, status is only `joined` or `subscribed`.
- **+ Add late user** (header) → a brand-new user (next id, marked `(late)`) who was not
  there at startup, as `subscribed` or `joined` and optionally a visitor (up to 20 users).
  Its iframe loads mid-session with no prior state and, as at startup, **no**
  participant event is sent to anyone: the newcomer must ask for state, and the others
  only see it in `ovice_participants` (so they must keep polling).
- **Data store**: *production* (default on) ignores `ovice_get_data` and
  `ovice_save_and_emit_data` entirely, as production ovice does. Untick it to simulate a
  dev build: 50 KB limit, `ovice_shared_data` to the others, `ovice_data_saved_success`
  (≈1 s later, no `updated_at`) to the sender, static objects only (dynamic: not persisted).
- `ovice_ready` gets no reply (no `ovice_confirmation`); unknown types are ignored.
- Every event is also posted as a JSON-RPC 2.0 notification
  (`{ jsonrpc: '2.0', method, params }`) like ovice does; plugins must check `data.type`.
- *email* toggle: include the user's own `email` (never other users').
- Right panel: live message log and an editable object data store.

## 3. Test checklist

Drive the iframes (click inside them) and watch the log. Check at least:

1. **Startup** – every iframe sends `ovice_get_participants` and shows the right self user
   without waiting for any participant event or handshake.
2. **Sync** – an action in User 1 shows up in User 2 (and only once in User 1). The log
   must have **no red ERROR lines**: any `ovice_errors` means ovice dropped the message.
3. **Late joiner** – act in User 1 (and User 2) first, then press **+ Add late user**:
   the new user must catch up to the current state, and the existing users must pick up
   the newcomer through `ovice_get_participants` polling (no event arrives). Repeat with
   the select on `joined`, and add two late users back to back to catch double-sync /
   leader-election races. Also check a returning user: set User 3 to `unsubscribed`, act
   in User 1, set User 3 back to `subscribed`.
4. **Leader leaves** – set the leader (User 1) to `unsubscribed`: another user takes over
   and state is kept (and backed up to the data store if the plugin does that).
5. **Roles** – repeat with `type=dynamic`; check host-only controls and visitor handling.
6. **Production** – with *production* ticked (default) everything above still works: sync
   must not depend on the data store. Untick it only to test optional persistence.
7. **Rate** – use the plugin normally for a minute; the per-user counter stays well under
   100 (no broadcast per keystroke / mouse move / timer tick).
8. **Console** – no errors in each iframe's console.

Report findings with the relevant log lines.

## 4. Testing in real ovice

The mock host does not prove ovice behaviour (timing, ordering, permissions). For a final
check, deploy the plugin to an HTTPS URL and register it as a custom plugin in ovice's
admin settings, then test with two real accounts. If you need to check ovice's behaviour
from inside the iframe, log `event.data` in the plugin's `message` listener.
