# FitMuse — Student Startup Prototype

FitMuse is a responsive frontend prototype for an AI personal styling concept. It helps people explore outfit combinations using clothes they already own.

## Run locally
Open `index.html` in a modern browser. No build tools or installation are required.

## Included
- Responsive landing page
- Occasion, weather, comfort and style mood selectors
- Rule-based outfit recommendations that use wardrobe categories
- Occasion, weather, comfort, style mood, and notes influence suggestions
- Save and remove favourite looks using this browser's local storage
- Starter wardrobe with add/remove photo previews
- Sample shopping suggestions (not real listings or affiliate links)
- Separate HTML, CSS and JavaScript

## Prototype limitations
- Outfit suggestions use demo rules, not a real AI model.
- Weather is selected manually; no live weather integration.
- Uploaded images are previewed locally and are not sent to a server. Refreshing clears uploaded items; saved favourites persist in this browser when storage is available.
- Shopping suggestions identify missing clothing categories instead of pretending to show live products. There are no live shopping, verified prices, or affiliate integrations.
- This is a prototype, not a production-ready service.

## Accessibility and QA notes
- Includes a skip link, visible keyboard focus, a mobile navigation toggle, and reduced-motion support.
- Outfit suggestions use lightweight rules, not a real AI model or image recognition. Uploaded items are assigned a category by the user.
- Test on a real phone and at 320, 360, 390, 768, 1024, and 1440 px before calling this production-ready. No Lighthouse or formal accessibility audit is claimed.

## GitHub Pages
Keep `index.html`, `style.css`, and `script.js` in the repository root. Enable Pages in Settings → Pages and deploy from the `main` branch, root folder.
