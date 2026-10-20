import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';
import { chromium } from 'playwright';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = path.join(root, 'public');

const fontData = async (relativePath) =>
  (await readFile(path.join(root, relativePath))).toString('base64');

const [inter, newsreader, mono] = await Promise.all([
  fontData('node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2'),
  fontData('node_modules/@fontsource-variable/newsreader/files/newsreader-latin-wght-normal.woff2'),
  fontData('node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff2'),
]);

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <style>
      @font-face {
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
      }
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
        padding: 56px 64px 48px;
      }
      .card::after {
        content: '';
        position: absolute;
        inset: 24px;
        border: 1px solid #252934;
        pointer-events: none;
      }
      header, footer { display: flex; align-items: flex-start; justify-content: space-between; }
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
      main { max-width: 940px; }
      .eyebrow {
        margin-bottom: 18px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 15px;
        color: #8b93a6;
        letter-spacing: 0.12em;
        text-transform: uppercase;
      }
      h1 {
        font-family: 'Newsreader', Georgia, serif;
        font-size: 104px;
        font-weight: 360;
        line-height: 0.95;
        letter-spacing: -0.045em;
      }
      h1 span { color: #8ec9dc; }
      .sub {
        max-width: 760px;
        margin-top: 24px;
        font-size: 23px;
        line-height: 1.45;
        color: #8b93a6;
      }
      footer { align-items: flex-end; }
      .url { color: #8ec9dc; }
    </style>
  </head>
  <body>
    <div class="card">
      <header>
        <div class="wordmark">obitoglory<span>.</span></div>
        <div class="handle">Independent developer<br />Kendal, Indonesia</div>
      </header>
      <main>
        <p class="eyebrow">Websites / bots / AI tools / security automation</p>
        <h1>Websites, bots,<br />and tools that work<span>.</span></h1>
        <p class="sub">Built from scratch, tested until they work, and handed over with the scope agreed upfront.</p>
      </main>
      <footer>
        <span class="url">obitoglory.tech</span>
        <span>github.com/dikaglorya / t.me/dikaacode</span>
      </footer>
    </div>
  </body>
</html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: path.join(publicDir, 'og-default.png'), type: 'png' });
await browser.close();

await sharp(path.join(publicDir, 'favicon.svg'))
  .resize(180, 180)
  .png()
  .toFile(path.join(publicDir, 'apple-touch-icon.png'));
