# Future Stars Baseball Club website

Static HTML/CSS/JavaScript source for the existing GitHub Pages website at https://www.futurestarsbaseballclub.org/. No build step is required. Keep the `CNAME` and existing media/report files.

## Admissions consistency revision — October 21, 2026

The original state is preserved at commit `b510e03538cc95996096e523f55f0bdc11c37e1c` and branch `backup/pre-admissions-2026-10-21`. Proposed edits are on `revision/admissions-consistency-2026-10-21`. This revision does not merge into `main` or deploy the production website.

- Home introduces the engineering project and links to the public Python/MediaPipe prototype.
- About and Founder distinguish coaching since freshman year from the club's establishment in July 2025. Vincent's role is Founder & Head Coach; the coaching description covers more than ten youth players, clinics, and mentoring.
- Method links real baseline observations to the original reports. It does not claim verified retest gains.
- AI Analysis distinguishes the public Python prototype, local app v0.3.8 being prepared for limited testing, and the existing hosted online demo. The existing demo's controls and endpoint contracts remain available inside an explicitly experimental section.
- Reports distinguish five youth profiles and Vincent's self-analysis from 18 PDF files and three dated baselines. Translations and presentation versions do not count as additional sessions.
- Team retains existing names and photos, and adds Vincent's coaching role.
- Contact and legacy email-draft code consistently use `vincent.hall2008@gmail.com`, already displayed on the original Contact page and footers. This revision does not perform mailbox delivery tests.
- Photos, player names, video assets, report PDFs, and existing parent stories are retained.
- Responsive changes address narrow-screen overflow. Missing font-file references were removed; the pre-existing system-font fallbacks remain in use.

## Files and content

The twelve HTML pages share `style.css` and `site.js`. Edit player reports and dated session records in `content.js`; `reports.js` renders search, language filters, and compatible session comparisons. Keep report filenames case-sensitive.

A session needs an actual evaluation date, stable ID, source PDF, and matching metric keys/units. Translation, upload, and formatting dates are not evaluation dates. Add a retest only when its paired dated records are available.

### Baseline source audit

Page 3 of each English four-video baseline report records ten toss swings on August 12, 2026:

| Player | Good | Medium | Poor | Points /30 | CQS /100 |
| --- | --- | --- | --- | --- | --- |
| Austin | 4 | 4 | 2 | 22 | 73.3 |
| Justin | 4 | 5 | 1 | 23 | 76.7 |
| Leo | 5 | 4 | 1 | 24 | 80.0 |

Good = 3 points, Medium = 2, Poor = 1. CQS = points / 30 * 100. These are video-based observational coaching records, not sensor measurements or the app's separate six-category rubric. The current public session archive has no verified paired retest entries; that is not a statement that no retesting occurred elsewhere in the program.

## Parent feedback

`feedback.html` uses the existing `parent-feedback.js`, `parent-feedback.css`, and public Supabase configuration in `feedback-config.js`. It displays the existing featured parent stories and community feedback. The current form publishes submitted feedback immediately under its existing consent wording; this revision preserves that behavior. Database permissions and policies are managed separately.

`feedback.js` is the legacy email-draft implementation and is not loaded by the current feedback page. Its fallback address is aligned with Contact. No feedback was submitted during revision testing.

## AI workflow

`ai.js` preserves the Render backend URL, routes, and multipart names for the existing online demo. Selected videos are transmitted to the hosted service for analysis/trimming. This is separate from the local app and the GitHub Python prototype.

The PDF endpoint generates a separate review, so the PDF may differ from the displayed text. Chat questions are independent. Backend availability, live AI output quality, CORS, and the local app's capabilities were not verified by this website revision. No sample video was uploaded.

## Validation of this revision

- Parsed all twelve HTML pages and checked local page, script, stylesheet, image, and PDF references against the checkout: no missing references.
- Checked JavaScript syntax for the changed report/legacy feedback code and the retained AI integration.
- Inspected all twelve pages in 320px, 390px, and 1440px iframe layouts in Chromium: no document-level horizontal overflow or broken loaded images after the narrow-screen fixes. Same-origin iframes test CSS layouts; they do not emulate an iPhone device or Safari.
- Exercised the 390px mobile menu, player search, Chinese report filtering, Leo baseline display, and the expandable experimental demo. No production form submissions or live AI requests were made.
- Re-read the three baseline source PDFs and verified the published category counts and CQS calculations.

To preview independently, serve this directory with a static web server. Review the branch before merging. Merging into the configured production branch may trigger GitHub Pages publication; do not merge until the owner authorizes deployment.
