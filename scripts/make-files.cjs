// Build the downloadable files from the web pages.
// Usage: serve docs/ on port 4180 (python3 -m http.server 4180 -d docs), then
//   node scripts/make-files.cjs [notes-output-dir]
// Needs playwright-chromium (npm i playwright-chromium). Chromium's tagged:true writes a PDF
// structure tree from the semantic HTML, so the companion PDF is tagged (check: pdfinfo | grep Tagged).
const path = require('path');
const { chromium } = require('playwright-chromium');

const BASE = 'http://localhost:4180/';
const FILES = path.join(__dirname, '..', 'docs', 'files');
const NOTES_DIR = process.argv[2] || FILES;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Accessible companion: tagged, with a PDF outline from the headings
  await page.goto(BASE + 'companion.html', { waitUntil: 'networkidle' });
  await page.pdf({
    path: path.join(FILES, 'narratives-workshop-companion.pdf'),
    format: 'Letter', tagged: true, outline: true, printBackground: true,
    margin: { top: '0.6in', bottom: '0.6in', left: '0.7in', right: '0.7in' },
  });

  // One-page handout
  await page.goto(BASE + 'handout.html', { waitUntil: 'networkidle' });
  await page.pdf({ path: path.join(FILES, 'narratives-workshop-handout.pdf'), format: 'Letter', tagged: true, printBackground: true, preferCSSPageSize: true });

  // Static slides: one page per click (fragments separate), like presenting
  const slides = async (query, out) => {
    await page.goto(BASE + 'slides.html?print-pdf' + query, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => window.Reveal && Reveal.isReady());
    await page.waitForTimeout(800);
    await page.pdf({ path: out, width: '1280px', height: '720px', printBackground: true, preferCSSPageSize: true });
  };
  await slides('', path.join(FILES, 'narratives-workshop-slides.pdf'));
  // Speaker notes: each slide followed by its notes on a separate page, all fragments shown
  await slides('&showNotes=separate-page&pdfSeparateFragments=false', path.join(NOTES_DIR, 'narratives-workshop-speaker-notes.pdf'));

  await browser.close();
  console.log('wrote companion, handout, slides and speaker-notes PDFs');
})();
