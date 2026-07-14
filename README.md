# Studio Gerth — Website

Minimalistische, hochwertige Agentur-Website im Stil „Quiet Luxury /
Editorial Discipline". Reines HTML/CSS/Vanilla-JS — kein Build-Step, direkt
im Browser lauffähig.

## Ansehen

Einfach `index.html` im Browser öffnen — oder lokal ausliefern:

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

## Struktur

```
index.html          Startseite mit Scroll-Hero (Navy → Cream)
leistungen.html     Website-Erstellung · Hosting · Datenschutz · Wartung
ueber-mich.html     Markenstory, Haltung, Founder-Vorstellung
kontakt.html        Formular (JS-Validierung, Formspree-vorbereitet)
impressum.html      Anbieterkennzeichnung (§ 5 DDG)
datenschutz.html    Datenschutzerklärung (DSGVO)
css/style.css       Design-System (Farben, Typo, Layout, Animationen)
js/main.js          Scroll-Choreografie, Reveals, Menü, Formular
assets/             Erwartete Bilder & Fonts — siehe assets/README.md
robots.txt          Crawler-Steuerung, verweist auf sitemap.xml
sitemap.xml         XML-Sitemap der vier indexierbaren Seiten
BRIEFING.md         Design-Briefing als Markdown
```

## Vor Veröffentlichung prüfen

Die Rückfragen zum Briefing konnten nicht gestellt werden; diese Annahmen
sind bewusst leicht änderbar gehalten:

- [ ] **Firmenname** — aktuell „Studio Gerth". Ändern: Suchen/Ersetzen über alle `.html`-Dateien.
- [ ] **Domain** — Platzhalter `https://www.studio-gerth.de` in Canonicals, Open-Graph-Tags, JSON-LD, `robots.txt` und `sitemap.xml` durch die echte Domain ersetzen (Suchen/Ersetzen über alle Dateien).
- [ ] **Impressum & Kontaktdaten** — reale Daten aus dem Lebenslauf übernommen (Anna Lena Gerth, Naulitz 9a, 07554 Gera, lena.gerth@outlook.de, +49 1520 2758286). Bitte bestätigen; USt-Hinweis ergänzen.
- [ ] **Rechtstexte** — Impressum/Datenschutz sind sorgfältig erstellt, ersetzen aber keine Rechtsberatung.
- [ ] **Fonts lokal einbinden** — aktuell via Fontshare/Google-CDN; für sauberen Datenschutz lokal laden (siehe `assets/README.md`).
- [ ] **Formular anbinden** — z. B. Formspree; Anleitung im Kommentar in `js/main.js`, Abschnitt 6.
- [ ] **Echte Fotografien** — Platzhalterflächen ersetzen (Art Direction & Formate in `assets/README.md`), inkl. `assets/og-image.jpg` (1200×630) für Social-Previews.
- [ ] **Social Links** — LinkedIn-Platzhalter im Footer auf echtes Profil zeigen lassen (aktuell bewusst *nicht* in den JSON-LD-`sameAs`-Daten enthalten, da kein echtes Profil verlinkt ist).
- [ ] **Google Search Console / Bing Webmaster Tools** — Sitemap nach Domain-Umzug neu einreichen.

## SEO & GEO (Generative Engine Optimization)

- **Strukturierte Daten (JSON-LD)** auf jeder Seite: `ProfessionalService`
  (Organisation, Adresse, Kontakt) plus seitenspezifisch `WebSite`/`WebPage`,
  `Service` (je Leistung), `FAQPage`, `AboutPage`/`Person` (Founderin),
  `ContactPage` und `BreadcrumbList`. Damit können Suchmaschinen *und*
  KI-Antwortmaschinen (ChatGPT, Perplexity, Gemini …) Fakten zur Agentur
  direkt und korrekt extrahieren.
- **FAQ-Sektion** auf `leistungen.html` (`#faq`): fünf echte Fragen als
  natives `<details>`/`<summary>`-Akkordeon, ohne JavaScript funktionsfähig.
  Der sichtbare Text ist deckungsgleich mit dem `FAQPage`-Schema — wichtig,
  damit Suchmaschinen die Auszeichnung nicht als irreführend werten.
- **Open Graph & Twitter Cards** auf jeder Seite für saubere Vorschauen beim
  Teilen (Social Media, Messenger, KI-Tools mit Web-Browsing).
- **Canonical-Tags** verhindern Duplicate-Content-Probleme.
- **`robots.txt`** erlaubt vollständiges Crawling (Impressum/Datenschutz
  bewusst *nicht* per `Disallow` gesperrt, sondern nur per Meta-Tag
  `noindex` — sonst könnten Crawler das `noindex` gar nicht erst lesen).
- **`sitemap.xml`** listet die vier indexierbaren Seiten; Rechtsseiten
  bleiben außen vor.
- Alle Titel/Description-Tags sind bereits prägnant und keyword-nah
  formuliert (kein Keyword-Stuffing, echte Sätze — das hilft SEO und GEO
  gleichermaßen, da beide zusammenhängende, klare Sprache bevorzugen).

## Technik-Notizen

- Scroll-Animationen: `IntersectionObserver` (Reveals), `requestAnimationFrame`
  (Hero-Choreografie), CSS Scroll-Driven Animations mit JS-Fallback
  (Lesebalken, Statement-Parallax).
- `prefers-reduced-motion` deaktiviert alle Bewegungen; ohne JavaScript sind
  alle Inhalte sichtbar (`no-js`-Fallbacks).
- Keine Cookies, kein Tracking, keine Frameworks.
