# Miffy Fan Site

A fan gallery of Miffy plushies and memorabilia, with fun facts about how Miffy was created. Plain HTML, CSS and JavaScript, ready for GitHub Pages.

## What's in the folder

| File | What it does |
| --- | --- |
| `index.html` | The page layout and the About Miffy facts |
| `style.css` | Colours, fonts and layout (cream and pastel pink) |
| `script.js` | Loads `items.json` and builds the gallery, favourites, search and pop-up |
| `items.json` | Every item on the site. This is the only file you edit to add things |
| `images/` | The photos |
| `get-images.ps1` / `get-images.py` | Downloads the Wikimedia Commons photos into `images/` |

## First-time setup: get the photos

The photos are openly licensed images from Wikimedia Commons. The **Fetch images** GitHub Action (in `.github/workflows/`) downloads them into `images/` and commits them automatically whenever `items.json` changes. You can also run it by hand from the repo's **Actions** tab.

To download them on your own computer instead, run one of these from inside the `miffy-fan-website` folder:

- **Windows (PowerShell):** `powershell -ExecutionPolicy Bypass -File get-images.ps1`
- **Python (any system):** `python get-images.py`

It skips any photo you already have, so it's safe to run again. If you download locally, commit the `images/` folder along with everything else.

## Adding a new item

1. Put your photo in the `images/` folder. A square-ish photo on a plain background looks best. Use a simple name like `sailor-miffy.jpg`.
2. Open `items.json` and add a new entry inside the square brackets (put a comma after the previous entry):

```json
{
  "id": "sailor-miffy",
  "name": "Sailor Miffy plush",
  "category": "Plushies",
  "image": "sailor-miffy.jpg",
  "credit": null,
  "year": "2024",
  "origin": "Nijntje shop, Utrecht",
  "size": "20 cm",
  "note": "Bought on a trip to Utrecht.",
  "favourite": true
}
```

- `id` must be unique, with no spaces.
- `category` must be exactly `Plushies` or `Memorabilia`.
- For your own photos, set `"credit": null`. For photos from Wikimedia Commons, copy the `credit` block from an existing item and fill in the author, licence and source link, so it appears in the Credits list.
- Set `"favourite": true` to show it in the Favourites row at the top.
- No photo yet? Set `"image": ""` and add `"link": "https://..."` pointing to where the item can be seen. The site shows a "Photo coming soon" card with that link.

### Swapping a placeholder for your own photo

Two plush items ("Classic Miffy plush" and "Miffy in her orange dress") are placeholders. Add your photo to `images/`, then set their `"image"` to its filename and fill in the details.

## Previewing on your computer

Browsers block `items.json` from loading when you double-click `index.html`, so run a tiny local server from the folder instead:

```
python -m http.server 8000
```

Then open http://localhost:8000 in your browser.

## Publishing on GitHub Pages

1. Push everything (including `images/`) to the `miffy-fan-website` repo.
2. In the repo, go to **Settings → Pages**, choose **Deploy from a branch**, pick `main` and `/ (root)`, and save.
3. After a minute the site is live at `https://<your-username>.github.io/miffy-fan-website/`.

## Image licences

Photos from Wikimedia Commons stay under their own licences (CC BY, CC BY-SA, CC0 or public domain), listed in the Credits section on the site and in `items.json`. Keep those credits in place if you reuse the photos. Miffy was created by Dick Bruna; this is a non-commercial fan site.
