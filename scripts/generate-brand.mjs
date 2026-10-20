import { readFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';
import { chromium } from 'playwright';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = path.join(root, 'public');

const fontData = async (relativePath) =>
  (await readFile(path.join(root, relativePath))).toString('base64');

const [inter, newsreader, mono, portrait] = await Promise.all([
  fontData('node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2'),
  fontData('node_modules/@fontsource-variable/newsreader/files/newsreader-latin-wght-normal.woff2'),
  fontData('node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff2'),
  fontData('src/assets/portrait.jpg'),
]);

const fontFaces = `@font-face {
        font-family: 'Inter';
        src: url(data:font/woff2;base64,${inter}) format('woff2');
        font-weight: 100 900;
        font-style: normal;
      }
      @font-face {
        font-family: 'Newsreader';
        src: url(data:font/woff2;base64,${newsreader}) format('woff2');
        font-weight: 200 800;
        font-style: normal;
      }
      @font-face {
        font-family: 'JetBrains Mono';
        src: url(data:font/woff2;base64,${mono}) format('woff2');
        font-weight: 400;
        font-style: normal;
      }`;

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <style>
      ${fontFaces}
      * { box-sizing: border-box; margin: 0; }
      html, body { width: 1200px; height: 630px; }
      body {
        background: #08090b;
        color: #e4eaf2;
        font-family: 'Inter', sans-serif;
      }
      .card {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 100%;
        height: 100%;
        padding: 48px 56px 40px;
      }
      .card::after {
        content: '';
        position: absolute;
        inset: 24px;
        border: 1px solid #252934;
        pointer-events: none;
      }
      header, footer {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 24px;
      }
      .wordmark {
        font-size: 34px;
        font-weight: 680;
        line-height: 1;
        letter-spacing: -0.04em;
      }
      .wordmark span { color: #8ec9dc; }
      .handle, footer {
        font-family: 'JetBrains Mono', monospace;
        font-size: 15px;
        line-height: 1.5;
        color: #8b93a6;
        letter-spacing: 0.02em;
      }
      .handle { text-align: right; }
      .body {
        display: grid;
        grid-template-columns: minmax(0, 1fr) 376px;
        gap: 36px;
        align-items: center;
      }
      main { min-width: 0; }
      .eyebrow {
        margin-bottom: 16px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 14px;
        color: #8b93a6;
        letter-spacing: 0.12em;
        text-transform: uppercase;
      }
      h1 {
        white-space: nowrap;
        font-family: 'Newsreader', Georgia, serif;
        font-size: 74px;
        font-weight: 360;
        line-height: 0.95;
        letter-spacing: -0.045em;
      }
      h1 span { color: #8ec9dc; }
      .sub {
        max-width: 620px;
        margin-top: 20px;
        font-size: 21px;
        line-height: 1.45;
        color: #8b93a6;
      }
      footer { align-items: flex-end; }
      .url { color: #8ec9dc; }
      .portrait {
        border: 1px solid #414958;
        border-radius: 6px;
        background: #0c0e14;
        padding: 8px;
      }
      .portrait img {
        display: block;
        width: 100%;
        height: auto;
        border-radius: 2px;
      }
      .caption {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        margin-top: 8px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 12px;
        line-height: 1.5;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: #8b93a6;
      }
      .caption b { color: #e4eaf2; font-weight: 400; }
    </style>
  </head>
  <body>
    <div class="card">
      <header>
        <div class="wordmark">obitoglory<span>.</span></div>
        <div class="handle">DikaGlorya / independent developer<br />Kendal, Indonesia</div>
      </header>
      <div class="body">
        <main>
          <p class="eyebrow">Websites / bots / AI tools / security automation</p>
          <h1>Useful software,<br />built by DikaGlorya<span>.</span></h1>
          <p class="sub">ObitoGlory is the home for practical software, developer tools, and technical notes.</p>
        </main>
        <figure class="portrait">
          <img src="data:image/jpeg;base64,${portrait}" alt="Masked portrait of DikaGlorya" />
          <figcaption class="caption"><b>DikaGlorya / developer</b><span>Masked portrait</span></figcaption>
        </figure>
      </div>
      <footer>
        <span class="url">obitoglory.tech</span>
        <span>github.com/dikaglorya / t.me/dikaacode</span>
      </footer>
    </div>
  </body>
</html>`;

// Shared render: put HTML into a fixed-viewport page, wait for the self-hosted
// fonts, and screenshot. Deterministic output, no external requests.
const renderCard = async (cardHtml, { width, height, file }) => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  await page.setContent(cardHtml, { waitUntil: 'load' });
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
  await page.screenshot({ path: file, type: 'png' });
  await browser.close();
};

const args = process.argv.slice(2);
const flagValue = (name) => {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
};
const repoName = flagValue('--repo');

// Repository social preview mode: 1280x720 GitHub repo card, same identity,
// no portrait so the card stays a code artifact. Run:
//   node scripts/generate-brand.mjs --repo <repo> --tagline "<one sentence>"
if (repoName) {
  const tagline = flagValue('--tagline');
  if (!tagline) throw new Error('--repo requires --tagline');

  const repoHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <style>
      ${fontFaces}
      * { box-sizing: border-box; margin: 0; }
      html, body { width: 1280px; height: 720px; }
      body {
        background: #08090b;
        color: #e4eaf2;
        font-family: 'Inter', sans-serif;
      }
      .card {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 100%;
        height: 100%;
        padding: 52px 64px 44px;
      }
      .card::after {
        content: '';
        position: absolute;
        inset: 26px;
        border: 1px solid #252934;
        pointer-events: none;
      }
      header, footer {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 24px;
      }
      .wordmark {
        font-size: 34px;
        font-weight: 680;
        line-height: 1;
        letter-spacing: -0.04em;
      }
      .wordmark span { color: #8ec9dc; }
      .repo-path {
        font-family: 'JetBrains Mono', monospace;
        font-size: 15px;
        line-height: 1.5;
        color: #8b93a6;
        text-align: right;
      }
      .eyebrow {
        margin-bottom: 18px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 14px;
        color: #8b93a6;
        letter-spacing: 0.12em;
        text-transform: uppercase;
      }
      h1 {
        font-family: 'Newsreader', Georgia, serif;
        font-size: 88px;
        font-weight: 360;
        line-height: 1;
        letter-spacing: -0.045em;
      }
      h1 span { color: #8ec9dc; }
      .sub {
        max-width: 780px;
        margin-top: 22px;
        font-size: 22px;
        line-height: 1.45;
        color: #8b93a6;
      }
      footer { align-items: flex-end; }
      footer span {
        font-family: 'JetBrains Mono', monospace;
        font-size: 15px;
        color: #8b93a6;
      }
      .url { color: #8ec9dc; }
    </style>
  </head>
  <body>
    <div class="card">
      <header>
        <div class="wordmark">obitoglory<span>.</span></div>
        <div class="repo-path">github.com/dikaglorya/${repoName}</div>
      </header>
      <main>
        <p class="eyebrow">Repository / DikaGlorya</p>
        <h1>${repoName}<span>.</span></h1>
        <p class="sub">${tagline}</p>
      </main>
      <footer>
        <span class="url">obitoglory.tech</span>
        <span>DikaCode / independent developer</span>
      </footer>
    </div>
  </body>
</html>`;

  const previewsDir = path.join(publicDir, 'social-previews');
  await mkdir(previewsDir, { recursive: true });
  await renderCard(repoHtml, {
    width: 1280,
    height: 720,
    file: path.join(previewsDir, `${repoName}.png`),
  });
  console.log(`Generated public/social-previews/${repoName}.png (1280x720).`);
} else {
  await renderCard(html, {
    width: 1200,
    height: 630,
    file: path.join(publicDir, 'og-default.png'),
  });
  console.log('Generated public/og-default.png (1200x630).');
}

await sharp(path.join(publicDir, 'favicon.svg'))
  .resize(180, 180)
  .png()
  .toFile(path.join(publicDir, 'apple-touch-icon.png'));

await sharp(path.join(publicDir, 'favicon.svg'))
  .resize(512, 512)
  .png()
  .toFile(path.join(publicDir, 'social-avatar.png'));

console.log('Generated public/apple-touch-icon.png (180x180) and public/social-avatar.png (512x512).');