# Brainstorming-Ergebnisse: Renten Nettorechner

## Executive Summary

*   **Session-Thema:** Konzeption eines "Renten Nettorechners" als Single-Page-Application (SPA).
*   **Ziel:** Fokussierte Ideenfindung zur Berechnung der Nettorente bei vorzeitigem Renteneintritt (0, 6, 12, 18, 24 Monate früher).
*   **Verwendete Technik:** Mind Mapping zur Strukturierung von Dateneingabe, Berechnungsgrundlagen und Ergebnisanzeige.
*   **Ergebnis:** Detaillierte Definition der Kernfunktionen und Priorisierung für ein Minimum Viable Product (MVP).

## Technik: Mind Mapping

Die Session wurde mittels Mind Mapping strukturiert, um die Komponenten der Anwendung zu visualisieren. Die Hauptäste waren:

1.  **Dateneingabe:** Informationen, die vom Benutzer abgefragt werden.
2.  **Berechnungsgrundlagen:** Interne Daten und Regeln für die Logik.
3.  **Ergebnisanzeige:** Die dem Benutzer präsentierten Resultate.

## Ideen-Priorisierung (MoSCoW)

### Must-have (MVP - Version 1.0)

Diese Funktionen sind für den ersten Launch unerlässlich.

*   **Detaillierte Dateneingabe:**
    *   Geburtstag
    *   Voraussichtliche Regelaltersrente
    *   Steuerklasse
    *   Bundesland
    *   Kirchensteuerpflicht (ja/nein)
    *   Versichertenstatus (Standard, langjährig, besonders langjährig)
*   **Fokus auf Gesetzliche Krankenversicherung (GKV):** Die erste Version beschränkt sich auf die Berechnung für GKV-Versicherte.
*   **Vollständige Ergebnistabelle:** Anzeige aller berechneten Werte für die Szenarien 0, 6, 12, 18 und 24 Monate früherer Renteneintritt.
    *   Monate früher
    *   Bruttorente
    *   Abschlag
    *   Beitrag PV
    *   Beitrag KV
    *   Steuer
    *   Nettorente
    *   Break-Even-Alter

### Should-have (Nächste Version)

Wichtige Funktionen für zukünftige Versionen.

*   **Unterstützung für Private Krankenversicherung (PKV):** Erweiterung der Berechnung, um auch PKV-Versicherte zu berücksichtigen.

### Could-have (Wünschenswert)

Nützliche Ergänzungen, wenn Zeit und Ressourcen es erlauben.

*   **Speichern von Berechnungen:** Ermöglicht dem Benutzer, seine Ergebnisse für später zu sichern.

## Action Plan / Nächste Schritte

1.  **Entwicklung des MVP:** Implementierung der "Must-have"-Funktionen.
    *   **Frontend:** Aufbau der SPA mit den definierten Eingabefeldern und der Ergebnistabelle.
    *   **Backend/Logik:** Implementierung der Rechenlogik basierend auf den "Berechnungsgrundlagen". Hierfür müssen die aktuellen gesetzlichen Tabellen und Formeln recherchiert und integriert werden.
2.  **Testing:** Sicherstellen, dass die Berechnungen für verschiedene Fallkonstellationen innerhalb der GKV korrekt sind.
3.  **Roadmap-Planung:** Planung der Implementierung der "Should-have"-Features nach dem MVP-Launch.

## Reflexion

Die Session war sehr produktiv. Durch die Kombination von Mind Mapping und MoSCoW-Priorisierung konnten wir schnell von einer breiten Ideensammlung zu einem klaren und umsetzbaren Plan für ein MVP gelangen. Die schrittweise Detaillierung hat geholfen, Abhängigkeiten (z.B. zwischen Ergebnisanzeige und Dateneingabe) aufzudecken.
