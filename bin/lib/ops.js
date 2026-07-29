// SPDX-License-Identifier: MIT
// Real, dependency-free domain logic for cognitum-ops-agent.
//
// Deliberately plain ESM (no build step, no deps) so `bin/cli.js` can call it
// directly under `npx cognitum-ops-agent`, and so the metrics/promotions MCP
// surfaces referenced in .claude/settings.json have something real to expose.
// These are the deterministic tools behind the `analyst` and `promoter` agents.

/**
 * Analyst tool: turn raw prior/current KPI rows into findings.
 * @param {Array<{metric:string,current:number,prior:number,thinBelow?:number}>} rows
 * @returns {{findings:Array<object>, generatedAt:null}}
 */
export function kpiSnapshot(rows) {
  if (!Array.isArray(rows)) throw new TypeError('kpiSnapshot expects an array of rows');
  const findings = rows.map((r) => {
    const { metric, current, prior } = r;
    if (typeof current !== 'number' || typeof prior !== 'number') {
      throw new TypeError(`row "${metric}" needs numeric current + prior`);
    }
    const delta = current - prior;
    const pctChange = prior === 0 ? null : (delta / Math.abs(prior)) * 100;
    // "Thin data" flag: a sample the analyst shouldn't conclude from.
    const thin = typeof r.thinBelow === 'number' && Math.abs(current) < r.thinBelow;
    return {
      metric,
      current,
      prior,
      delta: round(delta, 4),
      pctChange: pctChange === null ? null : round(pctChange, 2),
      direction: delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat',
      note: thin ? 'data too thin to conclude' : null,
    };
  });
  return { findings, generatedAt: null };
}

/**
 * Promoter tool: turn a chosen bet into a measurable promotion brief with a
 * computed break-even, projected net, and a concrete kill-switch.
 * @param {{
 *   name:string, offer?:string, audience?:string, channels?:string[],
 *   unitMargin:number, budget:number, audienceSize:number,
 *   baselineConvRate:number, targetLiftPct:number, campaignDays?:number, owner?:string
 * }} input
 */
export function promotionBrief(input) {
  const {
    name,
    offer = null,
    audience = null,
    channels = [],
    unitMargin,
    budget,
    audienceSize,
    baselineConvRate,
    targetLiftPct,
    campaignDays = 28,
    owner = null,
  } = input || {};

  for (const [k, v] of Object.entries({ unitMargin, budget, audienceSize, baselineConvRate, targetLiftPct })) {
    if (typeof v !== 'number' || Number.isNaN(v)) throw new TypeError(`promotionBrief: "${k}" must be a number`);
  }
  if (unitMargin <= 0) throw new RangeError('unitMargin must be > 0 (a promotion with no margin has no kill-switch math)');
  if (baselineConvRate < 0 || baselineConvRate > 1) throw new RangeError('baselineConvRate must be a fraction between 0 and 1');

  const breakEvenConversions = Math.ceil(budget / unitMargin);
  const baselineConversions = audienceSize * baselineConvRate;
  const incrementalConversions = baselineConversions * (targetLiftPct / 100);
  const projectedIncrementalMargin = incrementalConversions * unitMargin;
  const projectedNet = projectedIncrementalMargin - budget;
  const roi = budget === 0 ? null : projectedNet / budget;

  // Day-7 read + kill-switch: expect a linear share of incremental conversions
  // by day 7; kill if we land under half of that (guards against a dud burning
  // the whole budget).
  const day7Expected = incrementalConversions * (7 / campaignDays);
  const killSwitch = {
    metric: 'incremental conversions at day 7',
    expected: round(day7Expected, 2),
    killBelow: round(day7Expected * 0.5, 2),
    spendCap: budget,
    marginFloor: 0,
  };

  return {
    name,
    offer,
    audience,
    channels,
    owner,
    primaryKpi: 'incremental conversions',
    economics: {
      unitMargin,
      budget,
      breakEvenConversions,
      baselineConversions: round(baselineConversions, 2),
      projectedIncrementalConversions: round(incrementalConversions, 2),
      projectedNet: round(projectedNet, 2),
      roi: roi === null ? null : round(roi, 3),
    },
    killSwitch,
    verdict: projectedNet > 0 ? 'ship-and-measure' : 'reshape-before-shipping',
  };
}

function round(n, dp) {
  const f = 10 ** dp;
  return Math.round(n * f) / f;
}

/** Render a promotion brief as a one-page text brief for the CLI. */
export function formatBrief(b) {
  const e = b.economics;
  const k = b.killSwitch;
  return [
    `Promotion: ${b.name}`,
    b.offer ? `  Offer:     ${b.offer}` : null,
    b.audience ? `  Audience:  ${b.audience}` : null,
    b.channels.length ? `  Channels:  ${b.channels.join(', ')}` : null,
    b.owner ? `  Owner:     ${b.owner}` : null,
    `  KPI:       ${b.primaryKpi}`,
    '',
    '  Economics',
    `    break-even conversions:  ${e.breakEvenConversions}`,
    `    projected incremental:   ${e.projectedIncrementalConversions}`,
    `    projected net:           ${e.projectedNet}`,
    `    ROI:                     ${e.roi === null ? 'n/a' : `${round(e.roi * 100, 1)}%`}`,
    '',
    '  Kill-switch',
    `    ${k.metric}: expect ${k.expected}, kill below ${k.killBelow}`,
    `    spend cap: ${k.spendCap}, margin floor: ${k.marginFloor}`,
    '',
    `  Verdict: ${b.verdict}`,
  ].filter((l) => l !== null).join('\n');
}
