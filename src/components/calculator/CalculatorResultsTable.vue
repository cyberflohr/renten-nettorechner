<script setup lang="ts">
import type { CalculationResult } from '@/types';

interface Props {
  results: CalculationResult[];
}

const props = defineProps<Props>();

// Helper to format numbers as currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

// Helper to format percentage (for deduction)
const formatPercentage = (value: number) => {
  return new Intl.NumberFormat('de-DE', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
};
</script>

<template>
  <div class="results-table-container">
    <h2>Ihre Rentenberechnung</h2>
    <table>
      <thead>
        <tr>
          <th>Monate früher</th>
          <th>Brutto</th>
          <th>Abzug (vorzeitige Rente)</th>
          <th>PV-Beitrag</th>
          <th>KV-Beitrag</th>
          <th>Zu versteuerndes Einkommen</th>
          <th>Ertrags-anteil (%)</th>
          <th>Steuer</th>
          <th>Netto</th>
          <th>Break-Even Alter</th>
          <th>Netto-Differenz zu Standard</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(result, index) in props.results" :key="index">
          <td>{{ result.monthsEarly }}</td>
          <td>{{ formatCurrency(result.grossPension) }}</td>
          <td>{{ formatCurrency(result.deductionEarlyRetirement) }}</td>
          <td>{{ formatCurrency(result.pvContribution) }}</td>
          <td>{{ formatCurrency(result.kvContribution) }}</td>
          <td>{{ formatCurrency(result.taxableIncome) }}</td>
          <td>{{ result.taxationPercentage }} %</td>
          <td>{{ formatCurrency(result.tax) }}</td>
          <td>{{ formatCurrency(result.netPension) }}</td>
          <td>{{ result.breakEvenAge }}</td>
          <td>{{ formatCurrency(result.netDifferenceToStandard) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.results-table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: right;
}

th {
  background-color: #f2f2f2;
  font-weight: bold;
}

tr:nth-child(even) {
  background-color: #f9f9f9;
}
</style>
