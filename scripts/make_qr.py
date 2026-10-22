"""Make the QR codes used on the slides and the handout.

Usage (needs the `segno` package):  python scripts/make_qr.py [deck_url]
Rerun with the real GitHub Pages URL if the repo name changes.
"""
import sys
import segno

deck = sys.argv[1] if len(sys.argv) > 1 else "https://bertybaums.github.io/narratives-workshop/"
targets = {
    "docs/img/qr-deck.svg": deck,
    "docs/img/qr-narc.svg": "https://narc.insight.uidaho.edu",
    "docs/img/qr-narrate.svg": "https://narc.insight.uidaho.edu/narrate",
}
for path, url in targets.items():
    segno.make(url, error="m").save(path, scale=8, border=2, dark="#191919", light="#ffffff")
    print(path, "->", url)
