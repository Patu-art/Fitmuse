# FitMuse — Student Startup Prototype

FitMuse is a frontend prototype for a wardrobe-first personal styling concept. It is designed around everyday outfits, college looks and Indian festive occasions.

## Run locally

Open `index.html` in a modern browser. No build tools or installation are required.

## What works in this prototype

- Responsive landing page with fashion editorial imagery
- Occasion, weather, comfort and style mood controls
- Rule-based outfit suggestions based on wardrobe categories
- Add clothing photos and remove wardrobe items
- Save and remove favourite looks using this browser's local storage
- Optional missing-category suggestions instead of fake product listings
- Separate HTML, CSS and JavaScript files with consistent indentation

## Limitations

- Outfit suggestions use simple demo rules, not an AI model.
- Uploaded images are assigned a category manually; there is no image recognition.
- Uploaded previews are held in the browser session and clear on refresh.
- Inspiration images are external editorial references. An internet connection is needed to load them.
- Shopping suggestions are categories only. No live products, verified prices, inventory, checkout or affiliate links are connected.
- This is a prototype, not a production-ready service.

## GitHub Pages

Keep `index.html`, `style.css` and `script.js` in the repository root. Enable Pages in Settings → Pages and deploy from the `main` branch, root folder.

## QA status

The code has been updated, but cross-device visual QA, browser-console testing, Lighthouse and accessibility audits have not yet been completed. Do not treat this README as a claim that those tests have passed.
