# cognitum-ops-agent

Business operations and promotions agent for Cognitum Consultants

> Business Operations harness · domain: `business/strategy`. Generated with [create-agent-harness](https://github.com/ruvnet/agent-harness-generator).

## Behavioral rules

- Use the harness's MCP tools (`mcp__cognitum-ops-agent__*`) for orchestration
- Memory and routing are handled by the kernel — you don't need to learn them
- Defer destructive operations to the user

## Agents

| Agent | Tier | Role |
|---|---|---|
| `analyst` | sonnet | Turns raw metrics into findings. |
| `strategist` | opus | Chooses the bet and the trade-offs. |
| `ops-coordinator` | sonnet | Turns the chosen bet into owned actions. |
| `promoter` | sonnet | Turns a chosen bet into a measurable promotion. |
## Skills

- `/quarterly-plan` — Build a quarterly plan: findings → strategy → owned action items tied to KPIs.
- `/promotions-campaign` — Design a promotion from a bet: offer → audience → channels → measurable test with a kill-switch.

## Commands

- `doctor` — Health-check the harness: kernel load, MCP wiring, memory backend, host adapter.
- `metrics <rows.json>` — Analyst tool: prior/current KPI rows → findings (delta, % change, direction, thin-data flags).
- `promo <bet.json>` — Promoter tool: a bet → a measurable promotion brief with break-even, projected net, and a day-7 kill-switch (`--json` for raw).
- `tools` — Print the MCP tool schemas as JSON.
- `mcp start` — Run the MCP stdio server (JSON-RPC over stdio) exposing `kpi_snapshot` + `promotion_brief`.

## Tools (MCP)

The harness ships a real MCP stdio server (`bin/lib/mcp.js`, dependency-free) wired into `.claude/settings.json`:

| Tool | Backs agent | Does |
|---|---|---|
| `kpi_snapshot` | `analyst` | Turns raw KPI rows into quantified findings. |
| `promotion_brief` | `promoter` | Turns a bet into a promotion with break-even + kill-switch math. |

## Architecture

This harness uses [@metaharness/kernel](https://www.npmjs.com/package/@metaharness/kernel) — a Rust-compiled WASM module with a NAPI-RS native fallback — so the same code runs identically on every platform.
