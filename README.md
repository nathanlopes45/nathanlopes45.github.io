# Nathan Lopes | Portfolio

A single-page portfolio site built from my résumé and GitHub repos, styled after a
security-operations dashboard (status panels, alert-severity tags, incident-log project
cards) to match my cybersecurity + software dev background. Plain HTML/CSS/JS, no build
step, no dependencies beyond two Google Fonts.

## Structure

Everything lives on `index.html`, one scrolling page: hero, about, experience, education,
projects, and contact (including the message form). The nav links are anchors that
scroll to each section.

The Projects section is collapsed by default so the page stays short for anyone just
scrolling through. Clicking the arrow next to "Projects" expands it in place to reveal
the six project cards. Click a card and it pops forward to the centre of the screen and
enlarges, then flips open for the full write-up. Click again, hit the close button, press
Escape, or click the backdrop to close it.

## One-time setup: activate the contact form

The contact form on the homepage posts to [FormSubmit](https://formsubmit.co), a free service that forwards form
submissions to your inbox with no backend of your own required. It needs a one-time activation:

1. Deploy the site (or just open `index.html` locally) and submit the form once with any test message.
2. FormSubmit will email **45.nathan.lopes@gmail.com** asking you to confirm the form. Click the confirmation
   link in that email.
3. From then on, every message submitted through the form arrives as an email. No further setup needed.

If you'd rather use a different service (Formspree, EmailJS, etc.), just swap the `action` URL on the
`<form id="contactForm">` in `index.html` and adjust the `fetch` call in `script.js` accordingly.

## Before you publish, fill this in

Contact links are all real now — email, phone, LinkedIn
(`linkedin.com/in/nathanlopes-tech`) and GitHub.

GitHub links are already wired up from your real repos:
- ActivityGraph → `github.com/nathanlopes45/activitygraph`
- SIEM → `github.com/nathanlopes45/siem`
- Edenthought → `github.com/nathanlopes45/Edenthought`
- TrueMatch → `github.com/cleresk/uommcsp` (group project, hosted under a teammate's account)
- Stock LSTM notebook → no public repo yet; the "add repository link" placeholder on that card's back panel is ready for when you push it.

Each project card already has an `<img class="card-img">` tag pointing at a placeholder
path in `assets/`. Drop your screenshots into `assets/` using these exact filenames (or
update the `src` in `index.html` to whatever you name them):

- `assets/activitygraph-time-and-activity-graph.png`
- `assets/siem-screenshot.png`
- `assets/truematch-screenshot.png`
- `assets/edenthought-screenshot.png`
- `assets/lstm-prediction-plot.png`
- `assets/employee-management-screenshot.png`

Every image is displayed at the same fixed size (`110px` tall, full card width, cropped
with `object-fit: cover`), so cards line up evenly regardless of each screenshot's own
dimensions. Until a file exists at a given path, that card falls back automatically to
the dashed placeholder box (handled in `script.js`), so the site looks fine either way.

## Run it locally

No build tools needed, just open `index.html` in a browser, or serve it:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy on GitHub Pages

1. Create a new repo, e.g. `nathan-lopes/portfolio` (or `nathan-lopes.github.io` for a
   root domain site).
2. Push these files to the repo:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio site"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
3. In the repo: **Settings → Pages → Source → Deploy from a branch → `main` / `/root`**.
4. Your site will be live at `https://<your-username>.github.io/<repo-name>/`
   (or `https://<your-username>.github.io/` if you named the repo `<username>.github.io`).
5. Add that URL to your LinkedIn profile's "Contact info → Website" field, and to the
   repo's "About" section on GitHub.

## Files

```
index.html      → the whole site: hero, about, experience, education, projects, contact + form
styles.css      → design tokens + layout (see :root for the color/type system)
script.js       → nav toggle, projects accordion, flip-card open/close logic, contact form submit
assets/         → your résumé PDF, served via the "download résumé" button
```

The scrolling skills band (the flowing text behind everything) is a `position:fixed` SVG layer defined
once near the top of `<body>`. If you split the site back into multiple pages later, copy that same
`<div class="skills-band-bg">…</div>` block into each page so it stays consistent.

## Ideas for extending it (good practice reps)

- Add the six project screenshots to `assets/` (see filenames above).
- Add a small `/blog` or `/writeups` page for security write-ups (CTFs, SIEM detection
  notes). It's a natural fit for the site's visual language, and a good spot for a
  fourth nav link.
- Push the LSTM notebook to a public repo and swap in its link on the Projects card.
- Fetch pinned repos from the GitHub API instead of hardcoding project data.
- Add Open Graph meta tags so the link preview looks good when shared on LinkedIn.