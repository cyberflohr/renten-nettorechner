# Renten Nettorechner Product Requirements Document (PRD)

## 1. Ziele und Hintergrund

**Ziele:**
*   Entwicklung eines Single-Page-Application (SPA) Renten-Nettorechners.
*   Bereitstellung einer fokussierten Berechnung der Nettorente bei vorzeitigem Renteneintritt (Szenarien: 0, 6, 12, 18, 24 Monate früher).
*   Schaffung einer klaren und verständlichen Ergebnisanzeige in Tabellenform.

**Hintergrund:**
Dieses Projekt zielt darauf ab, zukünftigen Rentnern in Deutschland ein einfaches Werkzeug an die Hand zu geben, um die finanziellen Auswirkungen eines vorzeitigen Renteneintritts zu verstehen. Die Anwendung soll die komplexen Berechnungen von Brutto- zu Nettorente unter Berücksichtigung von Abschlägen, Sozialabgaben und Steuern vereinfachen und in verschiedenen Szenarien transparent darstellen.

**Change Log:**
| Datum      | Version | Beschreibung      | Autor |
| :--------- | :------ | :---------------- | :---- |
| 16.09.2025 | 1.0     | Erster Entwurf | John (PM) |
| 16.09.2025 | 1.1     | Erfolgsmetrik hinzugefügt | John (PM) |
| 16.09.2025 | 1.2     | Implementierungs-Updates | James (Dev) |
| 16.09.2025 | 1.3     | Bedingte Anzeige Bundesland | John (PM) |
| 16.09.2025 | 1.4     | KVdR-Verfeinerung hinzugefügt | John (PM) |
| 16.09.2025 | 1.5     | Amortisationszeit der Rente | John (PM) |

---

## 2. Anforderungen

**Funktionale Anforderungen (aktualisiert):**
*   **FR1:** Der Benutzer gibt Geburtsdatum, erwartete Regelaltersrente, aktuelle Anwartschaft und Stichtag ein. Felder wie Bundesland, Kirchensteuerpflicht, Versichertenstatus und PKV wurden entfernt.
*   **FR2:** Die Anwendung berechnet die Nettorente für neun Szenarien des vorzeitigen Renteneintritts: 0, 6, 12, 18, 24, 30, 36, 42 und 48 Monate vor der Regelaltersgrenze.
*   **FR3:** Die Berechnung erfolgt ausschließlich für gesetzlich Versicherte (KdVR/GKV).
*   **FR4:** Die Ergebnisse werden in einer übersichtlichen Tabelle dargestellt.
*   **FR5:** Die Ergebnistabelle enthält folgende Spalten: Monate früher, Bruttorente, Abzug, PV-Beitrag, KV-Beitrag, zu versteuerndes Einkommen, Ertragsanteil (%), Steuer, Nettorente, Break-Even-Alter, Netto-Differenz zu Standard.
*   **FR6:** Der Benutzer kann seine eingegebenen Daten und die berechneten Ergebnisse lokal im Browser speichern und wieder laden.
*   **FR7:** Die Berechnung der Kranken- und Pflegeversicherungsbeiträge für GKV-Rentner bildet die spezifischen Regeln der Krankenversicherung der Rentner (KdVR) korrekt ab.
*   **FR8:** Disclaimer und Statusbar sind optisch konsistent und so breit wie die Tabelle.
*   **FR9:** Die Anwendung ist linksbündig und responsiv, ohne horizontales Scrollen der Tabelle.

**Nicht-funktionale Anforderungen:**
*   **NFR1:** Die Anwendung muss eine responsive Single-Page-Application (SPA) sein, die auf modernen Desktop- und Mobil-Browsern funktioniert.
*   **NFR2:** Die Berechnungen sollten client-seitig durchgeführt werden, um die Privatsphäre der Benutzer zu wahren und eine schnelle Reaktionszeit zu gewährleisten.
*   **NFR3:** Die Benutzeroberfläche muss einfach und intuitiv bedienbar sein.
*   **NFR4:** Die Anwendung muss sehr gute Schätzungen liefern, die auf allgemein anerkannten Berechnungsformeln und regelmäßig aktualisierten Parametern basieren. Die Einkommensteuer wird anhand einer vereinfachten progressiven Steuertabelle berechnet. Ein deutlicher Hinweis (Disclaimer) muss den Benutzer darauf aufmerksam machen, dass es sich um Schätzungen handelt und eine professionelle Beratung unerlässlich ist.

---

## 3. User Interface (UI) Design-Ziele

**Gesamte UX-Vision:**
Die Benutzererfahrung soll extrem einfach, schnell und fokussiert sein. Ein "Single-Purpose"-Werkzeug, das eine klare Antwort auf eine komplexe Frage gibt, ohne jegliche Ablenkung. Der Benutzer soll sich nach der Nutzung informiert und handlungsfähig fühlen.

**Interaktions-Paradigmen:**
Ein einfacher, linearer, formularbasierter Arbeitsablauf. Der Benutzer füllt von oben nach unten die Felder aus und sieht die Ergebnisse sofort. Keine komplexe Navigation oder mehrstufige Assistenten.

**Kern-Ansichten:**
*   **Eingabe- & Ergebnis-Ansicht:** Ein einziger Bildschirm, der sowohl das Eingabeformular als auch die Ergebnistabelle enthält. Die Tabelle könnte sich idealerweise in Echtzeit aktualisieren, während der Benutzer seine Daten eingibt.

**Barrierefreiheit:**
*   **WCAG AA:** Als Standard für ein öffentliches Tool, um eine breite Zugänglichkeit zu gewährleisten.

**Branding:**
*   Es sind keine spezifischen Branding-Vorgaben bekannt. Ich schlage ein sauberes, neutrales und vertrauenswürdiges Design vor, das an staatliche oder finanzielle Institutionen erinnert, um Seriosität zu vermitteln.

**Ziel-Plattformen:**
*   **Web Responsive:** Die Anwendung muss auf allen modernen Geräten (Desktop, Tablet, Smartphone) einwandfrei funktionieren.

---

## 4. Technische Annahmen

**Repository-Struktur:**
*   **Monorepo:** Da es sich um eine einzelne Anwendung handelt, ist ein einziges Repository der einfachste und direkteste Ansatz.

**Service-Architektur:**
*   **Serverless / Static Site:** Die Anwendung wird als reiner Frontend-Code (HTML, CSS, JavaScript) gebaut und auf einem statischen Webhost betrieben. Es gibt keine serverseitige Logik oder eigene Backend-Dienste.

**Anforderungen an das Testen:**
*   **Unit- & Integrationstests:**
    *   **Unit-Tests** sind unerlässlich für die komplexe Berechnungslogik, um die Korrektheit der Schätzungen sicherzustellen.
    *   **Integrationstests** für die Vue-Komponenten, um das Zusammenspiel der UI-Elemente zu prüfen.

**Zusätzliche technische Annahmen und Wünsche:**
*   **Frontend-Framework:** **Vue.js** (basierend auf Ihrer expliziten Präferenz und Erfahrung).
*   **Build-Tool:** **Vite** als modernes und performantes Standard-Build-Tool für Vue.js-Anwendungen.
*   **Deployment-Ziel:** Deployment als statische Dateien auf einer Plattform wie Netlify, Vercel, GitHub Pages oder einem ähnlichen Dienst, der kostenloses Hosting für statische Seiten anbietet.
*   **Einkommensteuerberechnung:** Die Einkommensteuerberechnung basiert auf einer vereinfachten progressiven Steuertabelle, die im Code hinterlegt ist und nicht die volle Komplexität des deutschen Steuerrechts abbildet.

---

## 5. Epic-Liste
**Epic 1: MVP Renten-Nettorechner (aktualisiert)**
*   **Ziel:** Entwicklung und Bereitstellung der Kernfunktionalität des Rechners. Dateneingabe nur mit relevanten Feldern, Berechnung und Anzeige für alle Szenarien (0–48 Monate), Tabelle mit allen geforderten Spalten, Berechnung nach KdVR, keine PKV/Versichertenstatus/Bundesland/Kirchensteuer, Break-Even-Alter und Netto-Differenz werden berechnet und angezeigt.

**Epic 2: Speichern und Laden**
*   **Ziel:** Berechnungen können lokal gespeichert und geladen werden. Automatisches Laden der letzten Berechnung beim Start.

---

## 6. Details zu Epic 1: MVP Renten-Nettorechner

**Story 1.1: Projekt-Setup & UI-Grundgerüst**
*   **Als** Entwickler **möchte ich** ein neues Vue.js-Projekt mit Vite einrichten und ein UI-Grundgerüst erstellen, **damit** eine stabile Grundlage für die Anwendung existiert.
*   **Akzeptanzkriterien:**
    1.  Ein Vue.js-Projekt ist mit Vite erstellt.
    2.  Es gibt eine Haupt-Komponente mit Platzhaltern für das Eingabeformular und die Ergebnistabelle.
    3.  Das Projekt ist lokal startbar.

**Story 1.2: Dateneingabe-Formular (aktualisiert)**
*   **Als** Benutzer **möchte ich** ein Formular mit allen relevanten Eingabefeldern sehen und bedienen, **damit** ich meine persönlichen Daten für die Berechnung eingeben kann.
*   **Akzeptanzkriterien:**
    1.  Eine Vue-Komponente für das Formular existiert.
    2.  Nur relevante Felder: Geburtsdatum, erwartete Rente, aktuelle Anwartschaft, Stichtag.
    3.  Einfache Eingabevalidierung ist implementiert.
    4.  Die Formulardaten werden im State der Anwendung gespeichert.

**Story 1.3: Berechnungs-Logik (aktualisiert)**
*   **Als** Entwickler **möchte ich** die Kern-Berechnungslogik in einem separaten, testbaren Modul implementieren, **damit** die Nettorente basierend auf den Eingaben korrekt geschätzt werden kann.
*   **Akzeptanzkriterien:**
    1.  Ein separates Modul für die Berechnungslogik existiert.
    2.  Eine Funktion nimmt die Benutzereingaben entgegen.
    3.  Die Funktion berechnet alle Werte für die 9 Szenarien.
    4.  Die Logik ist durch Unit-Tests abgedeckt.
    5.  Berechnung für KdVR, alle Szenarien, mit Abzug verlorener Rentenpunkte, Steuer nach §32a EStG 2025, Break-Even-Alter, Netto-Differenz.

**Story 1.4: Ergebnis-Tabelle (aktualisiert)**
*   **Als** Benutzer **möchte ich** die Ergebnisse der Berechnung in einer klaren Tabelle sehen, **damit** ich die verschiedenen Szenarien vergleichen kann.
*   **Akzeptanzkriterien:**
    1.  Eine Vue-Komponente für die Ergebnistabelle existiert.
    2.  Die Komponente zeigt alle berechneten Spalten für die 9 Szenarien an.
    3.  Die Tabelle ist lesbar formatiert und enthält: zu versteuerndes Einkommen, Ertragsanteil, Break-Even-Alter, Netto-Differenz.

**Story 1.5: Integration und Disclaimer (aktualisiert)**
*   **Als** Benutzer **möchte ich** die Eingabeformular und Ergebnistabelle nahtlos zusammenarbeiten und einen klaren Disclaimer sehen, **damit** ich das Tool nutzen und die Art der Ergebnisse verstehen kann.
*   **Akzeptanzkriterien:**
    1.  Die Komponenten sind integriert und der Datenfluss funktioniert. 
    2.  Die Berechnung wird ausgelöst und die Ergebnistabelle aktualisiert sich bei Eingabeänderungen.
    3.  Ein prominenter Disclaimer-Text ist sichtbar und so breit wie die Tabelle.
    4.  Die Anwendung ist linksbündig und responsiv, ohne horizontales Scrollen der Tabelle.

---

## 6. Details zu Epic 2: Speichern von Berechnungen und weitere Versicherungsoptionen

**Story 2.1: Speichern von Berechnungen (Local Storage)**
*   **Als** Benutzer **möchte ich** meine Berechnungen lokal im Browser speichern und laden können,
*   **damit** ich sie später erneut aufrufen kann, ohne die Daten neu eingeben zu müssen.
*   **Akzeptanzkriterien:**
    1.  Eine "Speichern"-Schaltfläche wird zur UI hinzugefügt.
    2.  Beim Klicken auf "Speichern" werden die aktuellen Benutzereingaben und Berechnungsergebnisse lokal im Browser abgelegt.
    3.  Eine "Laden"-Schaltfläche ist verfügbar, um die zuletzt gespeicherte Berechnung abzurufen.
    4.  Die Anwendung lädt die zuletzt gespeicherte Berechnung beim Start automatisch.

**Story 2.2: PKV-Berechnung**
*   **Nicht mehr relevant (entfernt).**

**Story 2.3: Verfeinerung der KdVR-Berechnung**
*   **Als** Benutzer **möchte ich**, dass die Berechnung der Kranken- und Pflegeversicherungsbeiträge für GKV-Rentner die spezifischen Regeln der Krankenversicherung der Rentner (KdVR) korrekt abbildet.
*   **Akzeptanzkriterien:**
    1.  Der `CalculationService` verwendet die spezifischen Beitragssätze und -verteilung der KdVR.
    2.  Die Berechnung berücksichtigt den Anteil der Rentenversicherung am Beitrag.

**Story 2.4: Amortisationszeit der vorgezogenen Rente**
*   **Als** Benutzer **möchte ich** die Amortisationszeit der vorgezogenen Rente in der Ergebnistabelle sehen,
*   **damit** ich die finanzielle Auswirkung eines vorzeitigen Rentenbeginns besser einschätzen kann.
*   **Akzeptanzkriterien:**
    1.  Die Ergebnistabelle enthält eine Spalte für die Amortisationszeit der vorgezogenen Rente bzw. das Break-Even-Alter.
    2.  Die Amortisationszeit/Break-Even-Alter wird korrekt berechnet und angezeigt.

---

## 7. Checklist-Prüfung - Ergebnisse

**Executive Summary:**
*   **Vollständigkeit des PRD:** ca. 90%
*   **MVP-Umfang:** Genau richtig
*   **Bereitschaft für Architekturphase:** Bereit

**Erfolgsmetrik für das MVP (Ziel für die ersten 3 Monate):**
*   **Metrik:** Eine "War diese Berechnung hilfreich?"-Abfrage (Ja/Nein) wird nach der Berechnung angezeigt.
*   **Ziel:** Eine "Ja"-Rate von über 80%.

**Finale Entscheidung:**
*   **READY FOR ARCHITECT:** Das PRD ist umfassend, gut strukturiert und bereit für die Architektur-Design-Phase.

---

## 8. Nächste Schritte

**Aufforderung an den UX-Experten:**
"Hallo UX-Expert, bitte erstelle ein passendes UI/UX-Konzept für das im PRD (`docs/prd.md`) definierte Projekt 'Renten Nettorechner'. Beachte insbesondere die UI-Design-Ziele."

**Aufforderung an den Architekten:**
"Hallo Architect, bitte erstelle eine passende Software-Architektur für das im PRD (`docs/prd.md`) definierte Projekt 'Renten Nettorechner'. Beachte insbesondere die technischen Annahmen und die definierten User Stories."