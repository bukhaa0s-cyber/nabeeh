# نبيه | Nabeeh

Daily practice for the Mawhiba Multiple Cognitive Aptitude Test (MMCAT), all three levels, in Arabic and English.
An independent product: not affiliated with Mawhiba or the Education and Training Evaluation Commission. All questions are original.

- `index.html`: sales page with a live sample question
- `app.html`: the app (PWA, works offline)
- `admin.html`: create activation codes (Firebase admin only)
- `js/gen-*.js`, `js/verbal-*.js`, `js/bank-more.js`: question generators and banks (78 question types, tens of thousands of distinct questions per language)
- `js/blueprint.js`: levels by grade and the official exam structure
- `firestore.rules`: security rules for accounts, progress and one-time activation codes

Setup and selling steps (Arabic): see `SETUP.md`.
Checks: `node tests/check-generators.js 40`.
