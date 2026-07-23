# AL-WING — Website

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
leistungen.html     Website-Erstellung · Hosting · Datenschutz · Wartung · FAQ
projekte.html       Projekte & Referenzen (ehrlicher Status, kein Fake-Trust)
ueber-mich.html     Markenstory, Haltung, Founder-Vorstellung, Solo-Hinweis
kontakt.html        Formular (JS-Validierung, Formspree-vorbereitet)
impressum.html      Anbieterkennzeichnung (§ 5 DDG)
datenschutz.html    Datenschutzerklärung (DSGVO)
css/style.css       Design-System (Farben, Typo, Layout, Animationen)
js/main.js          Scroll-Choreografie, Reveals, Menü, Formular
assets/             Erwartete Bilder & Fonts — siehe assets/README.md
robots.txt          Crawler-Steuerung, verweist auf sitemap.xml
sitemap.xml         XML-Sitemap der fünf indexierbaren Seiten
BRIEFING.md         Design-Briefing als Markdown
```

## Zielgruppe & Positionierung (Stand: zweite Überarbeitung)

Die Website richtet sich gezielt an **kleine, regionale, handwerksnahe
Unternehmen ohne (gute) eigene Website**. Entsprechend wurde die Copy
überarbeitet:

- Kundennutzen steht vor Personal-Branding — die Startseite spricht direkt
  die Sorgen dieser Zielgruppe an (Fachchinesisch, versteckte Kosten, keine
  eigene IT), sichtbar in der neuen Trust-Badge-Sektion.
- Die Mottos „Discipline today. Success tomorrow." und
  „ambitioniert · lösungsorientiert · diszipliniert" sind bewusst **nicht
  mehr omnipräsent**: Sie tauchen jeweils nur noch an einer Stelle auf
  (Werte-Grid auf `ueber-mich.html`), statt sich durch Hero, Statement und
  jeden Footer zu wiederholen.
- Durchgängig **Solo-Positionierung**: „wir" wurde in der Marketing-Copy zu
  „ich" (Anna Lena Gerth arbeitet aktuell allein) — das ist zugleich ein
  Vertrauensargument für die Zielgruppe („ein Ansprechpartner, keine
  Warteschleifen").
- Mehr Farbvielfalt: eine neue warme Tan/Brown-Sektion (Trust-Badges) sowie
  eine hellere Steel-Blue-Duotone-Variante (`.media--steel`) ergänzen die
  bisher stark Cream/Navy-lastige Palette.

## Vor Veröffentlichung prüfen

- [x] **Ordnerstruktur repariert** — alle Seiten verlinkten auf `css/style.css`,
  `js/main.js` und `assets/…`, doch diese Ordner fehlten im Repo (nur flache
  Dateien im Root, plus eine 1-Byte-Datei namens `assets`). Die Website war
  dadurch komplett unformatiert und ohne Bilder. Behoben: `css/`, `js/` und
  `assets/` angelegt, alle Dateien einsortiert.
- [x] **Bildgrößen optimiert** — die Founder-Fotos lagen als 7–10 MB große
  Originale (bis 7500 px Kantenlänge) direkt im Repo-Root und wären beim
  Laden extrem langsam gewesen. Auf 1600–2400 px Kantenlänge verkleinert und
  komprimiert (jetzt ~65–160 KB je Bild) — für Core Web Vitals/LCP entscheidend.
- [x] **`assets/og-image.jpg`** (1200×630) ergänzt — fehlte komplett, wodurch
  Vorschaubilder beim Teilen (Social Media, Messenger, KI-Tools) leer blieben.
- [x] **Echte Fotografien der Gründerin** — liegen jetzt vor und sind
  eingebunden (`portrait-founder.jpg`, `portrait-founder-working.jpg`, sowie
  ein zusätzliches Arbeitsfoto im Wartungs-Abschnitt auf `leistungen.html`).
- [x] **`llms.txt`** ergänzt — strukturierte Kurzfassung für KI-Antwortmaschinen
  (GEO), analog zu `robots.txt` für klassische Crawler.
- [x] **Firmenname** — von „Studio Gerth" auf „Alewing" umbenannt (Logo,
  Nav, Footer, Meta-Tags, JSON-LD, `robots.txt`, `llms.txt`). Domain bleibt
  bewusst `studio-gerth.de`, bis die neue Domain feststeht (siehe Punkt
  darunter).
- [ ] **Domain** — Platzhalter `https://www.studio-gerth.de` in Canonicals, Open-Graph-Tags, JSON-LD, `robots.txt`, `sitemap.xml` und `llms.txt` durch die echte Domain ersetzen (Suchen/Ersetzen über alle Dateien).
- [ ] **Impressum & Kontaktdaten** — reale Daten aus dem Lebenslauf übernommen (Anna Lena Gerth, Naulitz 9a, 07554 Gera, lena.gerth@outlook.de, +49 1520 2758286). Bitte bestätigen; USt-Hinweis ergänzen.
- [ ] **Rechtstexte** — Impressum/Datenschutz sind sorgfältig erstellt, ersetzen aber keine Rechtsberatung.
- [ ] **Fonts lokal einbinden** — aktuell via Fontshare/Google-CDN; für sauberen Datenschutz lokal laden (Dateien nach `assets/fonts/` legen, `@font-face` in `css/style.css` ergänzen, CDN-`<link>`-Tags entfernen).
- [ ] **Formular anbinden** — z. B. Formspree; Anleitung im Kommentar in `js/main.js`, Abschnitt 6.
- [ ] **Weitere Fotografien** — die Platzhalterflächen für „Hosting" und „Datenschutz" auf `leistungen.html` sind bewusst noch CSS-Texturen geblieben, da keine passende Foto-Art-Direction (Architektur/Papier-Motiv) vorliegt — echte Fotos hier nur einsetzen, wenn sie thematisch passen, sonst wirkt es wie Stock-Material.
- [ ] **Projekte & Testimonials** — `projekte.html` zeigt bewusst noch keine erfundenen Referenzen (rechtlich riskant, siehe UWG). Sobald reale Projekte/Zitate vorliegen, den in der Datei dokumentierten Muster-Code für `.project-card` und `.testimonial-placeholder` nutzen — Kundenstimmen nur mit ausdrücklicher Einwilligung veröffentlichen.
- [ ] **Social Links** — der LinkedIn-Platzhalter im Footer wurde entfernt (verlinkte nur auf die LinkedIn-Startseite, kein echtes Profil — wirkte wie ein toter Link). Sobald ein echtes Profil existiert: Link im Footer alle `.html`-Dateien ergänzen und in den JSON-LD-`sameAs`-Daten eintragen.
- [ ] **Google Search Console / Bing Webmaster Tools** — Sitemap nach Domain-Umzug neu einreichen.

## Geplant, aber noch nicht umgesetzt

- **Scrollbares Einstiegsvideo im Hero** (z. B. Entstehung einer Website
  als kurze Sequenz): von der Gründerin als zukünftige Erweiterung
  genannt, bewusst noch nicht gebaut. Bei Umsetzung: `.hero-stage` in
  `index.html` um ein `<video>`-Element ergänzen, das per Scroll-Fortschritt
  gesteuert wird (`currentTime` an `progress` aus `js/main.js` koppeln),
  mit `prefers-reduced-motion`-Fallback auf ein Standbild.

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
- **`llms.txt`** im Root: kompakte Markdown-Zusammenfassung (Angebot,
  Zielgruppe, Kontakt, Link-Liste) speziell für KI-Antwortmaschinen, die
  Websites zunehmend über diese Konvention statt über HTML crawlen.
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
