"""Downloads every photo listed in items.json from Wikimedia Commons into the images folder.

Run from the miffy-fan-website folder:  python get-images.py
Works on Windows, macOS and Linux with no extra packages.
"""
import json
import time
import urllib.request
from pathlib import Path

root = Path(__file__).parent
images = root / "images"
images.mkdir(exist_ok=True)

items = json.loads((root / "items.json").read_text(encoding="utf-8"))
headers = {"User-Agent": "miffy-fan-website image fetcher (personal fan site)"}

for item in items:
    credit = item.get("credit") or {}
    url = credit.get("download")
    name = item.get("image")
    if not (url and name):
        continue
    target = images / name
    if target.exists():
        print(f"Already have {name}")
        continue
    print(f"Downloading {name}...")
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=60) as resp:
            target.write_bytes(resp.read())
    except Exception as exc:
        print(f"  Could not download {name}: {exc}")
    time.sleep(0.5)

print("Done.")
