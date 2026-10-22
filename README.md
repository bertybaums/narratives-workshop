# Narratives workshop, AI Symposium 2026

Companion site for the workshop **Narratives that have, and will, shape both us and the machines**,
University of Idaho AI Symposium, Track 4 (AI Ethics and Future), Thursday, October 29, 2026,
11:45 am to 1:00 pm, Bruce Pitman Center. Bert Baumgaertner with Hadley Huzefka, Jason Culbertson and Chloe Luo of the NARC lab.

Live at <https://bertybaums.github.io/narratives-workshop/> (GitHub Pages, `docs/` on `main`).

## What's here

| Path | What it is |
| --- | --- |
| `docs/index.html` | Workshop page: links to everything below |
| `docs/slides.html` | Interactive slides (reveal.js 5). Press **S** for speaker notes, **F** for full screen, the down arrow on slide 29 for backups |
| `docs/data.js` | Invite code, links, and the model results shown on the slides (copied from narc.insight.uidaho.edu/inspect on October 21, 2026) |
| `docs/slides.js`, `docs/slides.css` | Grid rendering, guess pads, results tables, tallies, sort cards, timers, share-out board |
| `docs/companion.html` | Accessible reading companion (WCAG 2.1 AA by construction): same content, every grid described in words |
| `docs/handout.html` | One-page participant handout |
| `docs/files/` | Generated PDFs and the Word companion |
| `scripts/make-files.cjs` | Rebuilds the PDFs from the pages (Chromium, tagged PDF) |
| `scripts/make_qr.py` | Rebuilds the QR codes (needs `segno`) |

## Change the invite code or links

Edit `window.WORKSHOP` at the top of `docs/data.js`. Every slide that shows them updates.
The companion and handout spell them out in text, so search those two files too, then rebuild the files.

## Rebuild the files

```bash
python3 -m http.server 4180 -d docs          # in one terminal
npm i playwright-chromium                     # once
node scripts/make-files.cjs                   # PDFs into docs/files/
pandoc docs/companion.html -o docs/files/narratives-workshop-companion.docx
pdfinfo docs/files/narratives-workshop-companion.pdf | grep Tagged   # expect: yes
```

## Preview locally

```bash
python3 -m http.server 4180 -d docs
# open http://localhost:4180/slides.html
```

## License

Text, slides and companion: [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/).
Puzzles and stories belong to their makers in the NARC lab, University of Idaho.
reveal.js is MIT licensed (copyright Hakim El Hattab); see `docs/reveal/`.
