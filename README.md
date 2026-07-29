# cognitum-ops-agent

Business operations and promotions agent for Cognitum Consultants

> **Business Operations** — Analyst → strategist → ops-coordinator, with a metrics MCP for KPI grounding.
>
> Generated with [`create-agent-harness`](https://github.com/ruvnet/agent-harness-generator). Multi-host scaffolding with a kernel that resolves native → wasm → js (js backend in the published beta; see `harness doctor`).

## Install

```bash
npm install -g cognitum-ops-agent
cognitum-ops-agent init
cognitum-ops-agent doctor
```

## Agents

| Agent | Role |
|---|---|
| `analyst` | Turns raw metrics into findings. |
| `strategist` | Chooses the bet and the trade-offs. |
| `ops-coordinator` | Turns the chosen bet into owned actions. |
| `promoter` | Turns a chosen bet into a measurable promotion (offer, channels, KPI, kill-switch). |

## Skills

| Skill | What it does |
|---|---|
| `/quarterly-plan` | Findings → strategy → owned, dated action items tied to KPIs. |
| `/promotions-campaign` | Design a promotion from a bet: offer → audience → channels → a 7-day measurable test with a kill-switch. |
| `/evolve` | Darwin Mode self-improvement — freeze the model, evolve the harness (sandboxed, safety-gated). |

This harness ships with the **claude-code** adapter.

## Evolving the harness

This harness integrates [`@metaharness/darwin`](https://www.npmjs.com/package/@metaharness/darwin). Run `npm run evolve:dry` for a fast, offline self-improvement pass, or `npm run evolve` to score variants against the test suite. The model stays frozen; only the harness's operating policy evolves, and only measured improvements are kept.

## License

MIT
