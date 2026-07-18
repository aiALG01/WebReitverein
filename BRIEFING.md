# Design-Briefing — Studio Gerth

> Dieses Dokument hält das Briefing für die Website fest („Prompt als
> Markdown gespeichert"), inklusive der Referenzen aus Moodboard und
> Lebenslauf. Es dient als Grundlage für Weiterentwicklung und Pflege.

## Auftrag

Komplette Website für **Studio Gerth**, eine Agentur, die für ihre Kunden
Websites erstellt und dazu **Hosting**, **Datenschutz (DSGVO-Betreuung)**
sowie **laufende Wartung & Aktualisierung** anbietet. Die Website selbst ist
das beste Aushängeschild dieser Leistungen.

Rolle: Senior-Webdesigner und Frontend-Entwickler, spezialisiert auf
minimalistische, hochwertige Marken-Websites mit ausgefeilten
Scroll-Animationen (Referenzniveau: apple.com).

## Design-Sprache: „Quiet Luxury / Editorial Discipline"

Ruhig, diszipliniert, hochwertig, editorial — wie ein Modemagazin trifft auf
eine private Bank. Kein Tech-Startup-Look, keine grellen Farben, keine
Stock-Icon-Ästhetik.

### Farbpalette (CSS Custom Properties)

| Token | Wert | Verwendung |
|---|---|---|
| `--color-navy` | `#072768` | Headlines, Akzente, dunkle Flächen |
| `--color-steel-blue` | `#5079B2` | Sekundärer Akzent, Links/Hover, Grafik |
| `--color-cream` | `#F4EAE1` | Haupt-Hintergrund (warmes Off-White) |
| `--color-tan` | `#9D785D` | Buttons, Icons, Trennlinien |
| `--color-brown` | `#936A4D` | Dunkler warmer Akzent, Footer |

Nur diese fünf Farben (plus daraus gemischte Tinten). Navy/Steel-Blue für
Vertrauen & Professionalität, Cream/Tan/Brown für Wärme & Exklusivität.

### Typografie

- **Melodrama** (Indian Type Foundry, via Fontshare) — H1/H2, Statement-Zeilen
- **Britney** (Indian Type Foundry, via Fontshare) — sparsam: Zitate, einzelne Wörter, nie Fließtext
- **Inter** (Google Fonts) — Fließtext & UI
- Großzügiges Letter-Spacing bei Eyebrows/Navigation, viel Weißraum

### Bildsprache (Moodboard)

- Editorial-Fotografie in warmem, natürlichem Licht, lange Schatten
- Texturen: Seide/Satin, Leinen, Papier als Hintergrund-Layer
- Fokussierte Arbeitsszenen, Architektur mit Schattenspiel, Skyline
- Leitmotiv „Disziplin & Erfolg": *Discipline today. Success tomorrow.*
- Navy-Duotone-Momente als Section-Übergänge
- Herkunft der Disziplin-Metapher: Springreiten (Founderin) — dezent auf „Über mich"

## Technischer Stack (verbindlich)

- Reines HTML5, CSS3, Vanilla JS — kein Framework, kein Build-Step
- Mehrseitige Struktur mit echten `.html`-Dateien
- `IntersectionObserver` für Reveal-on-Scroll
- CSS Scroll-Driven Animations (`animation-timeline`) mit JS-Fallback
- `requestAnimationFrame` für Parallax/Hero-Choreografie
- `prefers-reduced-motion` respektieren (statische Alternative)
- Mobile-first, Breakpoints 480 / 768 / 1024 / 1440 px
- Lazy-Loading, semantisches HTML, Barrierefreiheits-Grundlagen

## Seitenstruktur

| Datei | Inhalt |
|---|---|
| `index.html` | Scroll-Hero (Navy→Cream, Statement-Zeilen), 3 Kernleistungen, Prozess (Konzept → Design → Umsetzung → Betreuung), CTA |
| `leistungen.html` | Website-Erstellung, Hosting, Datenschutz, Wartung — je Icon, Beschreibung, Nutzenversprechen |
| `ueber-mich.html` | Markenstory, Haltung (ambitioniert · lösungsorientiert · diszipliniert), Founder-Vorstellung |
| `kontakt.html` | Formular mit JS-Validierung (Formspree-Anbindung vorbereitet), Kontaktdaten, Karten-Platzhalter |
| `impressum.html` / `datenschutz.html` | Rechtsseiten — Vorbildfunktion, da Datenschutz eine Kernleistung ist |

## Content-Ton

Deutsche Texte, kein Lorem Ipsum. Ruhig, selbstbewusst, hochwertig. Kurze
Sätze. Verlässlichkeit und Handwerk statt lauter Werbesprache.

## SEO & GEO

- JSON-LD auf jeder Seite: `ProfessionalService`/Organisation, `Service` je
  Leistung, `FAQPage` (mit sichtbarem Akkordeon auf `leistungen.html`),
  `AboutPage`/`Person` (Founderin), `ContactPage`, `BreadcrumbList`.
- Open Graph, Twitter Cards, Canonical-Tags auf jeder Seite.
- `robots.txt` (Full-Crawl, verweist auf Sitemap) und `sitemap.xml`
  (die vier indexierbaren Seiten; Rechtsseiten bewusst ausgenommen).
- FAQ-Sektion als natives `<details>`/`<summary>` — kein JS nötig, Inhalt
  deckt sich mit dem FAQPage-Schema.

## Getroffene Annahmen (bei Bedarf ändern)

1. **Firmenname:** „Studio Gerth" — der Platzhalter `[Firmenname]` war nicht
   belegt; Rückfrage war technisch nicht möglich.
2. **Domain:** Platzhalter `https://www.studio-gerth.de` für Canonicals,
   Open-Graph-URLs, JSON-LD-`@id`/`url`, `robots.txt` und `sitemap.xml` —
   vor Launch durch die echte Domain ersetzen.
3. **Impressum/Kontakt:** reale Daten aus dem Lebenslauf der Founderin —
   vor Veröffentlichung prüfen (siehe Kommentare in den Rechtsseiten).
4. **Bilder:** CSS-Texturen als Platzhalter; erwartete Fotografien sind in
   `assets/README.md` dokumentiert, inkl. `og-image.jpg` (1200×630) für
   Social-Previews.
5. **Fonts:** vorerst per CDN (Fontshare/Google); Empfehlung für den
   Echtbetrieb: lokal einbinden (Datenschutz), siehe `assets/README.md`.
