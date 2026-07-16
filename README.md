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
| `hero-scroll.mp4` | Startseite · scroll-gesteuerter Einstiegs-Clip (Seedance 2.0, generiert) | MP4/H.264, 1280×720, 8 s, stumm |
| `hero-poster.jpg` | Startseite · Standbild, während `hero-scroll.mp4` lädt (bereits im Repo) | JPG, 1280×720, < 150 KB |

### Bereitgestellte Founder-Fotos (Status: erledigt)

Sechs Fotos (Lena-20/25/27/61/66/67) wurden hochgeladen — allerdings zunächst
auf den `main`-Branch statt auf den Arbeits-Branch, weshalb sie zunächst
nirgends sichtbar waren. Sind inzwischen von dort geholt, zugeschnitten und
korrekt eingesetzt:

- `Lena-25.jpg` → `portrait-founder.jpg` (Studio-Porträt, für `ueber-mich.html`)
- `Lena-67.jpg` → `portrait-founder-working.jpg` (Laptop-Szene, für `leistungen.html`)
- `Lena-61.jpg` → `hero-poster.jpg` (Blick in die Kamera, Startbild des Hero-Clips)

Falls künftig wieder direkt über die GitHub-Weboberfläche hochgeladen wird:
oben links den Branch von `main` auf `claude/quiet-luxury-agency-site-1443vv`
umstellen, bevor „Add file → Upload files" gewählt wird — sonst landen die
Dateien wieder auf dem falschen Branch.

### Hero-Scroll-Clip (Status: in Arbeit)

Ein 8-sekündiger Clip wird mit Seedance 2.0 generiert (720p, stumm, aus
`Lena-61.jpg` als Start- und `Lena-67.jpg` als End-Referenz): Blick in die
Kamera → Blick auf den Laptop → Kamera schwenkt in die Ich-Perspektive auf
den Bildschirm. Anders als der vorherige Loop-Ansatz läuft dieser Clip nicht
automatisch ab, sondern wird beim Scrollen frame-genau gesteuert (siehe
`js/main.js`, Abschnitt 4) — der Bildschirm-Blick am Ende geht nahtlos in die
Cream-Überblendung und damit in die echte Webseite darunter über. Sobald der
Job fertig ist, wird die Datei als `hero-scroll.mp4` eingesetzt.

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
