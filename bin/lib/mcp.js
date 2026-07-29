// SPDX-License-Identifier: MIT
// A minimal, real MCP stdio server for cognitum-ops-agent.
//
// Newline-delimited JSON-RPC 2.0 over stdio (the MCP stdio transport), with no
// SDK dependency. It exposes the domain tools in ./ops.js so the agents can
// actually call them — this is what .claude/settings.json's `mcp start` points
// at. Handles: initialize, tools/list, tools/call. Prototype-grade but wire-real.

import { kpiSnapshot, promotionBrief } from './ops.js';

const PROTOCOL_VERSION = '2024-11-05';

const TOOLS = [
  {
    name: 'kpi_snapshot',
    description: 'Turn prior/current KPI rows into findings (delta, % change, direction, thin-data flags).',
    inputSchema: {
      type: 'object',
      properties: {
        rows: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              metric: { type: 'string' },
              current: { type: 'number' },
              prior: { type: 'number' },
              thinBelow: { type: 'number' },
            },
            required: ['metric', 'current', 'prior'],
          },
        },
      },
      required: ['rows'],
    },
    handler: (args) => kpiSnapshot(args.rows),
  },
  {
    name: 'promotion_brief',
    description: 'Draft a measurable promotion from a bet: break-even, projected net, and a day-7 kill-switch.',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        offer: { type: 'string' },
        audience: { type: 'string' },
        channels: { type: 'array', items: { type: 'string' } },
        owner: { type: 'string' },
        unitMargin: { type: 'number' },
        budget: { type: 'number' },
        audienceSize: { type: 'number' },
        baselineConvRate: { type: 'number' },
        targetLiftPct: { type: 'number' },
        campaignDays: { type: 'number' },
      },
      required: ['name', 'unitMargin', 'budget', 'audienceSize', 'baselineConvRate', 'targetLiftPct'],
    },
    handler: (args) => promotionBrief(args),
  },
];

/**
 * Handle one decoded JSON-RPC request object. Returns a response object, or
 * null for notifications (which get no reply). Exported for tests.
 */
export function handleMessage(msg) {
  const { id, method, params } = msg || {};
  const reply = (result) => ({ jsonrpc: '2.0', id, result });
  const fail = (code, message) => ({ jsonrpc: '2.0', id, error: { code, message } });

  switch (method) {
    case 'initialize':
      return reply({
        protocolVersion: PROTOCOL_VERSION,
        capabilities: { tools: {} },
        serverInfo: { name: 'cognitum-ops-agent', version: '0.1.0' },
      });
    case 'notifications/initialized':
      return null; // notification — no response
    case 'tools/list':
      return reply({ tools: TOOLS.map(({ name, description, inputSchema }) => ({ name, description, inputSchema })) });
    case 'tools/call': {
      const tool = TOOLS.find((t) => t.name === params?.name);
      if (!tool) return fail(-32602, `unknown tool: ${params?.name}`);
      try {
        const out = tool.handler(params.arguments || {});
        return reply({ content: [{ type: 'text', text: JSON.stringify(out, null, 2) }] });
      } catch (err) {
        // Tool-level error, surfaced to the model rather than crashing the server.
        return reply({ content: [{ type: 'text', text: `error: ${err.message}` }], isError: true });
      }
    }
    default:
      if (id === undefined) return null; // unknown notification
      return fail(-32601, `method not found: ${method}`);
  }
}

/** Run the stdio server loop: newline-delimited JSON-RPC on stdin/stdout. */
export function serve(input = process.stdin, output = process.stdout) {
  let buf = '';
  input.setEncoding('utf8');
  input.on('data', (chunk) => {
    buf += chunk;
    let nl;
    while ((nl = buf.indexOf('\n')) >= 0) {
      const line = buf.slice(0, nl).trim();
      buf = buf.slice(nl + 1);
      if (!line) continue;
      let msg;
      try {
        msg = JSON.parse(line);
      } catch {
        output.write(JSON.stringify({ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'parse error' } }) + '\n');
        continue;
      }
      const res = handleMessage(msg);
      if (res) output.write(JSON.stringify(res) + '\n');
    }
  });
}

/** The tool schemas, for `cognitum-ops-agent tools` introspection. */
export function toolManifest() {
  return TOOLS.map(({ name, description, inputSchema }) => ({ name, description, inputSchema }));
}
