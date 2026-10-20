export type BriefData = {
  name: string;
  email: string;
  service: string;
  budget: string;
  message: string;
  sentAt?: Date;
  sourceUrl?: string;
  siteName?: string;
  location?: string;
};

// Gmail keeps inline styles on tables, but drops <style> blocks on paste.
// Everything visual therefore lives in attributes or inline styles.
const FONT =
  "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const INK = '#1d1d1f';
const MUTED = '#6e6e73';
const ACCENT = '#0063cc';
const ACCENT_SOFT = '#e8f1fc';
const LINE = '#e5e7eb';
const CHROME = '#f5f5f7';
const SUNKEN = '#f2f3f5';
const PAPER = '#ffffff';

const singleLine = (value: string) => value.replace(/\s+/g, ' ').trim();

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const getInitials = (name: string) => {
  const parts = singleLine(name).split(' ').filter(Boolean);
  if (!parts.length) return '?';
  return parts
    .slice(0, 2)
    .map((part) => Array.from(part)[0]?.toUpperCase() ?? '')
    .join('');
};

const getSource = (sourceUrl?: string) => {
  if (!sourceUrl) {
    return { label: 'dikaglorya.github.io/contact', href: 'https://dikaglorya.github.io/contact/' };
  }

  try {
    const url = new URL(sourceUrl);
    url.search = '';
    url.hash = '';
    const path = url.pathname === '/' ? '' : url.pathname;
    return { label: `${url.host}${path}`, href: url.toString() };
  } catch {
    return { label: 'dikaglorya.github.io/contact', href: sourceUrl };
  }
};

const getDate = (date = new Date()) =>
  new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);

const getValues = (data: BriefData) => ({
  name: singleLine(data.name) || '[Nama]',
  email: singleLine(data.email) || '[email@contoh.com]',
  service: singleLine(data.service) || 'Pembuatan website',
  budget: singleLine(data.budget) || 'Belum ditentukan',
  message: data.message.trim() || '[Ceritakan kebutuhan proyekmu di sini.]',
  siteName: singleLine(data.siteName ?? '') || 'ObitoGlory',
  location: singleLine(data.location ?? '') || 'Kendal, Jawa Tengah, Indonesia',
});

export const buildBriefSubject = (data: BriefData) => {
  const service = singleLine(data.service) || 'Layanan';
  const name = singleLine(data.name) || 'Nama';
  return `Brief proyek: ${service} - ${name}`;
};

export const buildBriefText = (data: BriefData) => {
  const values = getValues(data);
  const source = getSource(data.sourceUrl);

  return [
    `Brief proyek: ${values.service}`,
    '',
    `Nama: ${values.name}`,
    `Email: ${values.email}`,
    `Anggaran: ${values.budget}`,
    '',
    'Kebutuhan:',
    values.message,
    '',
    `Dikirim dari ${source.label}`,
    `${values.siteName}, ${values.location}`,
  ].join('\n');
};

export const buildBriefFragment = (data: BriefData) => {
  const values = getValues(data);
  const source = getSource(data.sourceUrl);
  const date = getDate(data.sentAt);
  const messageHtml = escapeHtml(values.message).replace(/\r\n/g, '\n').replace(/\n/g, '<br>');

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
  <tr>
    <td align="center" style="padding:0;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="${PAPER}" style="width:100%;max-width:600px;border-collapse:separate;border-spacing:0;background:${PAPER};border:1px solid ${LINE};border-radius:16px;overflow:hidden;box-shadow:0 18px 44px -28px rgb(15 23 42 / 45%);font-family:${FONT};">
        <tr>
          <td height="3" bgcolor="${ACCENT}" style="height:3px;line-height:3px;font-size:0;background:${ACCENT};border-radius:15px 15px 0 0;">&nbsp;</td>
        </tr>
        <tr>
          <td bgcolor="${CHROME}" style="padding:11px 16px;background:${CHROME};border-bottom:1px solid ${LINE};">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
              <tr>
                <td width="60" style="width:60px;font-size:0;line-height:0;">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
                    <tr>
                      <td width="11" height="11" style="width:11px;height:11px;border-radius:6px;background:#ff5f57;font-size:0;line-height:0;">&nbsp;</td>
                      <td width="7" style="width:7px;font-size:0;line-height:0;">&nbsp;</td>
                      <td width="11" height="11" style="width:11px;height:11px;border-radius:6px;background:#febc2e;font-size:0;line-height:0;">&nbsp;</td>
                      <td width="7" style="width:7px;font-size:0;line-height:0;">&nbsp;</td>
                      <td width="11" height="11" style="width:11px;height:11px;border-radius:6px;background:#28c840;font-size:0;line-height:0;">&nbsp;</td>
                    </tr>
                  </table>
                </td>
                <td align="center" style="font-family:${FONT};font-size:12px;line-height:1.2;color:${MUTED};font-weight:500;">Brief proyek</td>
                <td width="60" align="right" style="width:60px;font-family:${FONT};font-size:11px;line-height:1.2;color:${MUTED};font-weight:600;white-space:nowrap;">ObitoGlory</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 24px 0;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
              <tr>
                <td width="52" valign="middle" style="width:52px;font-size:0;line-height:0;">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
                    <tr>
                      <td width="40" height="40" align="center" valign="middle" bgcolor="${ACCENT_SOFT}" style="width:40px;height:40px;border-radius:20px;background:${ACCENT_SOFT};font-family:${FONT};font-size:14px;line-height:40px;font-weight:600;color:${ACCENT};">${escapeHtml(getInitials(values.name))}</td>
                    </tr>
                  </table>
                </td>
                <td valign="middle" style="font-family:${FONT};">
                  <div style="font-size:16px;line-height:1.3;color:${INK};font-weight:600;">${escapeHtml(values.name)}</div>
                  <div style="padding-top:2px;font-size:13px;line-height:1.4;color:${MUTED};">${escapeHtml(values.email)}</div>
                </td>
                <td align="right" valign="top" style="font-family:${FONT};font-size:12px;line-height:1.4;color:${MUTED};white-space:nowrap;">${escapeHtml(date)}</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 24px 0;">
            <div style="border-top:1px solid ${LINE};font-size:0;line-height:0;">&nbsp;</div>
          </td>
        </tr>
        <tr>
          <td style="padding:18px 24px 0;font-family:${FONT};">
            <div style="font-size:12px;line-height:1.4;color:${MUTED};font-weight:500;">Brief proyek</div>
            <div style="padding-top:5px;font-size:24px;line-height:1.25;color:${INK};font-weight:600;letter-spacing:-0.02em;">${escapeHtml(values.service)}</div>
          </td>
        </tr>
        <tr>
          <td style="padding:18px 24px 0;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;border-top:1px solid ${LINE};border-bottom:1px solid ${LINE};">
              <tr>
                <td style="padding:11px 0;font-family:${FONT};font-size:13px;line-height:1.4;color:${MUTED};">Anggaran</td>
                <td align="right" style="padding:11px 0;font-family:${FONT};font-size:13px;line-height:1.4;color:${INK};font-weight:500;">${escapeHtml(values.budget)}</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:18px 24px 0;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${SUNKEN}" style="border-collapse:separate;background:${SUNKEN};border-radius:12px;">
              <tr>
                <td style="padding:16px 18px;font-family:${FONT};">
                  <div style="font-size:12px;line-height:1.4;color:${MUTED};font-weight:600;">Kebutuhan</div>
                  <div style="padding-top:6px;font-size:15px;line-height:1.65;color:${INK};">${messageHtml}</div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 24px 24px;font-family:${FONT};">
            <div style="border-top:1px solid ${LINE};padding-top:14px;font-size:12px;line-height:1.6;color:${MUTED};">
              Dikirim dari <a href="${escapeHtml(source.href)}" target="_blank" style="color:${ACCENT};text-decoration:none;">${escapeHtml(source.label)}</a><br>
              ${escapeHtml(values.siteName)}, ${escapeHtml(values.location)}
            </div>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`;
};

