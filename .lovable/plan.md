

## Förslag: Gör bloggen mer synlig och lättare att hitta

Bloggen ligger idag längst ner på startsidan, efter hela verktygskatalogen — besökare måste scrolla långt för att hitta den. Här är konkreta förbättringar:

### 1. Lägg till en dedikerad bloggsida (`/blog`)
- Skapa `src/pages/Blog.tsx` med Header, Footer och en liknande layout som BlogSection men som visar alla inlägg med pagination
- Lägg till route `/blog` i `App.tsx`

### 2. Uppdatera navigeringen
- Ändra "Blog"-länkarna i Header (desktop + mobil) till en riktig `Link to="/blog"` istället för att scrolla till `#blog`
- Lägg till en "Blog"-länk i Footer

### 3. Lyft bloggen i hero-sektionen
- Lägg till en liten CTA-knapp eller länk under sökfältet i HeroSection, t.ex. "📝 Read the latest blog posts →" som pekar till `/blog`

### 4. Behåll BlogSection på startsidan som en preview
- Visa 3 senaste inläggen med en "View all posts →" länk till `/blog`

### Teknisk sammanfattning
- Ny fil: `src/pages/Blog.tsx`
- Ändrade filer: `App.tsx` (route), `Header.tsx` (navigation), `Footer.tsx` (länk), `HeroSection.tsx` (CTA), `BlogSection.tsx` (begränsa till 3 + länk)

