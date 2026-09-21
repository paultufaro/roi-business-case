# roi-business-case

A small web tool that builds an ROI business case from two savings levers:

1. **Reduced SG&A expenses** — 1%–3% through improved visibility, spend optimization and cost reduction.
2. **Optimizing the right resources** — 1%–3% of open cost savings.

Enter your spend figures and program costs; the tool shows annual savings, net benefit, ROI and payback period.

Live site: https://paultufaro.github.io/roi-business-case/ (redeployed automatically on every push to `main`).

## Running it locally

Requires [Node.js](https://nodejs.org) 22 or newer.

```bash
npm install     # install dependencies (once)
npm run dev     # start the app at http://localhost:5173
```

## Other commands

| Command | What it does |
| --- | --- |
| `npm test` | Runs the calculation tests |
| `npm run lint` | Checks code style |
| `npm run build` | Produces a static site in `dist/` |
| `npm run preview` | Serves the built site locally |

## How the numbers are calculated

```
SG&A savings        = SG&A spend x SG&A savings rate
Open cost savings   = open cost base x open cost savings rate
Gross annual saving = SG&A savings + open cost savings
Net annual saving   = gross annual saving - annual subscription cost
Total cost          = implementation cost + annual subscription cost x years
ROI                 = (gross annual saving x years - total cost) / total cost
Payback (months)    = implementation cost / net annual saving x 12
```

The calculation lives in `src/roi.ts` and is covered by `src/roi.test.ts`.
