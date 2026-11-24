---
name: create-ovice-plugin
description: Scaffold a new ovice Custom Plugin (the web page ovice embeds in an iframe on a custom object) from a working template — either a no-build HTML + React/Babel plugin like the official examples, or a Vite + React + TypeScript app with a typed postMessage client. Use when the user wants to create, start, scaffold or bootstrap an ovice custom plugin / custom object app, e.g. "oviceのカスタムプラグインを作りたい", "新しいカスタムオブジェクトを作って", "make an ovice plugin that …".
---

# Create an ovice Custom Plugin

Load the `ovice-plugin-api` skill first if it is not already in context — every design
decision below depends on its event model and gotchas.

## 1. Clarify (only what you can't infer)

Ask briefly, or pick sensible defaults and say so:

- **What it does** and **who may act** (everyone / only the linked users / only the
  dynamic-object owner / only one leader).
- **State model** — pick from the table in `ovice-plugin-api/references/patterns.md`:
  participants-only, broadcast events, leader-owned shared cache, or persisted data.
- **Stack**:
  - **No-build** (default for small plugins, and inside the `oviceinc/custom-plugins` repo
    under `examples/`): static HTML + React 17 UMD + Babel standalone + Tailwind CDN. Deploys
    to any static host by copying a folder.
  - **TypeScript** (for larger plugins or teams): Vite + React + TS with the typed
    `OviceClient` from this skill.
- **Plugin id** (kebab-case, used as folder name and event-name prefix) and **title**.

## 2. Scaffold

Templates live in `templates/` under this skill's base directory (shown when the skill loads; written `<this-skill-dir>` below). Replace `__PLUGIN_ID__` and
`__PLUGIN_TITLE__` in every copied file.

### No-build

```bash
DEST=<target-dir>/<plugin-id>            # e.g. examples/<plugin-id>/public inside the repo
mkdir -p "$DEST" && cp -R <this-skill-dir>/templates/no-build/. "$DEST/"
grep -rl '__PLUGIN_' "$DEST" | xargs sed -i.bak -e 's/__PLUGIN_ID__/<plugin-id>/g' -e 's/__PLUGIN_TITLE__/<Title>/g' && find "$DEST" -name '*.bak' -delete
```

Files:
- `index.html` — loads CDN React/Babel/Tailwind, then the hooks, then `app.js` (order matters).
- `js/hooks/useCustomObjectClient.js` — protocol client: `user`, `users`, `isHost`,
  `isStaticObject`, `isMaster`, `isJoined`, `store`, `broadcast`, `emitTo`, `saveStore`,
  `onEvent` / `onUserEvent` / `onMessageEvent` / `onStoreEvent`.
  **This copy is multi-subscriber**: each `onXxx(handler)` returns an unsubscribe function,
  so always write `useEffect(() => onMessageEvent(handler), [deps])`. (The copies in
  `examples/` keep only the last handler, which silently breaks `useCacheStore` if the app
  registers its own handler on the same channel.)
- `js/hooks/useCacheStore.js` — leader-owned shared object (`cache`, `updateCache`), with
  hand-off when the leader leaves and optional backup to the object data store.
- `js/app.js` — starter UI: shared counter (cache), broadcast "wave", participant list.

When adding a plugin to the `oviceinc/custom-plugins` repo, follow the existing layout
(`examples/<id>/public/...`, `examples/<id>/README.md`, `.gitignore`), add a row to the
table in the root `README.md`, and add it to `testUrls` in `tools/test/js/settings.js`.

### TypeScript (Vite)

```bash
npm create vite@latest <plugin-id> -- --template react-ts
cp -R <this-skill-dir>/templates/typescript/src/. <plugin-id>/src/
```

Then in `<plugin-id>/vite.config.ts` set `base: './'` (so the build works from any sub-path)
and replace the placeholders. Files:
- `src/ovice/types.ts` — typed incoming/outgoing events, `normalizeParticipant` (ids → strings).
- `src/ovice/client.ts` — `OviceClient`: `start()`, `subscribe/getSnapshot` (self,
  participants, data, `isStaticObject`, `isJoined`, `isLeader`), `on(type)`,
  `onMessage(event)`, `broadcast`, `emit`, `saveData`; auto-refreshes participants and
  answers the `ovice_confirmation` handshake.
- `src/ovice/useOvice.ts` — `useOvice()` and `useOviceMessage(client, event, handler)`.
- `src/App.tsx` — starter UI.

## 3. Implement the feature

- Prefix every custom event name with `<plugin-id>:`.
- Put all data a receiver needs inside `message` (including timestamps / sender name).
- Update local state optimistically before `broadcast`.
- Gate controls with the chosen role (`isHost`, `isMaster`/`isLeader`, `isJoined`,
  `!isVisitor`).
- Late joiners: either use `useCacheStore`, or have the leader `emit` current state when it
  sees another user's `ovice_participant_joined`/`subscribed`.
- Design for a ~300×350 px iframe.

## 4. Verify before handing back

Run the `test-ovice-plugin` skill: open the plugin in the mock ovice host with several
simulated users, and check with at least two users that:

- [ ] each iframe shows the right self user and participant list;
- [ ] actions by one user appear for the others (broadcast/emit);
- [ ] a late joiner gets the current state;
- [ ] role gating works for static **and** dynamic object types;
- [ ] no console errors; message/data payloads stay under 2 MB / 500 KB.

Finally tell the user how to deploy: host the folder (no-build) or `dist/` (Vite) on any
HTTPS static host, then register that URL as a custom plugin in ovice's admin settings.
