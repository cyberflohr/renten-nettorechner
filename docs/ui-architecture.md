# Renten Nettorechner Frontend Architecture Document

## 1. Template- und Framework-Auswahl

Das Product Requirements Document (PRD) gibt uns klare Vorgaben: Die Anwendung soll eine mit **Vue.js** und **Vite** gebaute Single-Page-Application sein.

Basierend auf dieser Entscheidung wird das offizielle `Vite + Vue` Starter-Template verwendet. Dies ist der modernste und effizienteste Weg, ein neues Vue.js-Projekt aufzusetzen. Es konfiguriert das Build-System, den Development-Server und die grundlegende Projektstruktur nach den besten Praktiken.

**Change Log:**

| Datum      | Version | Beschreibung      | Autor |
| :--------- | :------ | :---------------- | :---- |
| 16.09.2025 | 1.0     | Erster Entwurf | Winston (Architect) |

---

## 2. Frontend Tech Stack

| Kategorie           | Technologie                | Zweck                               | Rationale                                       |
| :------------------ | :------------------------- | :---------------------------------- | :---------------------------------------------- |
| **Framework**       | Vue.js (^3.0)              | Kern-Framework der UI               | Ihre Präferenz und vorhandene Expertise.        |
| **State Management**| Pinia (^2.0)               | Zentrales State Management          | Offizieller Standard für Vue 3, leichtgewichtig. |
| **Routing**         | vue-router (^4.0)          | Client-seitiges Routing             | Offizielle Routing-Bibliothek für Vue.js.       |
| **Build Tool**      | Vite (^4.0)                | Development-Server & Build-Prozess  | Schnell, modern, Standard für neue Vue-Projekte.|
| **Styling**         | Scoped CSS / SCSS          | Gekapselte Komponenten-Styles       | In Vue integriert, verhindert Stil-Konflikte.   |
| **Testing**         | Vitest + Testing Library   | Unit- & Komponenten-Tests           | Nahtlose Integration mit Vite, gute Test-Praktiken.|
| **Form Handling**   | (VeeValidate)              | Formular-Validierung (optional)     | Mächtige Bibliothek, falls benötigt.            |
| **Component Library**| (keine)                    | UI-Komponenten (optional)           | Für das MVP nicht zwingend erforderlich.        |

---

## 3. Projektstruktur

```plaintext
/
├── public/                # Statische Dateien, die nicht vom Build-Prozess verarbeitet werden
│   └── favicon.ico
├── src/                   # Der Quellcode unserer Anwendung
│   ├── assets/            # Globale Styles, Bilder, Schriftarten etc.
│   │   └── styles/
│   │       └── main.scss
│   ├── components/        # Wiederverwendbare Vue-Komponenten
│   │   ├── calculator/    # Komponenten speziell für den Rechner
│   │   │   ├── CalculatorInputForm.vue
│   │   │   └── CalculatorResultsTable.vue
│   │   └── common/        # Allgemeine, wiederverwendbare Komponenten (z.B. Buttons, Disclaimer)
│   │       └── AppDisclaimer.vue
│   ├── router/            # Konfiguration für das Client-seitige Routing
│   │   └── index.js
│   ├── services/          # Reine Geschäftslogik (z.B. die Berechnungs-Engine)
│   │   └── calculation.service.js
│   ├── stores/            # Pinia-Stores für das State Management
│   │   └── calculation.store.js
│   ├── types/             # TypeScript-Typ-Definitionen
│   │   └── index.ts
│   ├── views/             # Komponenten, die ganze Seiten repräsentieren
│   │   └── HomeView.vue
│   ├── App.vue            # Die Wurzel-Komponente der Anwendung
│   └── main.js            # Der Einstiegspunkt der Anwendung
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## 4. Komponenten-Standards

#### Komponenten-Template

```typescript
<script setup lang="ts">
import { ref, computed } from 'vue';

// === PROPS ===
interface Props {
  title: string;
  isDisabled?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  isDisabled: false,
});

// === EMITS ===
const emit = defineEmits<{
  (e: 'update:title', value: string): void;
}>();

// === STATE ===
const internalCounter = ref(0);

// === COMPUTED PROPERTIES ===
const formattedTitle = computed(() => `Title: ${props.title}`);

// === METHODS ===
function increment() {
  internalCounter.value++;
}

function handleTitleUpdate() {
  emit('update:title', 'New Title');
}
</script>

<template>
  <div class="my-component">
    <h2>{{ formattedTitle }}</h2>
    <p>Counter: {{ internalCounter }}</p>
    <button @click="increment" :disabled="props.isDisabled">Increment</button>
  </div>
</template>

<style scoped>
.my-component {
  border: 1px solid #ccc;
  padding: 16px;
}
</style>
```

#### Namenskonventionen

*   **Komponenten-Dateien:** `PascalCase.vue` (z.B. `CalculatorInputForm.vue`)
*   **Komponenten im Template:** `<PascalCase />` (z.B. `<CalculatorInputForm />`)
*   **Service-Dateien:** `camelCase.service.ts` (z.B. `calculation.service.ts`)
*   **Store-Dateien (Pinia):** `camelCase.store.ts` (z.B. `calculation.store.ts`)
*   **Composable-Dateien:** `useCamelCase.ts` (z.B. `useCalculation.ts`)
*   **Props & Variablen:** `camelCase`
*   **Custom Events (Emits):** `namespace:event-name` (z.B. `form:submit`)

---

## 5. State Management

#### Store-Struktur

```plaintext
src/
└── stores/
    ├── calculation.store.ts  # Store für alle Daten rund um die Berechnung
    └── ui.store.ts           # Optional: Store für globalen UI-Zustand (z.B. Ladezustand)
```

#### State-Management-Template

```typescript
import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import type { UserInput, CalculationResult } from '@/types';

export const useCalculationStore = defineStore('calculation', () => {
  // === STATE ===
  const userInput = ref<UserInput | null>(null);
  const results = ref<CalculationResult[] | null>(null);
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);

  // === GETTERS ===
  const hasResults = computed(() => results.value !== null && results.value.length > 0);

  // === ACTIONS ===
  function setUserInput(input: UserInput) {
    userInput.value = input;
    calculateResults();
  }

  async function calculateResults() {
    if (!userInput.value) return;

    isLoading.value = true;
    error.value = null;
    try {
      // results.value = await calculationService.calculate(userInput.value);
      await new Promise(resolve => setTimeout(resolve, 250)); 
      results.value = [ /* simulierte Ergebnisdaten */ ];
    } catch (e) {
      error.value = "Bei der Berechnung ist ein Fehler aufgetreten.";
    } finally {
      isLoading.value = false;
    }
  }

  return {
    userInput,
    results,
    isLoading,
    error,
    hasResults,
    setUserInput,
  };
});
```

---

## 6. API-Integration

Für das MVP finden alle Berechnungen client-seitig statt. Es wird keine externe API aufgerufen. Stattdessen definieren wir hier das Muster für interne **Services**, welche die Geschäftslogik kapseln.

#### Service-Template

```typescript
import type { UserInput, CalculationResult } from '@/types';

export class CalculationService {
  public async calculate(input: UserInput): Promise<CalculationResult[]> {
    console.log('Starte Berechnung mit:', input);
    // HIER FINDET DIE KOMPLETTE BERECHNUNGS-ENGINE STATT
    await new Promise(resolve => setTimeout(resolve, 50));
    const results: CalculationResult[] = [];
    console.log('Berechnung abgeschlossen. Ergebnisse:', results);
    return results;
  }
}
```

#### API-Client-Konfiguration

Nicht anwendbar für das MVP.

---

## 7. Routing

Die Konfiguration befindet sich in `src/router/index.js` und definiert alle "Seiten" unserer Anwendung.

```typescript
import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: {
      title: 'Renten-Nettorechner',
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title}` : 'Renten-Nettorechner';
  next();
});

export default router;
```

---

## 8. Styling-Richtlinien

Der Ansatz kombiniert `scoped CSS` in Komponenten mit einem globalen, variablen-basierten Theme in `src/assets/styles/main.scss`.

#### Globales Theme (CSS-Variablen)

```css
:root {
  /* Farben (Beispiel-Palette) */
  --color-primary: #007bff;
  --color-background: #ffffff;
  --color-surface: #f8f9fa;
  --color-text-primary: #212529;
  --color-text-secondary: #6c757d;
  --color-border: #dee2e6;

  /* Typografie */
  --font-family-base: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-size-base: 16px;

  /* Abstände */
  --spacing-md: 1rem;    /* 16px */

  /* Sonstiges */
  --border-radius: 0.25rem;
}
```

---

## 9. Anforderungen an das Testen

Der Ansatz basiert auf **Vitest** und der **Vue Testing Library**.

#### Komponenten-Test-Template

```typescript
import { render, fireEvent } from '@testing-library/vue';
import { describe, it, expect } from 'vitest';
import MyComponent from './MyComponent.vue';

describe('MyComponent', () => {
  it('sollte den initialen Zustand korrekt rendern', () => {
    const { getByText } = render(MyComponent, { props: { title: 'Hallo Welt' } });
    expect(getByText('Title: Hallo Welt')).toBeTruthy();
  });

  it('sollte bei einem Klick den Zähler erhöhen', async () => {
    const { getByText, getByRole } = render(MyComponent, { props: { title: 'Test' } });
    const button = getByRole('button', { name: /increment/i });
    await fireEvent.click(button);
    expect(getByText('Counter: 1')).toBeTruthy();
  });
});
```

#### Testing - Best Practices

*   **Unit-Tests:** Für die reine Geschäftslogik (`calculation.service.js`).
*   **Komponenten-Tests:** Testen aus der Sicht des Benutzers.
*   **Testabdeckung:** >80% für die Berechnungslogik.
*   **Arrange-Act-Assert:** Klare Strukturierung der Tests.
*   **Barrierefreiheit bevorzugen:** Elemente über Rollen und Labels finden.

---

## 10. Umgebungs-Konfiguration

Die Konfiguration erfolgt über `.env`-Dateien. Variablen für den Frontend-Code müssen mit `VITE_` beginnen.

**Beispiel für eine `.env`-Datei:**

```
# App-Titel, der im Browser-Tab angezeigt wird
VITE_APP_TITLE="Renten-Nettorechner"

# Die aktuelle Version der App
VITE_APP_VERSION="1.0.0"
```

---

## 11. Entwickler-Standards

#### Kritische Coding-Regeln

1.  **Einzige Wahrheitsquelle (Single Source of Truth):** Der Zustand wird ausschließlich im Pinia-Store verwaltet.
2.  **Logik gehört in Services:** Komplexe Geschäftslogik gehört in den `calculation.service.js`.
3.  **"Dumme" Komponenten:** Komponenten sind nur für die Darstellung und das Auslösen von Events zuständig.
4.  **Datenfluss von oben nach unten:** Daten fließen über Props, Änderungen werden über Events signalisiert.
5.  **Keine "Magic Strings":** Konstanten für Event-Namen etc. verwenden.
6.  **Typsicherheit ist Pflicht:** Alle Schnittstellen mit TypeScript typisieren.
7.  **Testen vor Implementieren (für Services):** Einen TDD-Ansatz für die Berechnungslogik verfolgen.
8.  **Barrierefreiheit zuerst:** Semantisches HTML verwenden.
