<script setup lang="ts">
import CalculatorInputForm from '../components/calculator/CalculatorInputForm.vue';
import CalculatorResultsTable from '../components/calculator/CalculatorResultsTable.vue';
import AppDisclaimer from '../components/common/AppDisclaimer.vue';
import AppStatusBar from '../components/common/AppStatusBar.vue'; // Import AppStatusBar

import { useCalculationStore } from '../stores/calculation.store';
import type { UserInput } from '@/types';
import { LocalStorageService } from '@/services/local-storage.service';
import { onMounted } from 'vue';

const calculationStore = useCalculationStore();

// Handle form updates: pass data to the store
const handleFormUpdate = (formData: UserInput) => {
  calculationStore.setUserInput(formData);
};

// Save current calculation to local storage
const saveCalculation = () => {
  if (calculationStore.userInput && calculationStore.results) {
    LocalStorageService.saveLastCalculation(calculationStore.userInput, calculationStore.results);
    calculationStore.setStatus('Berechnung erfolgreich gespeichert!', 'success'); // Use setStatus
  } else {
    calculationStore.setStatus('Keine Berechnung zum Speichern vorhanden.', 'warning'); // Use setStatus
  }
};

// Load last calculation from local storage
const loadCalculation = () => {
  const { userInput, results } = LocalStorageService.loadLastCalculation();
  if (userInput && results) {
    calculationStore.setUserInput(userInput); // This will also trigger recalculation
    calculationStore.setStatus('Letzte Berechnung geladen!', 'info'); // Use setStatus
  } else {
    calculationStore.setStatus('Keine gespeicherte Berechnung gefunden.', 'warning'); // Use setStatus
  }
};

// Load last calculation on component mount (AC4)
onMounted(() => {
  loadCalculation();
});
</script>

<template>
  <div id="app-layout">
    <header>
      <h1>Renten-Nettorechner</h1>
    </header>

    <AppStatusBar :message="calculationStore.statusMessage" :type="calculationStore.statusType" /> <!-- Moved here -->

    <main>
      <div class="input-form-container" data-testid="calculator-input-form">
  <CalculatorInputForm :userInput="calculationStore.userInput" @form:update="handleFormUpdate" />
        <div class="form-actions">
          <button @click="saveCalculation">Berechnung speichern</button>
          <button @click="loadCalculation">Letzte Berechnung laden</button>
        </div>
      </div>
      
      <div class="results-container">
        <h2 v-if="calculationStore.isLoading">Berechne Ergebnisse...</h2>
        <h2 v-else-if="calculationStore.error" class="error-message">{{ calculationStore.error }}</h2>
        <CalculatorResultsTable
          v-else-if="calculationStore.hasResults"
          :results="calculationStore.results!"
        />
        <div v-else class="placeholder-container">
          <h2>Ergebnistabelle (Platzhalter)</h2>
          <p>Geben Sie Ihre Daten ein, um die Rentenberechnung zu starten.</p>
        </div>
      </div>
    </main>

    <footer>
      <AppDisclaimer />
    </footer>
  </div>
</template>

<style scoped>
#app-layout {
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem;
  font-family: sans-serif;
}

header, footer {
  text-align: center;
  margin-bottom: 2rem;
}

main {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 768px) {
  main {
    grid-template-columns: 1fr 1fr;
  }
}

.input-form-container, .results-container {
  border: 2px solid #ccc;
  padding: 1rem;
  border-radius: 8px;
  background-color: #f9f9f9;
  width: 100%;
  box-sizing: border-box;
}

.error-message {
  color: red;
  width: 100%;
  max-width: 600px;
  box-sizing: border-box;
}

.form-actions {
  margin-top: 1rem;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.form-actions button {
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.form-actions button:hover {
  background-color: #0056b3;
}

@media (max-width: 768px) {
  #app-layout {
    padding: 1rem;
  }

  h1 {
    font-size: 1.5rem;
  }

  .form-actions {
    flex-direction: column;
    align-items: center;
  }

  .form-actions button {
    width: 100%;
  }
}
</style>