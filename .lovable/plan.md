

## Problem

`VITE_BASE_PATH` i `.github/workflows/deploy.yml` är hårdkodad till `/endpoint.rocks-github-pages-version/`. Med custom domain `endpoint.rocks` ska sidan serveras från root (`/`), inte en subpath. Detta gör att alla routes, JS-bundles och assets returnerar 404.

## Fix

**Fil:** `.github/workflows/deploy.yml` (rad 36)

Ändra:
```yaml
VITE_BASE_PATH: /endpoint.rocks-github-pages-version/
```
Till:
```yaml
VITE_BASE_PATH: /
```

Det är den enda ändringen som behövs. Efter push triggas ett nytt deploy och sidan bör fungera direkt.

