# Badge artwork

This directory contains the generated NovaMath Lab badge art.

- `sheets/` contains four transparent 5×5 master atlases.
- `icons/` contains 100 app-ready 256×256 transparent PNG files.
- `manifest.json` maps each badge ID and name to its icon and source sheet.

The sheet order matches the badge IDs in `docs/BADGES.md`: left-to-right, then top-to-bottom.

| Sheet | Badge IDs | Tier style |
| --- | --- | --- |
| `starter-e01-e25.png` | E01–E25 | Copper-orange with teal gems |
| `intermediate-m01-m25.png` | M01–M25 | Silver with cobalt and teal gems |
| `intermediate-m26-m50.png` | M26–M50 | Silver with cobalt, teal, and violet gems |
| `advanced-h01-h25.png` | H01–H25 | Dark platinum, gold, amethyst, and cyan |

Run `python scripts/split_badge_sheets.py` after replacing a master sheet. The script regenerates the individual icons and manifest deterministically.

The artwork is original AI-generated raster art. It uses generic sports cars and colorful interlocking construction bricks without third-party logos or trademarks.
