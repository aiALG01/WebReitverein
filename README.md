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
BRIEFING.md         Design-Briefing als Markdown
```

## Vor Veröffentlichung prüfen

Die Rückfragen zum Briefing konnten nicht gestellt werden; diese Annahmen
sind bewusst leicht änderbar gehalten:

- [ ] **Firmenname** — aktuell „Studio Gerth". Ändern: Suchen/Ersetzen über alle `.html`-Dateien.
- [ ] **Impressum & Kontaktdaten** — reale Daten aus dem Lebenslauf übernommen (Anna Lena Gerth, Naulitz 9a, 07554 Gera, lena.gerth@outlook.de, +49 1520 2758286). Bitte bestätigen; USt-Hinweis ergänzen.
- [ ] **Rechtstexte** — Impressum/Datenschutz sind sorgfältig erstellt, ersetzen aber keine Rechtsberatung.
- [ ] **Fonts lokal einbinden** — aktuell via Fontshare/Google-CDN; für sauberen Datenschutz lokal laden (siehe `assets/README.md`).
- [ ] **Formular anbinden** — z. B. Formspree; Anleitung im Kommentar in `js/main.js`, Abschnitt 6.
- [ ] **Echte Fotografien** — Platzhalterflächen ersetzen (Art Direction & Formate in `assets/README.md`).
- [ ] **Social Links** — LinkedIn-Platzhalter im Footer auf echtes Profil zeigen lassen.

## Technik-Notizen

- Scroll-Animationen: `IntersectionObserver` (Reveals), `requestAnimationFrame`
  (Hero-Choreografie), CSS Scroll-Driven Animations mit JS-Fallback
  (Lesebalken, Statement-Parallax).
- `prefers-reduced-motion` deaktiviert alle Bewegungen; ohne JavaScript sind
  alle Inhalte sichtbar (`no-js`-Fallbacks).
- Keine Cookies, kein Tracking, keine Frameworks.
