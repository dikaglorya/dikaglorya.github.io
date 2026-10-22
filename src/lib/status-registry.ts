export const STATUS_VARIANTS = [
  'success',
  'warning',
  'danger',
  'info',
  'neutral',
  'pending',
] as const;

export type StatusVariant = (typeof STATUS_VARIANTS)[number];

export const STATUS_ICON_NAMES = [
  'Activity',
  'Ban',
  'CalendarClock',
  'CalendarX',
  'Check',
  'CheckCheck',
  'CircleAlert',
  'CircleCheck',
  'CircleDot',
  'CircleMinus',
  'CirclePause',
  'CirclePlay',
  'CircleQuestionMark',
  'CircleStop',
  'CircleX',
  'Clock3',
  'FileCheck',
  'FilePenLine',
  'Info',
  'ListOrdered',
  'LoaderCircle',
  'RefreshCw',
  'Send',
  'ShieldAlert',
  'ShieldCheck',
  'TriangleAlert',
  'Unplug',
  'Upload',
  'Wifi',
  'WifiOff',
  'Wrench',
] as const;

export type StatusIconName = (typeof STATUS_ICON_NAMES)[number];

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
  'danger',
  'error',
  'failed',
  'critical',
  'info',
  'neutral',
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
  'available',
  'unknown',
] as const;

export type StatusState = (typeof STATUS_STATES)[number];

export interface StatusDefinition {
  readonly icon: StatusIconName;
  readonly variant: StatusVariant;
  readonly label: string;
  readonly description: string;
  readonly announce: boolean;
}

export interface ResolvedStatus extends StatusDefinition {
  readonly state: StatusState;
}

export const STATUS_VARIANT_REGISTRY = {
  success: {
    icon: 'CircleCheck',
    variant: 'success',
    label: 'Berhasil',
    description: 'Operasi selesai dengan berhasil.',
    announce: false,
  },
  warning: {
    icon: 'TriangleAlert',
    variant: 'warning',
    label: 'Perlu perhatian',
    description: 'Kondisi ini mungkin memerlukan perhatian.',
    announce: false,
  },
  danger: {
    icon: 'CircleX',
    variant: 'danger',
    label: 'Kesalahan',
    description: 'Operasi gagal atau memerlukan perhatian segera.',
    announce: false,
  },
  info: {
    icon: 'Info',
    variant: 'info',
    label: 'Informasi',
    description: 'Pembaruan informasi.',
    announce: false,
  },
  neutral: {
    icon: 'CircleMinus',
    variant: 'neutral',
    label: 'Tidak aktif',
    description: 'Tidak ada operasi aktif atau kondisi khusus.',
    announce: false,
  },
  pending: {
    icon: 'Clock3',
    variant: 'pending',
    label: 'Menunggu',
    description: 'Operasi sedang menunggu atau berlangsung.',
    announce: false,
  },
} as const satisfies Record<StatusVariant, StatusDefinition>;

const defineStatus = (
  icon: StatusIconName,
  variant: StatusVariant,
  label: string,
  description: string,
  announce = false,
): StatusDefinition => ({ icon, variant, label, description, announce });

export const STATUS_REGISTRY = {
  idle: defineStatus('CircleDot', 'neutral', 'Tidak aktif', 'Tidak ada operasi yang sedang berjalan.'),
  loading: defineStatus('LoaderCircle', 'pending', 'Memuat', 'Konten sedang dimuat.'),
  running: defineStatus('LoaderCircle', 'pending', 'Berjalan', 'Operasi sedang berjalan.'),
  queued: defineStatus('ListOrdered', 'pending', 'Dalam antrean', 'Operasi sedang menunggu dalam antrean.'),
  pending: defineStatus('Clock3', 'pending', 'Menunggu', 'Operasi menunggu penyelesaian.'),
  scheduled: defineStatus('CalendarClock', 'pending', 'Terjadwal', 'Operasi dijadwalkan untuk waktu mendatang.'),
  awaiting_approval: defineStatus('Clock3', 'pending', 'Menunggu persetujuan', 'Persetujuan diperlukan sebelum melanjutkan.'),
  in_progress: defineStatus('CirclePlay', 'pending', 'Sedang diproses', 'Pekerjaan sedang berlangsung.'),

  completed: defineStatus('CircleCheck', 'success', 'Selesai', 'Operasi selesai dengan berhasil.'),
  success: defineStatus('CircleCheck', 'success', 'Berhasil', 'Operasi berhasil.'),
  saved: defineStatus('Check', 'success', 'Tersimpan', 'Perubahan telah disimpan.'),
  connected: defineStatus('Wifi', 'success', 'Terhubung', 'Koneksi telah tersambung.'),
  online: defineStatus('Wifi', 'success', 'Online', 'Layanan sedang online.'),
  healthy: defineStatus('ShieldCheck', 'success', 'Sehat', 'Layanan beroperasi dengan normal.'),
  approved: defineStatus('CheckCheck', 'success', 'Disetujui', 'Permintaan telah disetujui.'),
  published: defineStatus('Send', 'success', 'Dipublikasikan', 'Item telah dipublikasikan.'),
  available: defineStatus('CircleCheck', 'success', 'Tersedia', 'Terbuka untuk proyek pilihan.'),

  disconnected: defineStatus('Unplug', 'neutral', 'Terputus', 'Koneksi sengaja dinonaktifkan.'),
  archived: defineStatus('FileCheck', 'neutral', 'Diarsipkan', 'Item telah diarsipkan.'),
  draft: defineStatus('FilePenLine', 'neutral', 'Draf', 'Item belum dipublikasikan.'),
  paused: defineStatus('CirclePause', 'neutral', 'Dijeda', 'Operasi sedang dijeda.'),
  skipped: defineStatus('CircleMinus', 'neutral', 'Dilewati', 'Operasi dilewati.'),
  cancelled: defineStatus('CircleStop', 'neutral', 'Dibatalkan', 'Operasi dibatalkan.'),

  reconnecting: defineStatus('RefreshCw', 'pending', 'Menghubungkan ulang', 'Sistem sedang mencoba menyambung kembali.'),
  retrying: defineStatus('RefreshCw', 'pending', 'Mencoba ulang', 'Operasi sedang dicoba ulang.'),
  degraded: defineStatus('Activity', 'warning', 'Menurun', 'Layanan beroperasi dengan kemampuan terbatas.'),
  warning: defineStatus('TriangleAlert', 'warning', 'Peringatan', 'Kondisi memerlukan perhatian.'),
  danger: defineStatus('CircleX', 'danger', 'Kesalahan', 'Operasi gagal atau memerlukan perhatian segera.'),
  info: defineStatus('Info', 'info', 'Informasi', 'Pembaruan informasi.'),
  neutral: defineStatus('CircleMinus', 'neutral', 'Tidak aktif', 'Tidak ada operasi aktif atau kondisi khusus.'),
  expiring: defineStatus('CalendarClock', 'warning', 'Segera kedaluwarsa', 'Item mendekati tanggal kedaluwarsa.'),
  rate_limited: defineStatus('Clock3', 'warning', 'Dibatasi sementara', 'Permintaan sedang dibatasi sementara.'),
  maintenance: defineStatus('Wrench', 'warning', 'Pemeliharaan', 'Pemeliharaan sedang berlangsung atau dijadwalkan.'),
  update_available: defineStatus('Upload', 'info', 'Pembaruan tersedia', 'Pembaruan baru tersedia.'),

  offline: defineStatus('WifiOff', 'danger', 'Offline', 'Layanan atau jaringan tidak tersedia secara tidak terduga.', true),
  error: defineStatus('CircleAlert', 'danger', 'Kesalahan', 'Terjadi kesalahan.', true),
  failed: defineStatus('CircleX', 'danger', 'Gagal', 'Operasi gagal.', true),
  critical: defineStatus('ShieldAlert', 'danger', 'Kritis', 'Kondisi kritis memerlukan perhatian segera.', true),
  expired: defineStatus('CalendarX', 'danger', 'Kedaluwarsa', 'Item telah kedaluwarsa.'),
  rejected: defineStatus('Ban', 'danger', 'Ditolak', 'Permintaan ditolak.'),

  unknown: defineStatus('CircleQuestionMark', 'neutral', 'Tidak diketahui', 'Status saat ini tidak dapat ditentukan.'),
} as const satisfies Record<StatusState, StatusDefinition>;

const STATUS_STATE_SET: ReadonlySet<string> = new Set(STATUS_STATES);

export function isStatusState(value: unknown): value is StatusState {
  return typeof value === 'string' && STATUS_STATE_SET.has(value);
}

export function resolveStatus(value: unknown): ResolvedStatus {
  const state: StatusState = isStatusState(value) ? value : 'unknown';
  return { state, ...STATUS_REGISTRY[state] };
}
