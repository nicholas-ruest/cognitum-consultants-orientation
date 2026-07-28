# cognitum-consultants-orientation

Day-one orientation for the Cognitum Consultants certification cohort (29 July 2026),
covering the **MetaHarness** ecosystem: the agent-harness factory and its two engines,
**Darwin** and **Flywheel** — grounded in **Reuven Cohen's** own cohort-session
walkthrough (the marketing-feedback-loop example, "100 evolutions, keep the winners,"
the cheapest-model-best-answer thesis, the 24/7 flywheel, and how to actually start).

## Two formats, same content

| File | Format | Use it for |
| --- | --- | --- |
| [`index.html`](index.html) | **Slide deck** | Presenting on screen. 16 slides, keyboard-navigable. |
| [`long-form.html`](long-form.html) | **Scrolling doc** | Reading / reference / sharing as a page. |

Both are single, self-contained HTML files — no build step, no dependencies. They
support light/dark themes (follows the OS setting, with a manual toggle) and respect
reduced-motion preferences.

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
