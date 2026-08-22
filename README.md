# Legendary Women

**The League of Legendary Women** is a mobile-first catalog celebrating women whose courage, ideas, creativity, leadership, and discoveries changed the world. It presents approachable profiles spanning science, politics, civil rights, healthcare, literature, sports, exploration, business, and the arts.

## What the app does

- Highlights a deterministic **Legend of the Day** that changes each calendar day
- Provides a searchable, category-filtered catalog of 55 women
- Presents biographies, life dates, accomplishments, sourced quotations, and image attribution
- Lets visitors save favorites privately in their browser
- Generates a dedicated static page for every profile
- Supports installation as a Progressive Web App on Windows, Android, and iPhone
- Works without registration, user accounts, a database, or server-side application code

Catalog content is maintained as structured JSON in the repository, so new profiles and corrections can be reviewed and published through the normal GitHub workflow.

## Technology

The application uses Astro and TypeScript to generate a fast, responsive static website. Portraits and application assets are stored locally, favorites use browser local storage, and a service worker plus web app manifest provide installable PWA behavior.

## Local development

```powershell
npm install
npm run dev
```

Open `http://localhost:4321`.

## Check and build

```powershell
npm test
npm run check
npm run build
```

## Updating the catalog

Catalog records live in `src\data\women.json`; portraits live in `public\images\women`. Each record includes biographical information, categories, accomplishments, quotations, source links, and portrait attribution.

After adding or replacing a portrait, generate its responsive AVIF and WebP variants:

```powershell
npm run optimize:images
```

Then run the check and build commands above to validate the data and generated profile pages.

## Hosting

The application builds to static files in `dist\` and is prepared for deployment to Azure Static Web Apps.

## Analytics

Production builds can send anonymous browser telemetry to Azure Application Insights when `PUBLIC_APPLICATIONINSIGHTS_CONNECTION_STRING` is set. Local development does not initialize analytics.

The deployment workflow reads the public connection string from the GitHub repository variable `APPLICATIONINSIGHTS_CONNECTION_STRING`. Useful Log Analytics queries include:

```kusto
pageViews
| summarize PageViews=count(), ApproximateUsers=dcount(user_Id) by name
| order by PageViews desc
```

```kusto
customEvents
| where name in ("favorite_added", "favorite_removed")
| summarize Events=count() by name, Woman=tostring(customDimensions.woman_slug)
| order by Events desc
```
