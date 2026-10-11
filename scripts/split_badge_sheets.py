"""Split the four generated 5x5 NovaMath badge atlases into app-ready icons."""

from __future__ import annotations

import json
import re
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SHEETS = ROOT / "assets" / "badges" / "sheets"
ICONS = ROOT / "assets" / "badges" / "icons"
CATALOG = ROOT / "docs" / "BADGES.md"

SOURCES = (
    ("starter-e01-e25.png", "E", 1),
    ("intermediate-m01-m25.png", "M", 1),
    ("intermediate-m26-m50.png", "M", 26),
    ("advanced-h01-h25.png", "H", 1),
)


def catalog_names() -> dict[str, str]:
    pattern = re.compile(r"^\| ([EMH]\d{2}) \| ([^|]+) \|")
    names: dict[str, str] = {}
    for line in CATALOG.read_text(encoding="utf-8").splitlines():
        match = pattern.match(line)
        if match:
            names[match.group(1)] = match.group(2).strip()
    return names


def main() -> None:
    ICONS.mkdir(parents=True, exist_ok=True)
    names = catalog_names()
    manifest: list[dict[str, str]] = []

    for filename, prefix, start in SOURCES:
        with Image.open(SHEETS / filename).convert("RGBA") as sheet:
            width, height = sheet.size
            for index in range(25):
                row, column = divmod(index, 5)
                left = round(column * width / 5)
                top = round(row * height / 5)
                right = round((column + 1) * width / 5)
                bottom = round((row + 1) * height / 5)
                badge_id = f"{prefix}{start + index:02d}"
                icon = sheet.crop((left, top, right, bottom))
                icon = icon.resize((256, 256), Image.Resampling.LANCZOS)
                icon.save(ICONS / f"{badge_id.lower()}.png", optimize=True)
                manifest.append(
                    {
                        "id": badge_id,
                        "name": names[badge_id],
                        "tier": {
                            "E": "starter",
                            "M": "intermediate",
                            "H": "advanced",
                        }[prefix],
                        "asset": f"assets/badges/icons/{badge_id.lower()}.png",
                        "sourceSheet": f"assets/badges/sheets/{filename}",
                    }
                )

    if len(manifest) != 100 or len({item["id"] for item in manifest}) != 100:
        raise RuntimeError("Expected exactly 100 unique badge assets")

    (ROOT / "assets" / "badges" / "manifest.json").write_text(
        json.dumps(manifest, indent=2) + "\n", encoding="utf-8"
    )
    print(f"Created {len(manifest)} badge icons and manifest.json")


if __name__ == "__main__":
    main()
