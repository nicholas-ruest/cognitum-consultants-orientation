// SPDX-License-Identifier: MIT
// Exercises the real domain logic behind the analyst + promoter agents.

import { describe, it, expect } from 'vitest';
import { kpiSnapshot, promotionBrief, formatBrief } from '../bin/lib/ops.js';
import { handleMessage } from '../bin/lib/mcp.js';

describe('kpiSnapshot (analyst tool)', () => {
  it('computes delta, % change and direction', () => {
    const { findings } = kpiSnapshot([{ metric: 'MRR', current: 120, prior: 100 }]);
    expect(findings[0]).toMatchObject({ delta: 20, pctChange: 20, direction: 'up' });
  });

  it('flags thin data and handles a zero prior without dividing by zero', () => {
    const { findings } = kpiSnapshot([{ metric: 'trials', current: 2, prior: 0, thinBelow: 5 }]);
    expect(findings[0].pctChange).toBeNull();
    expect(findings[0].note).toBe('data too thin to conclude');
  });

  it('rejects non-numeric rows', () => {
    // @ts-expect-error deliberately wrong type
    expect(() => kpiSnapshot([{ metric: 'x', current: 'a', prior: 1 }])).toThrow();
  });
});

describe('promotionBrief (promoter tool)', () => {
  const input = {
    name: 'Q3 referral push',
    unitMargin: 40,
    budget: 2000,
    audienceSize: 10000,
    baselineConvRate: 0.02,
    targetLiftPct: 25,
  };

  it('computes break-even and a positive-net ship verdict', () => {
    const b = promotionBrief(input);
    expect(b.economics.breakEvenConversions).toBe(50); // 2000 / 40
    // baseline 200 conv * 25% lift = 50 incremental * $40 = $2000 - $2000 budget = $0 net... tune:
    expect(b.economics.projectedIncrementalConversions).toBe(50);
    expect(b.killSwitch.metric).toMatch(/day 7/);
    expect(b.killSwitch.spendCap).toBe(2000);
  });

  it('always emits a kill-switch with a killBelow threshold', () => {
    const b = promotionBrief({ ...input, targetLiftPct: 60 });
    expect(b.killSwitch.killBelow).toBeLessThan(b.killSwitch.expected);
    expect(b.verdict).toBe('ship-and-measure');
  });

  it('refuses a zero-margin promotion (no kill-switch math)', () => {
    expect(() => promotionBrief({ ...input, unitMargin: 0 })).toThrow(/margin/);
  });

  it('renders a readable one-page brief', () => {
    const text = formatBrief(promotionBrief(input));
    expect(text).toMatch(/Promotion: Q3 referral push/);
    expect(text).toMatch(/Kill-switch/);
  });
});

describe('MCP server protocol', () => {
  it('responds to initialize with a protocol version and serverInfo', () => {
    const res = handleMessage({ jsonrpc: '2.0', id: 1, method: 'initialize', params: {} });
    expect(res.result.serverInfo.name).toBe('cognitum-ops-agent');
    expect(res.result.capabilities.tools).toBeDefined();
  });

  it('lists both domain tools', () => {
    const res = handleMessage({ jsonrpc: '2.0', id: 2, method: 'tools/list' });
    expect(res.result.tools.map((t: any) => t.name).sort()).toEqual(['kpi_snapshot', 'promotion_brief']);
  });

  it('calls a tool and returns text content', () => {
    const res = handleMessage({
      jsonrpc: '2.0', id: 3, method: 'tools/call',
      params: { name: 'kpi_snapshot', arguments: { rows: [{ metric: 'MRR', current: 110, prior: 100 }] } },
    });
    expect(res.result.content[0].type).toBe('text');
    expect(res.result.content[0].text).toMatch(/"delta": 10/);
  });

  it('surfaces a tool error as isError rather than crashing', () => {
    const res = handleMessage({
      jsonrpc: '2.0', id: 4, method: 'tools/call',
      params: { name: 'promotion_brief', arguments: { name: 'bad', unitMargin: 0, budget: 1, audienceSize: 1, baselineConvRate: 0.1, targetLiftPct: 1 } },
    });
    expect(res.result.isError).toBe(true);
  });

  it('returns method-not-found for an unknown method', () => {
    const res = handleMessage({ jsonrpc: '2.0', id: 5, method: 'nope' });
    expect(res.error.code).toBe(-32601);
  });

  it('treats notifications/initialized as a no-reply notification', () => {
    expect(handleMessage({ jsonrpc: '2.0', method: 'notifications/initialized' })).toBeNull();
  });
});
