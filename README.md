# Future Stars website redesign

A static, photo-led redesign for Vincent Hall’s student leadership and community baseball project. Built for the existing GitHub Pages site; no build tools or new hosting subscription required.

## Install on your existing site

1. Back up the current repository or create a branch.
2. Unzip this package. Copy its CONTENTS into the root of `xinghanwen2/future-stars-website`. Do not put the enclosing folder inside the repository.
3. Replace the matching HTML files and `style.css`. Add every included JavaScript file and merge the `assets` directory with the existing one.
4. Preserve your existing `CNAME`, `.github`, and any other unrelated files. This package does not replace domain settings or the Render backend.
5. Commit the changes. Once the GitHub Pages deployment succeeds, open your domain and refresh.

The page filenames have no `(1)` or `(24)` suffixes. Existing URLs remain intact. New pages: `gallery.html` and `feedback.html`.

## What is included

- Twelve pages, mobile navigation, photo lightbox, local fonts, and supplied field/training photographs.
- Six players and 18 original PDFs downloaded successfully from the current public website.
- Search by player, filter reports by English/Chinese, and open each original PDF.
- Per-player evaluation comparison: choose two sessions and see matching measurements and numeric changes.
- Real baseline data for Austin, Justin, and Leo from August 12, 2026.
- Parent comments display plus an email-draft form with optional anonymous-publication consent.
- Existing AI endpoint integrations: chat, on-screen report, separate PDF generation, and video trimming.

## Player reports and progress data

Edit `content.js`. It works even when you open `index.html` directly, without a local server.

Each player contains `id`, `name`, `reports`, and `sessions`. Report links point to `assets/reports/` and must match case-sensitive filenames. For a new report, upload the PDF and add a report object using the same fields as an existing entry. Dates must describe the actual evaluation, not the upload date or PDF formatting date.

Baseline sources, all page 3 of the English four-video baseline PDF:

| Player | Session | Contact points | CQS | Good | Medium | Poor |
| --- | --- | --- | --- | --- | --- | --- |
| Austin | 2026-08-12 | 22/30 | 73.3/100 | 4/10 | 4/10 | 2/10 |
| Justin | 2026-08-12 | 23/30 | 76.7/100 | 4/10 | 5/10 | 1/10 |
| Leo | 2026-08-12 | 24/30 | 80.0/100 | 5/10 | 4/10 | 1/10 |

These are video-based coaching observations of ten toss swings, not sensor readings. No verified second dated evaluations were found in the reviewed reports. Other files are analysis, translations, or presentation versions, so the site does not treat them as retests.

To add a follow-up, copy the player's existing session object and change its unique `id`, actual `date` (YYYY-MM-DD), `label`, `source` PDF path, and verified metric values. Keep metric keys and units consistent across sessions. The comparison UI activates automatically when that player has two dated sessions. It compares any two selected sessions, so it supports more than two evaluations over time. A positive numeric change is deliberately not labeled “improvement” because some measurements, such as poor contact, should decrease.

Players without dated results show an empty state. No demo results or fabricated progress are included.

## Parent feedback

`feedback.html` prepares an email addressed to `futurestarsbaseballclub@gmail.com`. Parents must send it from their email app. There is a copy-text fallback. It does not automatically submit, save, or publish feedback and does not require a new backend.

After reviewing a real comment and receiving publication permission, add it to the `feedback` array in `content.js`:

- `quote`: the exact approved comment (or approved edited wording).
- `attribution`: the approved display name, such as “A Future Stars parent”.
- `approved`: `true` to show it; `false` to hide it.

Only entries with `approved: true` display. Do not put private submissions in this public file. The array is empty because no actual comments were provided. Optional publication consent is recorded in the email draft; unchecked means private feedback only.

## Photos and fonts

Existing photo paths are preserved. New supplied images use `community-1.jpg` through `community-7.jpg`, `vincent-coaching.png`, and `vincent-field.png`. The gallery uses descriptive captions and does not guess player identities. CSS crops images for the layout; original supplied files are retained. Only publish photos and reports with the appropriate permission.

Barlow Condensed, DM Sans, and a Noto Sans SC subset for Chinese labels are served from local font files; no Google Fonts request is needed when browsing the site. License notices are in `assets/fonts`.

## AI limitations and compatibility

The Render URLs and multipart field names are preserved. Chat still sends each question independently because no compatible history contract was supplied. The page states this explicitly. The PDF endpoint generates a separate review, so the PDF may differ from the displayed text. Buttons prevent duplicate analysis/PDF requests; errors use plain language. User chat text is rendered as text, not HTML.

The static redesign cannot fix backend memory limits, model behavior, CORS settings, server billing, or API uptime. Live analysis calls are not needed to preview the design. The existing production origin remains the intended place to use the Render integrations.

## Preview locally

Open `index.html`, or run `python -m http.server 8000` inside this folder and visit `http://localhost:8000`. Registration still opens the existing Google Form. Email links open your configured mail app.

## Verification performed

All twelve pages were checked in Chromium at 1440px, 390px, and 320px widths, with no horizontal overflow or broken loaded images. Local page/asset references were checked. All eighteen report files were downloaded from the existing site and identified as PDFs. Search, English/Chinese filters, photo viewing, mobile navigation, baseline display, comparison calculations, and email-draft preparation were exercised. Comparison calculations were tested with temporary in-memory data that is not included in this package.

AI chat/report/PDF interactions were verified using mocked API responses. No live video analysis was submitted, and live Render availability or output quality is not verified by these checks.
