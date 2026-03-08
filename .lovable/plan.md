

## Fixa base path för GitHub Pages

Sidan ligger under `/endpoint.rocks-github-pages-version/` och behöver tre ändringar:

### 1. `vite.config.ts` – Lägg till base path
Lägg till `base: process.env.VITE_BASE_PATH || "/"` så att alla asset-sökvägar (JS, CSS, bilder) får rätt prefix vid bygge.

### 2. `public/404.html` – Ändra `pathSegmentsToKeep` till `1`
Eftersom repot har en subpath måste SPA-redirecten behålla det första path-segmentet (`endpoint.rocks-github-pages-version`).

### 3. `.github/workflows/deploy.yml` – Lägg till `VITE_BASE_PATH`
Lägg till miljövariabeln `VITE_BASE_PATH: /endpoint.rocks-github-pages-version/` i build-steget.

### 4. `src/App.tsx` – Lägg till `basename` på BrowserRouter
Ändra till `<BrowserRouter basename={import.meta.env.VITE_BASE_PATH || "/"}>` så att React Router matchar rätt URL:er.

### Resultat
Efter dessa ändringar fungerar sidan korrekt på `https://hillihappo.github.io/endpoint.rocks-github-pages-version/` inklusive alla undervägar som `/blog`, `/admin` etc. Lovable-preview påverkas inte (den använder `/` som default).

