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
          <td data-label="Monate früher">{{ result.monthsEarly }}</td>
          <td data-label="Brutto">{{ formatCurrency(result.grossPension) }}</td>
          <td data-label="Abzug (vorzeitige Rente)">{{ formatCurrency(result.deductionEarlyRetirement) }}</td>
          <td data-label="PV-Beitrag">{{ formatCurrency(result.pvContribution) }}</td>
          <td data-label="KV-Beitrag">{{ formatCurrency(result.kvContribution) }}</td>
          <td data-label="Zu versteuerndes Einkommen">{{ formatCurrency(result.taxableIncome) }}</td>
          <td data-label="Ertrags-anteil (%)">{{ result.taxationPercentage }} %</td>
          <td data-label="Steuer">{{ formatCurrency(result.tax) }}</td>
          <td data-label="Netto">{{ formatCurrency(result.netPension) }}</td>
          <td data-label="Break-Even Alter">{{ result.breakEvenAge }}</td>
          <td data-label="Netto-Differenz zu Standard">{{ formatCurrency(result.netDifferenceToStandard) }}</td>
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

@media (max-width: 768px) {
  table, thead, tbody, th, td, tr {
    display: block;
  }

  thead tr {
    position: absolute;
    top: -9999px;
    left: -9999px;
  }

  tr {
    border: 1px solid #ccc;
    margin-bottom: 1rem;
  }

  td {
    border: none;
    border-bottom: 1px solid #eee;
    position: relative;
    padding-left: 50%;
    text-align: right;
  }

  td:before {
    position: absolute;
    top: 6px;
    left: 6px;
    width: 45%;
    padding-right: 10px;
    white-space: nowrap;
    content: attr(data-label);
    font-weight: bold;
    text-align: left;
  }
}
</style>
