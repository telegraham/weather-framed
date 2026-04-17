# AGENTS.md

This repository is a small weather display optimized for real-world use on a Kindle browser. Future agents should favor reliability, compatibility, and calm collaboration over cleverness.

## Product Context

- The app is used as a weather dashboard, including on an older Kindle browser.
- Kindle compatibility is a hard constraint, not a nice-to-have.
- Query-string config support matters because local storage on the Kindle may be unreliable.
- The deployed site is `https://www.fuckyeahgtj.com/weather-framed/`.

## Collaboration Style

- Be warm, direct, and practical.
- Prefer pairing energy over lecturing.
- Explain tradeoffs simply.
- Do not default to “10x engineer” refactors or frameworky abstractions.
- When a small local fix will do, prefer it over architectural churn.

## Technical Priorities

- Prefer old, boring, broadly compatible browser APIs.
- Prefer explicit code over clever code.
- Preserve the site’s hand-rolled style; do not introduce frameworks.
- Keep the HTML/CSS/JS understandable by a human scanning files quickly.

## Kindle Browser Compatibility Rules

Assume the Kindle browser may choke on newer web APIs or modern CSS layout.

Useful external reference:
- Thor Galle’s Kindle browser notes: https://thorgalle.me/notes/documentation-for-the-kindle-browser
- Treat that note as a practical compatibility reference for older Kindle Paperwhite browsers.

### JavaScript

- Prefer ES5-style syntax and patterns.
- Avoid introducing modern browser APIs unless clearly necessary.
- Do not use `URLSearchParams`; use manual query parsing.
- Do not use ES2015+ syntax without a very good reason. In practice, avoid:
  - `const` / `let`
  - arrow functions
  - template strings
  - `class`
  - destructuring
  - `for...of`
  - default parameters
- Do not use `fetch`; use `XMLHttpRequest`.
- Be cautious with date/time APIs that depend on browser locale/timezone behavior.
- For displayed times, prefer applying the API-provided UTC offset rather than trusting the device timezone.
- Avoid relying on literal emoji characters inside JavaScript source; use Unicode escapes if needed.

### CSS

- Prefer floats or simple block layout over flexbox/grid for core layout.
- Prefer clearfix/overflow-hidden era layout techniques over modern layout systems.
- Do not assume `box-sizing: border-box`.
- Keep layout math conservative so older browsers do not wrap columns unexpectedly.
- Avoid unnecessary modern CSS features if a simpler alternative exists.
- Do not rely on `position: fixed` or `position: sticky`.
- Assume the browser may ignore `<meta name="viewport">`.
- Be cautious with emoji/font rendering differences across browsers.
- The current `Noto Emoji` setup is loaded from Google Fonts and is not pinned to a specific version.
- If emoji rendering needs to be predictable, prefer self-hosting a specific font file instead of relying on the Google-hosted version.

### DOM / Interaction

- Assume touch/drag/pointer events are poor or missing.
- Prefer simple click-based interaction only.
- Do not assume standard scrollbar behavior or a truly non-scrollable page.
- Be aware that text inside normal `<a href>` links may be forcibly underlined on Kindle.

## Data / Rendering Conventions

- Top summary section is called `conditions`.
- The two columns inside it are `now` and `today`.
- The bar-chart section is called `forecast`.
- `ConditionsRenderer` owns the top summary/conditions area.
- `ForecastRenderer` owns the bar-chart forecast area.
- `WeatherDataStore` is the shared store for current conditions, hourly forecast, and daily forecast.

## Current Known Decisions

- `config.html` and `reset.html` are separate pages; do not reintroduce SPA-style overlay routing unless explicitly requested.
- `config.js` owns config-page parsing, validation, and save behavior.
- `reset.js` owns reset-page behavior.
- On the main page, if no saved config exists, showing test data is acceptable.
- For tied temperature highs/lows in the graph:
  - only the first tied extreme gets the numeric label
  - other tied extremes get a bullet marker

## Change Strategy

- Make the smallest change that solves the actual problem.
- When debugging browser-specific issues, prefer tiny isolating changes over broad rewrites.
- If behavior differs on Kindle versus desktop, suspect compatibility or browser behavior before assuming the entire design is wrong.
- Keep naming improvements aligned with the UI and product language.

## Things To Avoid

- Don’t introduce React, build steps, TypeScript, or large dependencies.
- Don’t replace simple procedural code with class hierarchies or abstraction layers unless there is a clear payoff.
- Don’t silently swap user-facing behavior because it seems “cleaner”.
- Don’t optimize for theoretical elegance over “does this work on the Kindle”.
