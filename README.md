# cognitum-consultants-orientation

Day-one orientation for the Cognitum Consultants certification cohort (29 July 2026),
covering the **MetaHarness** ecosystem: the agent-harness factory and its two engines,
**Darwin** and **Flywheel** — grounded in **Reuven Cohen's** own cohort-session
walkthrough (the marketing-feedback-loop example, "100 evolutions, keep the winners,"
the cheapest-model-best-answer thesis, the 24/7 flywheel, and how to actually start).

## Two formats, same content

| File | Format | Use it for |
| --- | --- | --- |
| [`index.html`](index.html) | **Slide deck** | Presenting on screen. 43 slides across 6 parts, sized for a ~60-minute slot. |
| [`long-form.html`](long-form.html) | **Scrolling doc** | Reading / reference / sharing as a page. |
| [`ruvector.html`](ruvector.html) | **Slide deck** | A companion 34-slide overview of **RuVector** (persistent vector + graph memory for AI agents), built in the exact same design system. |
| [`ruview.html`](ruview.html) | **Slide deck** | A companion 34-slide overview of **RuView** (camera-free WiFi spatial sensing — presence, vitals, pose from CSI), in the same design system. |
| [`ruvnet-index.html`](ruvnet-index.html) | **Ecosystem deck** | "The receipts" — a download/builder headline for the open Cognitum ecosystem, then a devoted, repo-grounded slide for each of 50 ruvnet projects (stars, downloads, and the proof from each repo). |
| [`cognitum-enterprise-matter.html`](cognitum-enterprise-matter.html) | **Consultant briefing** | A 21-slide **Cognitum Enterprise Matter** deck built on one consistent ladder — **atoms → bonds → molecules → matter**. The eight named commercial atoms (RuView, RuVector, RuFlo, RuLLM, MetaLLM, RVF, COGs, MetaHarness) bond into seven solution molecules (SpatialOps, Ambient Care, Industrial Guardian, FlowSafe, Sovereign Knowledge Ops, Autonomous Security Remediation, OEM Edge Brain); each molecule slide names the exact Cognitum projects that compose it, and **matter is the real-world implementation** — molecules deployed and operating together at a live enterprise. Every slide carries a bespoke, animated, subject-specific visualization, and the deck is heavily focused on named target accounts. Every named company is a high-fit target-account hypothesis, not a customer. |
| [`harnessaas.html`](harnessaas.html) | **Product deck** | A 46-slide **HarnessaaS** product overview — governed AI execution & learning: automate → verify (declared oracle / human-approval / heuristic) → escalate on evidence → tamper-evident receipts & lineage → improve policy only on holdout evidence — with explicit SHIPPED/PILOT/GATED/PLANNED maturity, in the same design system. |
| [`metallm.html`](metallm.html) | **Enablement deck** | A 48-slide **MetaLLM consultant enablement** deck — the governed, budget-safe AI control plane and agent-orchestration substrate: difficulty-aware tier routing, reserve-and-commit budget enforcement before spend, metering, multi-tenancy, and approval-gated Darwin Loop pods — with strict LIVE/BUILT/DESIGN/OPEN status honesty, in the same design system. |
| [`ruflo.html`](ruflo.html) | **Slide deck** | A companion 23-slide overview of **Ruflo** (the original agent meta-harness for Claude Code and Codex — 100+ agents, coordinated swarms, self-learning memory, and secure federation from one `npx ruflo init`), in the same design system. |
| [`ruvstack-orientation.html`](ruvstack-orientation.html) | **Slide deck** | The **RuvStack** orientation — an exact rebrand of `index.html` (same 43 slides, Darwin & Flywheel engines), with the factory named RuvStack instead of MetaHarness. |
| [`metaharness-sectors.html`](metaharness-sectors.html) | **Briefing deck** | An in-depth 51-slide **MetaHarness consultant briefing** — the ruv stack (RuView, RuVector, ruvLLM, RuFlo, RVF) surfaced across **seven targeted sectors** (wireless, semiconductor, robotics, drones, home/industrial, security, networking) plus a Realtek/Ameba special case: value & fit, real clients in play, per-sector architecture, and the ruvnet open projects behind each use case. |

Both are single, self-contained HTML files — no build step, no dependencies. They
support light/dark themes (follows the OS setting, with a manual toggle) and respect
reduced-motion preferences.

The deck renders on a **fixed 1280×720 stage that scales to fit the viewport**, so every
slide fills the screen and **nothing ever scrolls or clips** — on a laptop, a projector,
or a phone.

### Presenting the deck

Open [`index.html`](index.html) and:

- **← / →** (or **Space**) — previous / next slide
- **Home / End** — first / last slide
- **F** — enter presentation (fullscreen) mode
- **T** — toggle light/dark theme
- Click the edge zones, arrows, or dots to navigate; swipe on touch devices
- The URL tracks the current slide (`#7`), so you can deep-link or refresh in place

To serve the folder instead of opening the file directly:

```
npx serve .
```

## What it covers

| Topic | Source |
| --- | --- |
| **metaharness** — the factory that wraps your stack in a branded agent harness | <https://github.com/ruvnet/metaharness> |
| **@metaharness/darwin** — Darwin Mode: mutate the harness, keep only measured wins | <https://www.npmjs.com/package/@metaharness/darwin> |
| **@metaharness/flywheel** — verifiable self-improvement with signed receipts | <https://www.npmjs.com/package/@metaharness/flywheel> |

## Design note

This is a **first-pass dark, minimal technical treatment**. It was built to be tuned
toward the [cognitum.one](https://cognitum.one) brand once its exact colours, fonts, and
logo are dropped in — the palette and typography live in CSS custom properties at the top
of each file, so a brand match is a small, contained edit shared across both formats.
