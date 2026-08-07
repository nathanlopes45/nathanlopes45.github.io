# Nathan Lopes | Portfolio

My portfolio site, live at [nathanlopes45.github.io](https://nathanlopes45.github.io).
One scrolling page — hero, about, experience, education, projects, contact — styled after a
security-operations dashboard. Plain HTML/CSS/JS, no build step, no dependencies beyond two
Google Fonts.

Run it locally:

```bash
python3 -m http.server 8000
```

Push to `main` and Pages redeploys.

## Files

```
index.html   the whole site
styles.css   design tokens + layout (see :root for the colour/type system)
script.js    nav toggle, projects accordion, flip-card open/close, contact form
assets/      project screenshots + résumé PDF
```

## Two things that will bite

**The skills band** (the flowing text behind everything, top of `<body>`). The skill list is
duplicated twice inside a single `<textPath>` so the scroll loops seamlessly. Edit one half and
the loop visibly jumps at the seam — change both, identically.

**Card heights.** Both faces of a flip card are `position:absolute` for the 3D flip, so the card
can't grow with its content; the height is fixed and steps across breakpoints. Adding copy to a
card front can push the "click to expand" footer out of the card, and it shows up at narrow
widths first, so check below 1050px and on a phone. The measured steps are the media queries
under `.flip-card` in `styles.css`.

## Project cards

Each is a `.flip-card` in `#cardsGrid` with a front and a back face. The `PROJECT_LOG_0N` id and
the severity chip appear in *both* faces, so they change in two places. Screenshots are cropped to
110px tall with `object-fit: cover`, so source dimensions don't matter; a missing file falls back
to a dashed placeholder box via `script.js`.

Repos linked from the cards: [activitygraph](https://github.com/nathanlopes45/activitygraph) ·
[siem](https://github.com/nathanlopes45/siem) ·
[Edenthought](https://github.com/nathanlopes45/Edenthought) ·
[uommcsp](https://github.com/cleresk/uommcsp) (TrueMatch, group repo under a teammate's account) ·
[employee-management-flask-aws](https://github.com/nathanlopes45/employee-management-flask-aws).
The Stock Price Prediction card has no public repo yet — its back panel has a placeholder link
ready for one.

## Contact form

Posts to [FormSubmit](https://formsubmit.co), which forwards submissions to
45.nathan.lopes@gmail.com with no backend. To switch services, change the `action` on
`<form id="contactForm">` in `index.html` and the `fetch` call in `script.js`.
