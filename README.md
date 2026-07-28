# cognitum-consultants-orientation

Day-one orientation for the Cognitum Consultants certification cohort (29 July 2026),
covering the **MetaHarness** ecosystem: the agent-harness factory and its two engines,
**Darwin** and **Flywheel** — grounded in **Reuven Cohen's** own cohort-session
walkthrough (the marketing-feedback-loop example, "100 evolutions, keep the winners,"
the cheapest-model-best-answer thesis, the 24/7 flywheel, and how to actually start).

## View it

Open [`index.html`](index.html) in a browser, or serve the folder:

```
npx serve .
```

The page is a single, self-contained HTML file — no build step, no dependencies. It
supports light/dark themes (follows the OS setting, with a manual toggle) and respects
reduced-motion preferences.

## What it covers

| Topic | Source |
| --- | --- |
| **metaharness** — the factory that scaffolds branded agent harnesses | <https://github.com/ruvnet/metaharness> |
| **@metaharness/darwin** — Darwin Mode: mutate the harness, keep only measured wins | <https://www.npmjs.com/package/@metaharness/darwin> |
| **@metaharness/flywheel** — verifiable self-improvement with signed receipts | <https://www.npmjs.com/package/@metaharness/flywheel> |

## Design note

This is a **first-pass dark, minimal technical treatment**. It was built to be tuned
toward the [cognitum.one](https://cognitum.one) brand once its exact colours, fonts, and
logo are dropped in — the palette and typography live in CSS custom properties at the top
of `index.html`, so a brand match is a small, contained edit.
