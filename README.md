# SmartCareer · P19 proposal website

The website presents UNNC GRP Team202610, the planned SmartCareer architecture, the delivery schedule, and the experience supporting the team's bid. All system features are proposals, not claims of an implemented recommendation product.

## Content source

The P19 English and Chinese bid snapshots and project plan in `reference-materials/results/` were refreshed from `C:\Users\asus\Desktop\6acf87b98bad522cdc6294e4` on 16 October 2026. The authoritative English and Chinese P19 files were last modified on 16 October 2026 at 03:01:32; the date printed in the bid remains 15 October 2026.

`scripts/extract_bid.py` generates `src/bid-content.json`: seven member profiles, their planned responsibilities, nine schedule windows, and all five English bid chapters. It reads the team, title and date from the source macros, and records the English source SHA-256. Member-card summaries and evidence highlights are curated in the extractor and must be checked when source profiles change.

Refresh the three P19 snapshots and regenerate the site content:

```powershell
python scripts/extract_bid.py --source-root C:/Users/asus/Desktop/6acf87b98bad522cdc6294e4
```

Regenerate from the preserved snapshots with `npm run content`. The source bid repository is read only during this operation.

## Development and validation

```powershell
npm run dev
npm run build
npm run preview
```

`npm run build` checks both TypeScript and the Vue timeline before writing `dist/`. Vite serves on loopback. This workspace has no configured remote deployment target.
