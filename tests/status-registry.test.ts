/* ==========================================================================
   Status registry tests.

   Run with `npm run test:status` (node --test, native TypeScript stripping).
   These cover the registry contract only; layout and colour contrast are
   checked by scripts/a11y.mjs and scripts/audit-contrast.mjs against the built
   site.
   ========================================================================== */

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

import * as lucide from 'lucide';

import {
  PROJECT_STATUS_STATES,
  STATUS_REGISTRY,
  STATUS_STATES,
  STATUS_VARIANTS,
  STATUS_VARIANT_REGISTRY,
  isStatusState,
  resolveProjectStatus,
  resolveStatus,
  type StatusState,
} from '../src/lib/status-registry.ts';

const SVG_TAGS = new Set([
  'path',
  'circle',
  'rect',
  'line',
  'polyline',
  'polygon',
  'ellipse',
]);

test('every declared state has exactly one registry entry', () => {
  const declared = [...STATUS_STATES].sort();
  const registered = Object.keys(STATUS_REGISTRY).sort();
  assert.deepEqual(registered, declared);
  assert.equal(new Set(registered).size, registered.length);
});

test('every entry is complete and uses a canonical variant', () => {
  for (const state of STATUS_STATES) {
    const entry = STATUS_REGISTRY[state];
    assert.ok(Array.isArray(entry.icon) && entry.icon.length > 0, `${state}: icon`);
    assert.ok(entry.label.trim().length > 0, `${state}: label`);
    assert.ok(entry.description.trim().length > 0, `${state}: description`);
    assert.ok(
      (STATUS_VARIANTS as readonly string[]).includes(entry.variant),
      `${state}: variant ${entry.variant}`,
    );
    assert.equal(typeof entry.announce, 'boolean', `${state}: announce`);
    // The entry must point at the state it is filed under.
    assert.equal(resolveStatus(state).state, state);
  }
});

test('icons are real lucide exports, not hand-written path data', () => {
  const byReference = new Set(Object.values(lucide).filter((v) => Array.isArray(v)));
  for (const state of STATUS_STATES) {
    const entry = STATUS_REGISTRY[state];
    assert.ok(byReference.has(entry.icon), `${state}: icon is not a lucide export`);
    for (const [tag] of entry.icon) {
      assert.ok(SVG_TAGS.has(tag), `${state}: unexpected svg tag <${tag}>`);
    }
  }
});

test('all six canonical variants are reachable and self-consistent', () => {
  assert.deepEqual(Object.keys(STATUS_VARIANT_REGISTRY).sort(), [...STATUS_VARIANTS].sort());

  for (const variant of STATUS_VARIANTS) {
    const canonical = STATUS_VARIANT_REGISTRY[variant];
    assert.equal(canonical.variant, variant, `${variant} declares ${canonical.variant}`);
    assert.ok(canonical.label.trim().length > 0);
    assert.ok(canonical.icon.length > 0);

    // At least one application state must resolve to this variant, otherwise the
    // variant exists in CSS with nothing that can ever render it.
    const reachable = STATUS_STATES.filter((state) => STATUS_REGISTRY[state].variant === variant);
    assert.ok(reachable.length > 0, `${variant} has no state`);
  }
});

test('variant names are accepted even when they are not states', () => {
  // `success`, `warning` and `pending` are both state and variant names, so the
  // state entry wins and the label is the state's own label.
  for (const name of ['success', 'warning', 'pending']) {
    const resolved = resolveStatus(name);
    assert.equal(resolved.state, name);
    assert.equal(resolved.variant, name);
  }

  // `danger`, `info` and `neutral` are variant names only. They still resolve to
  // the right colour and icon, but they cannot claim a state they do not have.
  for (const name of ['danger', 'info', 'neutral'] as const) {
    const resolved = resolveStatus(name);
    assert.equal(resolved.state, 'unknown', `${name} must not invent a state`);
    assert.equal(resolved.variant, name, `${name} must keep its variant`);
    assert.equal(resolved.label, STATUS_VARIANT_REGISTRY[name as keyof typeof STATUS_VARIANT_REGISTRY].label);
  }
});

test('unknown and malformed values fall back to neutral "unknown"', () => {
  const junk = [
    undefined,
    null,
    0,
    1,
    true,
    {},
    [],
    '',
    ' ',
    'SUCCESS',
    'success ',
    'not-a-state',
    'constructor',
    '__proto__',
    'toString',
  ];
  for (const value of junk) {
    const resolved = resolveStatus(value);
    assert.equal(resolved.state, 'unknown', `${String(value)} -> ${resolved.state}`);
    assert.equal(resolved.variant, 'neutral');
    assert.equal(resolved.label, 'Unknown');
    assert.ok(resolved.icon.length > 0);
  }
});

test('isStatusState narrows only real states', () => {
  assert.equal(isStatusState('offline'), true);
  assert.equal(isStatusState('Offline'), false);
  assert.equal(isStatusState('hasOwnProperty'), false);
  assert.equal(isStatusState(42), false);
});

test('project maturity words map onto registry states', () => {
  assert.equal(resolveProjectStatus('released').state, 'published');
  assert.equal(resolveProjectStatus('in-progress').state, 'in_progress');
  assert.equal(resolveProjectStatus('experimental').state, 'draft');
  assert.equal(resolveProjectStatus('archived').state, 'archived');
  assert.equal(resolveProjectStatus('nonsense').state, 'unknown');
  assert.equal(resolveProjectStatus(undefined).state, 'unknown');

  for (const state of Object.values(PROJECT_STATUS_STATES)) {
    assert.ok(isStatusState(state), `${state} is not a StatusState`);
  }
});

test('danger states are the only ones marked for announcement', () => {
  const announcing = STATUS_STATES.filter((state) => STATUS_REGISTRY[state].announce);
  assert.deepEqual([...announcing].sort(), ['critical', 'error', 'failed', 'offline']);
  for (const state of announcing) {
    assert.equal(STATUS_REGISTRY[state].variant, 'danger', `${state} must be danger`);
  }
});

/* ---------- Token coverage ------------------------------------------------ */

const tokensPath = path.join(import.meta.dirname, '../src/styles/tokens.css');
const tokens = await readFile(tokensPath, 'utf8');

// Split at the light-theme media query so each theme can be checked alone.
const lightStart = tokens.indexOf('@media (prefers-color-scheme: light)');
assert.ok(lightStart > 0, 'light theme block not found');
const darkBlock = tokens.slice(0, lightStart);
const lightBlock = tokens.slice(lightStart);

const REQUIRED = [
  '--status-success',
  '--status-success-bg',
  '--status-success-border',
  '--status-warning',
  '--status-warning-bg',
  '--status-warning-border',
  '--status-danger',
  '--status-danger-bg',
  '--status-danger-border',
  '--status-info',
  '--status-info-bg',
  '--status-info-border',
  '--status-neutral',
  '--status-neutral-bg',
  '--status-neutral-border',
  '--status-pending',
  '--status-pending-bg',
  '--status-pending-border',
];

test('every status token exists in both themes', () => {
  for (const token of REQUIRED) {
    assert.ok(darkBlock.includes(`${token}:`), `${token} missing from dark theme`);
    assert.ok(lightBlock.includes(`${token}:`), `${token} missing from light theme`);
  }
});

test('no status token resolves to a literal colour in the light block twice', () => {
  // Guards against a copy-paste that leaves the dark hex in the light theme.
  const lightValues = new Map<string, string>();
  for (const token of REQUIRED) {
    const match = lightBlock.match(new RegExp(`${token}:\\s*([^;]+);`));
    assert.ok(match, `${token} has no value in light theme`);
    lightValues.set(token, match[1].trim());
  }
  assert.notEqual(
    lightValues.get('--status-success'),
    darkBlock.match(/--status-success:\s*([^;]+);/)?.[1].trim(),
    'light --status-success equals the dark value',
  );
});

/* ---------- Built output -------------------------------------------------- */

const distPath = path.join(import.meta.dirname, '../dist/projects/index.html');
let dist = '';
try {
  dist = await readFile(distPath, 'utf8');
} catch {
  // No build yet: the source-level checks above still stand. `npm test` builds
  // before it reaches here.
}

test('rendered status indicators hide their icon and keep their text', { skip: !dist }, () => {
  const indicators = dist.match(/<span[^>]*class="[^"]*status-indicator[^"]*"[\s\S]*?<\/span>\s*<\/span>/g) ?? [];
  assert.ok(indicators.length > 0, 'no status indicators in the built projects page');

  for (const block of indicators) {
    assert.match(block, /aria-hidden="true"/, 'icon is exposed to assistive tech');
    assert.doesNotMatch(block, /aria-live|role="status"|role="alert"/, 'indicator announces itself');
    const label = block.match(/status-indicator__label">([^<]*)</)?.[1] ?? '';
    assert.ok(label.trim().length > 0, 'indicator has no visible text');
  }
});

test('rendered status indicators never carry an inline colour', { skip: !dist }, () => {
  assert.doesNotMatch(dist, /class="[^"]*status-indicator[^"]*"[^>]*style=/);
});

/* ---------- Component contract ------------------------------------------- */

const componentPath = path.join(import.meta.dirname, '../src/components/StatusIndicator.astro');
const component = await readFile(componentPath, 'utf8');

test('the component never declares a live region', () => {
  assert.doesNotMatch(component, /aria-live/);
  assert.doesNotMatch(component, /role="(status|alert)"/);
});

test('the component derives colour from the variant, not from props', () => {
  assert.match(component, /status-indicator--\$\{resolved\.variant\}/);
  assert.doesNotMatch(component, /style=/);
  assert.doesNotMatch(component, /#[0-9a-fA-F]{3,6}\b/);
});

test('the status stylesheet declares no shadow', async () => {
  const css = await readFile(path.join(import.meta.dirname, '../src/styles/status.css'), 'utf8');
  assert.doesNotMatch(css, /box-shadow|text-shadow|drop-shadow|filter:\s*blur/);
});

// Keep the type import used so a future edit cannot drop it silently.
export type { StatusState };
