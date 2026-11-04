# Build and export

## Sub-features

`npm run build` compiles the deck to a static site in `./dist/`; `npm run export` renders a PDF.

## How to get to it (user POV)

`cd . && npm install && npm run build`; open `dist/index.html` or host `dist/` on any static host.

## Driving it with the Node helper

Run the helper first for the fast structural pass, then run the real build above - it is the extended proof for this feature and must exit 0 with a populated `dist/`.

## Gotchas

- PDF export runs as part of `npm run build` (`download: true` frontmatter) and needs the `playwright-chromium` devDependency plus its Chromium browser (`npx playwright install chromium` on a fresh machine).
- `dist/` and `node_modules/` are gitignored build output, not sources.
- The title slide carries `layout: cover` in frontmatter position; a prior revision had it after the heading, which printed config text on the slide.
