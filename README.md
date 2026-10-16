# SmartCareer · P19 proposal website

The website presents UNNC GRP Team202610, the planned SmartCareer architecture, the delivery schedule, and the experience supporting the team's bid. All system features are proposals, not claims of an implemented recommendation product.

The final **Prototype** section is an interactive React concept with a fixed fictional student profile and three fictional graduate opportunities. Four relative-priority sliders normalise into weights and immediately rerank the examples; all-zero priorities use equal weights. Selecting a role reveals its dimension scores, matched skills and gaps. The growth-feedback suggestion changes weights only after **Apply**, and **Reset priorities** restores equal weights. State lasts only until the page is reloaded. No recruitment service, real dataset or backend is connected; growth and stability scores are illustrative proxy indicators.

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

`npm run build` checks both TypeScript and the Vue timeline before writing `dist/`. Vite serves on loopback.

## Vercel deployment

Import `qianqqqqqXZQ/Team10_p19` into Vercel with production branch `main`, framework preset **Vite**, and the repository root (`./`) as the root directory, following the P21 website deployment setup. `vercel.json` sets the build command to `npm run build` and the output directory to `dist`. Keep the install command at its default; no environment variables are required. Once the GitHub integration is connected, pushes to `main` trigger production deployments.

Deploy only the generated `dist/` contents. The `reference-materials/` archive and extraction script are used locally to maintain the checked-in `src/bid-content.json`; the production build does not require them. `.vercelignore` excludes these files, dependencies, and local QA artifacts from CLI source uploads. `.vercel/` stores local deployment metadata and is excluded from Git. Use `npm run build` for production builds; `npm run dev` starts a persistent development server.
