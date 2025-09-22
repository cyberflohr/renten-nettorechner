<script setup lang="ts">
import { reactive, watch } from 'vue';
import type { UserInput } from '@/types';
import { useCalculationStore } from '@/stores/calculation.store'; // Import the store

const calculationStore = useCalculationStore(); // Use the store
const { setStatus } = calculationStore; // Destructure setStatus directly

// Accept userInput from parent for restore
const props = defineProps<{ userInput: UserInput | null }>();
// Define the initial state for the form
const formData: UserInput = reactive({
  birthday: '',
  expectedPension: 0,
  currentPensionEntitlement: 0, // New field
  statementDate: '', // New field
});

// Watch for changes from parent and update formData
watch(() => props.userInput, (newInput) => {
  if (newInput) {
    Object.assign(formData, newInput);
  }
});

// List of German states for the select input
const germanStates = [
  'Baden-Württemberg', 'Bayern', 'Berlin', 'Brandenburg', 'Bremen', 'Hamburg',
  'Hessen', 'Mecklenburg-Vorpommern', 'Niedersachsen', 'Nordrhein-Westfalen',
  'Rheinland-Pfalz', 'Saarland', 'Sachsen', 'Sachsen-Anhalt',
  'Schleswig-Holstein', 'Thüringen'
];

// Emit the form data when it changes (e.g., for real-time calculation)
const emit = defineEmits<{
  (e: 'form:update', payload: UserInput): void;
}>();

// Basic validation (e.g., check if expectedPension is positive)
// healthInsuranceType is always 'KdVR', no select needed
const validateForm = () => {
  if (formData.expectedPension <= 0) {
    setStatus('Die voraussichtliche Altersrente muss positiv sein.', 'error'); // Use setStatus
    return false;
  }
  if (formData.currentPensionEntitlement < 0) {
    setStatus('Die bislang erreichte Rentenanwartschaft darf nicht negativ sein.', 'error');
    return false;
  }
  if (!formData.birthday) {
    setStatus('Bitte geben Sie Ihr Geburtsdatum ein.', 'error');
    return false;
  }
  if (!formData.statementDate) {
    setStatus('Bitte geben Sie das Datum des Rentenbescheids ein.', 'error');
    return false;
  }
  // Add more validation rules here
  setStatus('', 'info'); // Clear previous error if validation passes
  return true;
};

// Example of how to trigger an emit (e.g., on blur or change)
const handleInputChange = () => {
  if (validateForm()) {
    emit('form:update', formData);
  }
};
</script>

<template>
  <form @change="handleInputChange" role="form">
    <div class="form-group">
      <label for="birthday">Geburtstag:</label>
      <input type="date" id="birthday" v-model="formData.birthday" required />
    </div>

    <div class="form-group">
      <label for="currentPensionEntitlement">Bislang erreichte Rentenanwartschaft (monatlich in €):</label>
      <input type="number" id="currentPensionEntitlement" v-model.number="formData.currentPensionEntitlement" required min="0" />
    </div>

    <div class="form-group">
      <label for="expectedPension">Voraussichtliche Altersrente (monatlich in €):</label>
      <input type="number" id="expectedPension" v-model.number="formData.expectedPension" required min="0" />
    </div>

    <div class="form-group">
      <label for="statementDate">Datum des Rentenbescheids:</label>
      <input type="date" id="statementDate" v-model="formData.statementDate" required />
    </div>

  </form>
</template>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.form-group {
  margin-bottom: 1rem;
  width: 100%;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  text-align: left;
}

input[type="date"],
input[type="number"],
select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}
</style>