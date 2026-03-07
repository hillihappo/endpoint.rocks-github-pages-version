

## Sökfältet soker efter blogginlagg

Idag filtrerar sokfaltet bara verktyg. Vi utökar det till att även söka bland blogginlägg och visa matchande resultat på startsidan.

### Ändringar

1. **`src/pages/Index.tsx`** -- Skicka `searchQuery` som prop till `BlogSection`
2. **`src/components/BlogSection.tsx`** -- Ta emot `searchQuery` prop, filtrera inläggen klientside på title/excerpt (samma mönster som ToolCatalog), visa alla matchande inlägg vid sökning istället för bara 3
3. **`src/components/HeroSection.tsx`** -- Uppdatera placeholder till "Search tools and blog posts..."

### Teknisk detalj

- BlogSection hämtar redan alla inlägg (limit 3). Vid sökning hämtar vi fler (eller alla) och filtrerar på `title` och `excerpt` med `toLowerCase().includes()`.
- Alternativt: behåll limit 3 för default-vy men gör en separat query utan limit när `searchQuery` finns, filtrerat serverside med `.ilike()`.
- Enklast: hämta alla inlägg, filtrera klientside, visa max 3 utan sökning och alla matchande vid sökning.

