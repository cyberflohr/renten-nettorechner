<script setup lang="ts">
import type { CalculationResult } from '@/types';
import { formatCurrency, formatPercentage } from '@/utils/formatters';

interface Props {
  results: CalculationResult[];
}

defineProps<Props>();
</script>

<template>
  <div class="results-table-container">
    <h2>Ihre Rentenberechnung</h2>
    <table>
      <thead>
        <tr>
          <th>Monate früher</th>
          <th>Brutto-rente</th>
          <th>Frührenten-abschlag</th>
          <th>PV-Beitrag</th>
          <th>KV-Beitrag</th>
          <th>Zu versteuerndes-Einkommen</th>
          <th>Besteuerungs-anteil</th>
          <th>Steuer</th>
          <th>Netto-rente</th>
          <th>Break-Even Alter</th>
          <th>Netto-differenz</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(result, index) in results" :key="index">
          <td data-label="Monate früher">{{ result.monthsEarly }}</td>
          <td data-label="Brutto-rente">{{ formatCurrency(result.grossPension) }}</td>
          <td data-label="Frührenten-abschlag">{{ formatCurrency(result.deductionEarlyRetirement) }}</td>
          <td data-label="PV-Beitrag">{{ formatCurrency(result.pvContribution) }}</td>
          <td data-label="KV-Beitrag">{{ formatCurrency(result.kvContribution) }}</td>
          <td data-label="Zu versteuerndes-Einkommen">{{ formatCurrency(result.taxableIncome) }}</td>
          <td data-label="Besteuerungs-anteil">{{ result.taxationPercentage }} %</td>
          <td data-label="Steuer">{{ formatCurrency(result.tax) }}</td>
          <td data-label="Netto-rente">{{ formatCurrency(result.netPension) }}</td>
          <td data-label="Break-Even Alter">{{ result.breakEvenAge }}</td>
          <td data-label="Netto-differenz">{{ formatCurrency(result.netDifferenceToStandard) }}</td>
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
