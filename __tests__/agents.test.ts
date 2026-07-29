// SPDX-License-Identifier: MIT
// Verifies every agent module exports a well-formed contract. This keeps
// hand-added agents (like `promoter`) honest: a typo'd export, an empty
// prompt, or an off-tier value fails `npm test` before it ships.

import { describe, it, expect } from 'vitest';
import * as analyst from '../src/agents/analyst.js';
import * as strategist from '../src/agents/strategist.js';
import * as opsCoordinator from '../src/agents/ops-coordinator.js';
import * as promoter from '../src/agents/promoter.js';

const AGENTS = [analyst, strategist, opsCoordinator, promoter];
const TIERS = ['opus', 'sonnet', 'haiku'];

describe('cognitum-ops-agent — agent contract', () => {
  it('exposes all four business + promotions agents', () => {
    const names = AGENTS.map(a => a.NAME).sort();
    expect(names).toEqual(['analyst', 'ops-coordinator', 'promoter', 'strategist']);
  });

  for (const agent of AGENTS) {
    it(`${agent.NAME} has a non-empty prompt and a known tier`, () => {
      expect(typeof agent.SYSTEM_PROMPT).toBe('string');
      expect(agent.SYSTEM_PROMPT.length).toBeGreaterThan(0);
      expect(TIERS).toContain(agent.TIER);
    });
  }

  it('promoter names a KPI and a kill-switch — the point of a measurable promotion', () => {
    expect(promoter.SYSTEM_PROMPT).toMatch(/KPI/);
    expect(promoter.SYSTEM_PROMPT).toMatch(/kill-switch|guardrail/);
  });
});
