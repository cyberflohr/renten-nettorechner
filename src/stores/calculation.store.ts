import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import type { UserInput, CalculationResult } from '@/types';
import { CalculationService } from '@/services/calculation.service';

export const useCalculationStore = defineStore('calculation', () => {
  // === STATE ===
  const userInput = ref<UserInput | null>(null);
  const results = ref<CalculationResult[] | null>(null);
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);
  const statusMessage = ref<string | null>(null); // New: for status bar messages
  const statusType = ref<'success' | 'error' | 'info' | 'warning'>('info'); // New: for status bar type

  // === GETTERS ===
  const hasResults = computed(() => results.value !== null && results.value.length > 0);

  // === ACTIONS ===
  const calculationService = new CalculationService(); // Instantiate the service

  function setUserInput(input: UserInput) {
    userInput.value = input;
    calculateResults(); // Trigger calculation whenever input changes
  }

  async function calculateResults() {
    if (!userInput.value) {
      error.value = "Eingabedaten fehlen.";
      statusMessage.value = "Eingabedaten fehlen.";
      statusType.value = "error";
      return;
    }

    isLoading.value = true;
    error.value = null;
    statusMessage.value = null; // Clear previous status
    try {
      results.value = await calculationService.calculate(userInput.value);
      statusMessage.value = "Berechnung erfolgreich abgeschlossen.";
      statusType.value = "success";
    } catch (e: any) {
      error.value = "Bei der Berechnung ist ein Fehler aufgetreten: " + e.message;
      statusMessage.value = "Fehler bei der Berechnung: " + e.message;
      statusType.value = "error";
      results.value = null;
    } finally {
      isLoading.value = false;
    }
  }

  function clearResults() {
    results.value = null;
    error.value = null;
    statusMessage.value = null;
    statusType.value = "info";
  }

  // New action to set status messages from other components (e.g., form validation)
  function setStatus(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') {
    statusMessage.value = message;
    statusType.value = type;
  }

  return {
    userInput,
    results,
    isLoading,
    error,
    statusMessage,
    statusType,
    hasResults,
    setUserInput,
    calculateResults,
    clearResults,
    setStatus,
  };
});