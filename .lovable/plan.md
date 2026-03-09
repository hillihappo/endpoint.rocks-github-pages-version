

## Plan: Lägg till Google Analytics (GA4)

Measurement ID: `G-ETF88872KS`

### Ändringar

**1. `index.html`** — Lägg till gtag.js-scriptet i `<head>` (före SPA-redirect-skriptet):

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-ETF88872KS"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-ETF88872KS');
</script>
```

**2. `src/App.tsx`** — Lägg till en `RouteChangeTracker`-komponent inuti `<BrowserRouter>` som lyssnar på route-ändringar via `useLocation` och skickar `page_view`-events till GA4. Detta krävs eftersom appen är en SPA och sidvisningar annars inte registreras vid navigering.

Inga nya beroenden behövs.

