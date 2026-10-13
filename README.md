# FitMuse — Student Startup Prototype

FitMuse is a responsive frontend prototype for a wardrobe-first styling app. The design uses familiar digital-wardrobe patterns—clothing categories, outfit planning, saved looks and style inspiration—while keeping shopping secondary to clothes the user already owns.

## Run locally

Open `index.html` in a modern browser. No build tools are required.

## Features

- App-like wardrobe dashboard with category filters
- Clothing-only product and flat-lay imagery stored in `assets/`
- Occasion, weather, comfort and style-mood controls
- Rule-based outfit combinations from the starter wardrobe
- Add your own clothing images and remove wardrobe items
- Save and remove favourite looks with local browser storage
- Wardrobe-first gap suggestions; no fake live listings or prices
- Separate, consistently indented HTML, CSS and JavaScript

## Image assets

The `.github/workflows/vendor-images.yml` workflow downloads clothes-only JPG photographs into the repository. Website markup refers to local `assets/*.jpg` files, not remote image URLs.

The downloaded images are for clothing inspiration and object photography. No people/model photos are intentionally used.

## Prototype limitations

- Recommendations use lightweight demo rules; no live AI model or image recognition is connected.
- Uploaded clothing images require a manual category and stay in the current browser session.
- Saved looks use local browser storage when available.
- Shopping gap suggestions are categories, not live product listings.
- Google Fonts are loaded remotely; clothing photography is local.

## GitHub Pages

Deploy from the `main` branch, root folder, with `index.html` at the repository root.

## QA status

JavaScript syntax, duplicate HTML IDs and local image references are checked. Browser-based visual QA across device sizes, Lighthouse and a formal accessibility audit still need to be done.
