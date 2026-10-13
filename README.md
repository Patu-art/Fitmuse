# FitMuse — Student Startup Prototype

FitMuse is a responsive frontend prototype for a wardrobe-first personal styling concept, with outfit ideas for college, everyday wear and Indian festive occasions.

## Run locally

Open `index.html` in a modern browser. No build tools or installation are required.

## Features

- Editorial fashion landing page and responsive mobile navigation
- Occasion, weather, comfort and style-mood inputs
- Rule-based outfit suggestions using wardrobe categories
- Add clothing photos locally and remove wardrobe items
- Save and remove favourite looks using this browser's local storage
- Wardrobe-first suggestions that avoid pretending to show live product listings
- Consistent indentation across HTML, CSS and JavaScript

## Local images

The site uses downloaded image files in `assets/`, not image-host URLs in the website markup. The `.github/workflows/vendor-images.yml` workflow downloads the chosen Unsplash images as JPG files and commits them to the repository when the page code or workflow changes.

Image source pages/CDN IDs:
- `photo-1617137968427-85924c800a22` — hero image
- `photo-1488161628813-04466f872be2` — smart-casual inspiration
- `photo-1515886657613-9f3515b0c78f` — street-style inspiration
- `photo-1583391733956-3750e0ff4e8b` — festive-style inspiration

After the first workflow run completes, these JPGs are checked into the repo and served locally by GitHub Pages. Google Fonts are still loaded from Google Fonts; no website images are hotlinked.

## Prototype limits

- Outfit suggestions use simple demo rules, not a live AI model.
- Uploaded clothing images are assigned a category by the user; there is no automatic image recognition.
- Uploaded previews exist in the current browser session and clear after refresh.
- The inspiration gallery is illustrative, not a product catalogue.
- No live weather, shopping inventory, verified prices, checkout or affiliate integration is connected.

## GitHub Pages

Keep `index.html`, `style.css` and `script.js` in the repository root. Pages should deploy from the `main` branch, root folder.

## QA status

JavaScript syntax and duplicate HTML IDs have been checked. Live cross-device testing, browser-console testing, Lighthouse and formal accessibility audits have not yet been completed.
