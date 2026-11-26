---
name: test-ovice-plugin
description: Run and test an ovice Custom Plugin locally without ovice, using a bundled mock ovice host that loads the plugin in several iframes (one per simulated user) and implements participants, status changes, broadcast/emit and the object data store. Use when the user wants to run, preview, debug or verify an ovice custom plugin / custom object, check multi-user sync, or asks "カスタムプラグインをローカルで動かしたい / テストしたい / 動作確認".
---

# Test an ovice Custom Plugin locally

The mock host is a single dependency-free file: `assets/mock-host.html` next to this
SKILL.md (the skill's base directory is shown when the skill loads). Inside the
`oviceinc/custom-plugins` repo there is also the older `tools/test/` harness; prefer the
mock host — it fills `source`/`objectId` on messages like ovice, enforces the size limits,
lets you change each user's status and unloads iframes for out-of-range users.

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

What it simulates:
- Users 1–2 `joined`, the rest `subscribed`; the last user is a visitor (when > 2 users).
- `dynamic` makes User 1 the host (`isHost: true`); `static` has no host.
- Per-user status dropdown → sends `ovice_participant_<status>` to every iframe.
  `unsubscribed` unloads that iframe; switching back reloads it (= returning user).
- **+ Add late user** (header) → a brand-new user (next id, marked `(late)`) who was not
  there at startup: its iframe loads mid-session with no prior state, then every iframe gets
  `ovice_participant_subscribed` (or `joined`, per the select; optionally as a visitor).
  Up to 20 users in total.
- `ovice_get_participants`, `ovice_get_data`, `ovice_save_and_emit_data`
  (→ `ovice_data_saved_success` to sender, `ovice_shared_data` to others),
  `ovice_broadcast_message` / `ovice_emit_message` (→ `ovice_message` with `source`).
- Toggles: *echo broadcast* (deliver your own broadcast back to you), *email* (include
  `email` in participant events), iframe size.
- Right panel: live message log (errors for > 2 MB messages, > 500 KB data, non-object
  data; warnings for non-string `to`, unknown types) and an editable object data store.
- `workspaceId` is a **number** on purpose, to catch string/number id bugs.

## 3. Test checklist

Drive the iframes (click inside them) and watch the log. Check at least:

1. **Startup** – every iframe sends `ovice_get_participants` and shows the right self user.
2. **Sync** – an action in User 1 shows up in User 2 (and not twice in User 1, also with
   *echo broadcast* on).
3. **Late joiner** – act in User 1 (and User 2) first, then press **+ Add late user**:
   the new user must catch up to the current state, and the existing users must handle the
   newcomer (e.g. add it to lists, re-send state). Repeat with the select on `joined`, and
   add two late users back to back to catch double-sync / leader-election races.
   Also check a returning user: set User 3 to `unsubscribed`, act in User 1, set it back.
4. **Leader leaves** – set the leader (User 1) to `unsubscribed`: another user takes over
   and state is kept (and backed up to the data store if the plugin does that).
5. **Roles** – repeat with `type=dynamic`; check host-only controls and visitor handling.
6. **Persistence** – edit the data store JSON and press *save & emit*: plugins that use
   the store must react to `ovice_shared_data`.
7. **Console** – no errors in each iframe's console.

Report findings with the relevant log lines.

## 4. Testing in real ovice

The mock host does not prove ovice behaviour (timing, ordering, permissions). For a final
check, deploy the plugin to an HTTPS URL and register it as a custom plugin in ovice's
admin settings, then test with two real accounts. If you need to check ovice's behaviour
from inside the iframe, log `event.data` in the plugin's `message` listener.
