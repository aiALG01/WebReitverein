# /assets/ — erwartete Bilddateien

Die Website läuft bereits vollständig **ohne Bilddateien**: Alle Bildflächen
sind als CSS-Verläufe im Moodboard-Stil angelegt (Seide, warmes Licht,
Navy-Duotone). Sobald echte Fotografien vorliegen, werden sie hier abgelegt
und in den `.media`-Containern als `<img loading="lazy" …>` eingesetzt.

## Art Direction (aus dem Moodboard)

- Editorial-Fotografie in warmem, natürlichem Licht (Sonne durch Fenster, lange Schatten)
- Texturen: fließende Seide/Satin, Leinen, Papier
- Fokussierte Arbeitsszenen: Laptop, Notizen, Schmuck-Details an den Händen
- Architektur mit Schattenspiel, Skyline-Blick
- Navy-getönte Duotone-Momente für Section-Übergänge
- Dezent: Springreiten/Reitsport nur auf „Über mich" (Disziplin-Story)

## Erwartete Dateien

| Datei | Verwendung | Format & Größe |
|---|---|---|
| `hero-silk.jpg` | Hintergrund Hero (Startseite), Navy-Duotone-Bearbeitung | JPG/AVIF, 2400×1600, < 350 KB |
| `service-webdesign.jpg` | Leistungen · Website-Erstellung (Arbeitsszene, warmes Licht) | JPG/AVIF, 1600×1200, < 250 KB |
| `service-hosting.jpg` | Leistungen · Hosting (Architektur, Navy-Duotone) | JPG/AVIF, 1600×1200, < 250 KB |
| `service-datenschutz.jpg` | Leistungen · Datenschutz (Papier/Notizen, helles Licht) | JPG/AVIF, 1600×1200, < 250 KB |
| `service-wartung.jpg` | Leistungen · Wartung (Hände an Laptop, Schmuck-Detail) | JPG/AVIF, 1600×1200, < 250 KB |
| `portrait-founder.jpg` | Über mich · Porträt Anna Lena Gerth | JPG/AVIF, 1200×1500 (Hochformat), < 300 KB |
| `portrait-founder-working.jpg` | Startseite/Leistungen · Anna Lena Gerth bei der Arbeit (z. B. Laptop) | JPG/AVIF, 1600×1200, < 300 KB |
| `statement-duotone.jpg` | Statement-Bänder (Navy-getöntes Motiv, z. B. Skyline/Schatten) | JPG/AVIF, 2400×1400, < 300 KB |
| `og-image.jpg` | Social-Media-Vorschau (`<meta property="og:image">`) | JPG, 1200×630, < 200 KB |
| `favicon.svg` | Favicon (Monogramm „G." in Navy auf Cream) | SVG |

### Bereitgestellte Founder-Fotos (noch nicht eingesetzt)

Drei Porträt-/Arbeitsfotos wurden im Chat bereitgestellt, konnten aber aus
dieser Sitzung heraus technisch nicht als Dateien gespeichert werden (siehe
Hinweis in `README.md`). Sobald sie als Dateien vorliegen (z. B. per Upload
in einer neuen Sitzung oder direkt ins Repo kopiert), bitte so benennen und
einsetzen:

- Zwei Studio-Porträts (heller Hintergrund) → `portrait-founder.jpg`
  (für `ueber-mich.html`, Hochformat zuschneiden)
- Foto mit Laptop (dunkler Hintergrund) → `portrait-founder-working.jpg`
  (für Startseite/Leistungen als Arbeitsszene)

## Fonts (empfohlen: lokal einbinden)

Für den Echtbetrieb sollten die Schriften lokal liegen (Datenschutz — siehe
Kommentar in `datenschutz.html`, Abschnitt 4):

```
/assets/fonts/melodrama-*.woff2   (Fontshare, ITF Free Font License)
/assets/fonts/britney-*.woff2     (Fontshare, ITF Free Font License)
/assets/fonts/inter-*.woff2       (SIL Open Font License)
```

Danach in `css/style.css` per `@font-face` laden und die CDN-`<link>`-Tags
in den HTML-Köpfen entfernen.

## Einsetzen der Bilder

Beispiel — Platzhalter durch echtes Bild ersetzen:

```html
<!-- vorher -->
<div class="media media--silk detail-media" role="img" aria-label="…"></div>

<!-- nachher -->
<figure class="media detail-media">
  <img src="assets/service-webdesign.jpg" alt="Fokussierte Arbeit am Schreibtisch in warmem Fensterlicht" loading="lazy" width="1600" height="1200">
</figure>
```
