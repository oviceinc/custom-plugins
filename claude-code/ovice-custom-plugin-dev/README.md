# ovice-custom-plugin-dev (Claude Code plugin)

[Claude Code](https://claude.com/claude-code) skills that help you build
**ovice Custom Plugins** — the web pages ovice embeds in an iframe on a custom object.

| Skill | What it does |
| --- | --- |
| `ovice-plugin-api` | Reference for the postMessage protocol (all `ovice_*` events and payloads), static vs dynamic objects, limits, gotchas and proven multi-user patterns (leader election, shared cache, persistence). |
| `create-ovice-plugin` | Scaffolds a new plugin from a working template: no-build HTML + React/Babel (like the examples) or Vite + React + TypeScript with a typed `OviceClient`. |
| `test-ovice-plugin` | Runs your plugin in a bundled mock ovice host (`assets/mock-host.html`) with several simulated users, status changes, broadcast/emit and the object data store, plus a test checklist. |

## Install

```bash
claude plugin marketplace add oviceinc/custom-plugins
claude plugin install ovice-custom-plugin-dev@ovice-custom-plugins
```

Or inside Claude Code: `/plugin marketplace add oviceinc/custom-plugins`, then
`/plugin install ovice-custom-plugin-dev@ovice-custom-plugins`.

Working on a local clone of this repository instead:

```bash
claude plugin marketplace add ./
claude plugin install ovice-custom-plugin-dev@ovice-custom-plugins
```

## Use

Just ask, e.g.:

- 「参加者全員で投票できるoviceカスタムプラグインを作って」
- "Create an ovice custom plugin that shows a shared countdown timer"
- "Test examples/memo with 5 users in the mock host"
- "Why doesn't my plugin receive ovice_message?"

## Develop

```bash
claude plugin validate .                               # marketplace (repo root)
claude plugin validate claude-code/ovice-custom-plugin-dev
```

Bump `version` in `.claude-plugin/plugin.json` when you change a skill so installed copies update.
