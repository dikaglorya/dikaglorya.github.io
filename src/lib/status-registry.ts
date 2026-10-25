/* ==========================================================================
   ObitoGlory — status registry

   One place that decides, for every state the site can report: which Lucide
   icon, which semantic colour variant, and which human label. Components read
   from here; they never pick an icon or a colour themselves.

   Why icon nodes rather than JSX: this site is static Astro with no React.
   `lucide` ships each icon as a plain `[tag, attrs][]` array (an IconNode), so
   the registry stays framework-free and the Astro component renders the same
   data the browser would. If the project ever gains React, the same nodes can
   be passed to `createElement` from `lucide`.
   ========================================================================== */

import {
  Activity,
  AlertCircle,
  AlertTriangle,
  Ban,
  CalendarClock,
  CalendarX,
  Check,
  CheckCheck,
  CheckCircle2,
  CircleHelp,
  CirclePause,
  CirclePlay,
  CircleStop,
  CircleDot,
  Clock3,
  FileCheck,
  FileEdit,
  Info,
  ListOrdered,
  LoaderCircle,
  MinusCircle,
  RefreshCw,
  RotateCcw,
  Send,
  ShieldAlert,
  ShieldCheck,
  Unplug,
  Upload,
  Wifi,
  WifiOff,
  Wrench,
  XCircle,
  type IconNode,
} from 'lucide';

/** The six canonical variants. Colour is derived from these, nothing else. */
export const STATUS_VARIANTS = [
  'success',
  'warning',
  'danger',
  'info',
  'neutral',
  'pending',
] as const;

export type StatusVariant = (typeof STATUS_VARIANTS)[number];

/**
 * Every state the application can report. Adding a state means adding it here
 * and in STATUS_REGISTRY — the `satisfies` at the bottom of the registry turns a
 * missing entry into a type error instead of a silent runtime fallback.
 */
export const STATUS_STATES = [
  'idle',
  'loading',
  'running',
  'queued',
  'pending',
  'scheduled',
  'awaiting_approval',
  'in_progress',
  'completed',
  'success',
  'saved',
  'connected',
  'disconnected',
  'reconnecting',
  'offline',
  'online',
  'healthy',
  'degraded',
  'warning',
  'error',
  'failed',
  'critical',
  'expired',
  'expiring',
  'approved',
  'rejected',
  'cancelled',
  'paused',
  'skipped',
  'retrying',
  'rate_limited',
  'maintenance',
  'update_available',
  'archived',
  'draft',
  'published',
  'unknown',
] as const;

export type StatusState = (typeof STATUS_STATES)[number];

export interface StatusDefinition {
  /** Lucide icon node, rendered as an inline SVG. */
  readonly icon: IconNode;
  readonly variant: StatusVariant;
  /** Short visible text. This is the status; the icon never replaces it. */
  readonly label: string;
  /** One sentence, exposed to screen readers only when asked for. */
  readonly description: string;
  /**
   * True only for conditions a user must hear without asking. The component
   * still never attaches a live region by itself — the announcing boundary
   * reads this flag. Announcing every badge would be noise.
   */
  readonly announce: boolean;
}

export interface ResolvedStatus extends StatusDefinition {
  readonly state: StatusState;
}

/* ---------- Canonical variants ------------------------------------------- */

export const STATUS_VARIANT_REGISTRY = {
  success: {
    icon: CheckCircle2,
    variant: 'success',
    label: 'Success',
    description: 'The operation completed successfully.',
    announce: false,
  },
  warning: {
    icon: AlertTriangle,
    variant: 'warning',
    label: 'Warning',
    description: 'Attention may be required.',
    announce: false,
  },
  danger: {
    icon: XCircle,
    variant: 'danger',
    label: 'Error',
    description: 'The operation failed or requires urgent attention.',
    announce: false,
  },
  info: {
    icon: Info,
    variant: 'info',
    label: 'Information',
    description: 'Informational update.',
    announce: false,
  },
  neutral: {
    icon: MinusCircle,
    variant: 'neutral',
    label: 'Inactive',
    description: 'No active operation or special condition.',
    announce: false,
  },
  pending: {
    icon: Clock3,
    variant: 'pending',
    label: 'Pending',
    description: 'The operation is waiting or in progress.',
    announce: false,
  },
} as const satisfies Record<StatusVariant, StatusDefinition>;

/* ---------- Application states ------------------------------------------- */

function defineStatus(
  icon: IconNode,
  variant: StatusVariant,
  label: string,
  description: string,
  announce = false,
): StatusDefinition {
  return { icon, variant, label, description, announce };
}

export const STATUS_REGISTRY = {
  idle: defineStatus(CircleDot, 'neutral', 'Idle', 'No operation is currently running.'),
  loading: defineStatus(LoaderCircle, 'pending', 'Loading', 'Content is loading.'),
  running: defineStatus(LoaderCircle, 'pending', 'Running', 'The operation is currently running.'),
  queued: defineStatus(ListOrdered, 'pending', 'Queued', 'The operation is waiting in a queue.'),
  pending: defineStatus(Clock3, 'pending', 'Pending', 'The operation is awaiting completion.'),
  scheduled: defineStatus(
    CalendarClock,
    'pending',
    'Scheduled',
    'The operation is scheduled for later.',
  ),
  awaiting_approval: defineStatus(
    Clock3,
    'pending',
    'Awaiting approval',
    'Approval is required before proceeding.',
  ),
  in_progress: defineStatus(CirclePlay, 'pending', 'In progress', 'Work is in progress.'),

  completed: defineStatus(
    CheckCircle2,
    'success',
    'Completed',
    'The operation completed successfully.',
  ),
  success: defineStatus(CheckCircle2, 'success', 'Success', 'The operation succeeded.'),
  saved: defineStatus(Check, 'success', 'Saved', 'Changes have been saved.'),
  connected: defineStatus(Wifi, 'success', 'Connected', 'The connection is established.'),
  online: defineStatus(Wifi, 'success', 'Online', 'The service is online.'),
  healthy: defineStatus(ShieldCheck, 'success', 'Healthy', 'The service is operating normally.'),
  approved: defineStatus(CheckCheck, 'success', 'Approved', 'The request has been approved.'),

  disconnected: defineStatus(
    Unplug,
    'neutral',
    'Disconnected',
    'The connection is intentionally inactive.',
  ),
  archived: defineStatus(FileCheck, 'neutral', 'Archived', 'The item has been archived.'),
  draft: defineStatus(FileEdit, 'neutral', 'Draft', 'The item has not been published.'),
  paused: defineStatus(CirclePause, 'neutral', 'Paused', 'The operation is paused.'),
  skipped: defineStatus(MinusCircle, 'neutral', 'Skipped', 'The operation was skipped.'),
  cancelled: defineStatus(CircleStop, 'neutral', 'Cancelled', 'The operation was cancelled.'),

  reconnecting: defineStatus(
    RefreshCw,
    'pending',
    'Reconnecting',
    'The system is attempting to reconnect.',
  ),
  retrying: defineStatus(RotateCcw, 'pending', 'Retrying', 'The operation is being retried.'),

  degraded: defineStatus(
    Activity,
    'warning',
    'Degraded',
    'The service is operating with reduced capability.',
  ),
  warning: defineStatus(AlertTriangle, 'warning', 'Warning', 'Attention is required.'),
  expiring: defineStatus(
    CalendarClock,
    'warning',
    'Expiring soon',
    'The item is approaching its expiration date.',
  ),
  rate_limited: defineStatus(
    Clock3,
    'warning',
    'Rate limited',
    'Requests are temporarily being limited.',
  ),
  maintenance: defineStatus(
    Wrench,
    'warning',
    'Maintenance',
    'Maintenance is in progress or scheduled.',
  ),
  update_available: defineStatus(
    Upload,
    'info',
    'Update available',
    'An update is available.',
  ),

  offline: defineStatus(
    WifiOff,
    'danger',
    'Offline',
    'The service or network is unexpectedly unavailable.',
    true,
  ),
  error: defineStatus(AlertCircle, 'danger', 'Error', 'An error occurred.', true),
  failed: defineStatus(XCircle, 'danger', 'Failed', 'The operation failed.', true),
  critical: defineStatus(
    ShieldAlert,
    'danger',
    'Critical',
    'A critical condition requires immediate attention.',
    true,
  ),
  expired: defineStatus(CalendarX, 'danger', 'Expired', 'The item has expired.'),
  rejected: defineStatus(Ban, 'danger', 'Rejected', 'The request was rejected.'),

  published: defineStatus(Send, 'success', 'Published', 'The item has been published.'),

  unknown: defineStatus(
    CircleHelp,
    'neutral',
    'Unknown',
    'The current state could not be determined.',
  ),
} as const satisfies Record<StatusState, StatusDefinition>;

/* ---------- Type-safe resolution ----------------------------------------- */

const STATUS_STATE_SET: ReadonlySet<string> = new Set(STATUS_STATES);
const STATUS_VARIANT_SET: ReadonlySet<string> = new Set(STATUS_VARIANTS);

export function isStatusState(value: unknown): value is StatusState {
  return typeof value === 'string' && STATUS_STATE_SET.has(value);
}

export function isStatusVariant(value: unknown): value is StatusVariant {
  return typeof value === 'string' && STATUS_VARIANT_SET.has(value);
}

/**
 * Resolve anything to a renderable status.
 *
 * Three inputs are accepted, in order: a state name, a bare variant name
 * (`danger` / `info` / `neutral` are not states but callers reach for them), and
 * everything else. Anything left over becomes `unknown`, which is neutral and
 * labelled — never a blank badge and never a thrown error, because a status can
 * arrive from content or a URL and is not trusted.
 */
export function resolveStatus(value: unknown): ResolvedStatus {
  if (isStatusState(value)) {
    return { state: value, ...STATUS_REGISTRY[value] };
  }

  if (isStatusVariant(value)) {
    return { state: 'unknown', ...STATUS_VARIANT_REGISTRY[value] };
  }

  return { state: 'unknown', ...STATUS_REGISTRY.unknown };
}

/* ---------- Project maturity --------------------------------------------

   The portfolio already labels projects as released / experimental /
   in-progress / archived. Those are domain words, not generic states, so they
   map explicitly onto the registry instead of being renamed at the data layer.
   ------------------------------------------------------------------------- */

export const PROJECT_STATUS_STATES = {
  released: 'published',
  experimental: 'draft',
  'in-progress': 'in_progress',
  archived: 'archived',
} as const satisfies Record<string, StatusState>;

export type ProjectMaturity = keyof typeof PROJECT_STATUS_STATES;

export function resolveProjectStatus(status: unknown): ResolvedStatus {
  const state =
    typeof status === 'string' && status in PROJECT_STATUS_STATES
      ? PROJECT_STATUS_STATES[status as ProjectMaturity]
      : 'unknown';
  return resolveStatus(state);
}
