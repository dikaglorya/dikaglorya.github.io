import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  STATUS_ICON_NAMES,
  STATUS_REGISTRY,
  STATUS_STATES,
  STATUS_VARIANT_REGISTRY,
  STATUS_VARIANTS,
  isStatusState,
  resolveStatus,
} from '../src/lib/status-registry.ts';

const luminance = (hex) => {
  const channels = hex.match(/[\da-f]{2}/gi)?.slice(0, 3).map((value) => parseInt(value, 16) / 255) ?? [];
  assert.equal(channels.length, 3, `expected a six-digit hex color, got ${hex}`);
  const [r, g, b] = channels.map((value) =>
    value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrastRatio = (foreground, background) => {
  const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
};

assert.equal(new Set(STATUS_STATES).size, STATUS_STATES.length, 'state list must not contain duplicates');
assert.deepEqual(
  Object.keys(STATUS_REGISTRY).sort(),
  [...STATUS_STATES].sort(),
  'every declared status state must have exactly one registry entry',
);

for (const state of STATUS_STATES) {
  const definition = STATUS_REGISTRY[state];
  assert.ok(STATUS_VARIANTS.includes(definition.variant), `${state} has an unknown variant`);
  assert.ok(STATUS_ICON_NAMES.includes(definition.icon), `${state} has an unknown icon`);
  assert.ok(definition.label.trim(), `${state} needs a readable label`);
  assert.ok(definition.description.trim(), `${state} needs a description`);
  assert.equal(typeof definition.announce, 'boolean', `${state} needs explicit announcement policy`);
}

for (const variant of STATUS_VARIANTS) {
  const definition = STATUS_VARIANT_REGISTRY[variant];
  assert.equal(definition.variant, variant, `${variant} must resolve to its canonical variant`);
  assert.ok(STATUS_ICON_NAMES.includes(definition.icon), `${variant} has an unknown canonical icon`);
  assert.ok(definition.label && definition.description, `${variant} needs accessible copy`);
}

assert.equal(isStatusState('connected'), true);
assert.equal(isStatusState('not-a-real-state'), false);
assert.equal(isStatusState(null), false);
assert.equal(resolveStatus('not-a-real-state').state, 'unknown');
assert.equal(resolveStatus(undefined).variant, 'neutral');
assert.equal(resolveStatus('connected').variant, 'success');
assert.equal(resolveStatus('disconnected').variant, 'neutral');
assert.equal(resolveStatus('offline').variant, 'danger');
assert.equal(resolveStatus('reconnecting').variant, 'pending');
assert.equal(resolveStatus('available').icon, 'CircleCheck');

const css = await readFile(new URL('../src/styles/restyle.css', import.meta.url), 'utf8');
const glassCss = await readFile(new URL('../src/styles/liquid-glass.css', import.meta.url), 'utf8');
const indicator = await readFile(new URL('../src/components/StatusIndicator.astro', import.meta.url), 'utf8');
const contact = await readFile(new URL('../src/scripts/contact.ts', import.meta.url), 'utf8');
const contactPage = await readFile(new URL('../src/pages/contact.astro', import.meta.url), 'utf8');
const backgrounds = [...css.matchAll(/--bg:\s*(#[\da-f]{6})/gi)].map((match) => match[1]);
assert.ok(backgrounds.length >= 2, 'dark and light theme background tokens must exist');
const [darkBackground, lightBackground] = [backgrounds[0], backgrounds.at(-1)];
for (const variant of STATUS_VARIANTS) {
  for (const token of [`--status-${variant}:`, `--status-${variant}-bg:`, `--status-${variant}-border:`]) {
    assert.ok((css.match(new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) ?? []).length >= 2,
      `${token} must be defined for both color-scheme palettes`);
  }
  const foregrounds = [...css.matchAll(new RegExp(`--status-${variant}:\\s*(#[\\da-f]{6})`, 'gi'))]
    .map((match) => match[1]);
  assert.ok(foregrounds.length >= 2, `${variant} needs dark and light foreground tokens`);
  assert.ok(contrastRatio(foregrounds[0], darkBackground) >= 4.5, `${variant} dark text must meet 4.5:1 contrast`);
  assert.ok(contrastRatio(foregrounds.at(-1), lightBackground) >= 4.5, `${variant} light text must meet 4.5:1 contrast`);
  assert.ok(glassCss.includes(`.status-indicator--${variant}`), `styles should render ${variant}`);
}
assert.match(indicator, /status-indicator--\$\{resolved\.variant\}/, 'component should derive its class from the resolved variant');
assert.match(indicator, /aria-hidden="true"/, 'decorative icon must not be announced twice');
assert.match(indicator, /status-indicator__label/, 'status meaning must remain visible as text');
assert.doesNotMatch(indicator, /liquid-glass/, 'status badges must not create extra glass/backdrop layers');
assert.match(contact, /resolveStatus/, 'form feedback must use the shared semantic registry');
assert.match(contact, /dataset\.statusVariant/, 'feedback should expose the registry-derived variant');
assert.match(contactPage, /role="status"\s+aria-live="polite"\s+data-form-status/, 'form feedback should keep its existing polite live-region boundary');

console.log(`Status registry checks passed: ${STATUS_STATES.length} states, ${STATUS_VARIANTS.length} variants, unknown fallback, both theme tokens and WCAG AA text contrast.`);
