## Renten-Nettorechner

Ein moderner, client-seitiger Renten-Nettorechner für Deutschland. Berechnet die Nettorente bei vorzeitigem Renteneintritt unter Berücksichtigung von KdVR, Steuern, Abschlägen und verlorenen Rentenpunkten. Ergebnisdarstellung in einer übersichtlichen Tabelle für verschiedene Szenarien.

## Features
- Berechnung für 0, 6, 12, 18, 24, 30, 36, 42, 48 Monate vorzeitigem Renteneintritt
- Berücksichtigung von KdVR (gesetzliche Krankenversicherung der Rentner)
- Steuerberechnung nach §32a EStG 2025
- Abzug verlorener Rentenpunkte bei vorzeitigem Bezug
- Anzeige von Brutto, Netto, Steuer, KV/PV, Break-Even-Alter, zu versteuerndem Einkommen, Ertragsanteil (%)
- Speichern und Laden der Berechnung im Browser
- Responsive, modernes UI
- Disclaimer und Statusbar optisch konsistent

## Getting Started

### Voraussetzungen
- Node.js >= 20
- npm

### Lokale Entwicklung
```sh
npm install
npm run dev
```
Die App läuft unter http://localhost:5173

### Build für Produktion
```sh
npm run build
```
Das Ergebnis liegt im Ordner `dist`.

## Deployment auf GitHub Pages

Automatisiert via GitHub Actions (`.github/workflows/deploy.yml`).
- Bei jedem Push auf `main` wird die App gebaut und auf den Branch `gh-pages` deployed.
- Die Seite ist erreichbar unter: `https://cyberflohr.github.io/renten-nettorechner/`

## Projektstruktur
- `src/` – Quellcode (Vue 3, Pinia, TypeScript)
- `public/` – Statische Dateien
- `docs/` – PRD, Architektur, Brainstorming
- `.github/workflows/` – CI/CD für Deployment

## Lizenz
MIT

---
**Hinweis:** Die Berechnungen sind Schätzungen und ersetzen keine professionelle Beratung.
