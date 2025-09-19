import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/vue';
import CalculatorResultsTable from '../CalculatorResultsTable.vue';
import type { CalculationResult } from '@/types';

describe('CalculatorResultsTable', () => {
  afterEach(() => {
    cleanup();
  });

  const mockResults: CalculationResult[] = [
    {
      monthsEarly: 0,
      grossPension: 2000,
      deductionEarlyRetirement: 0,
      pvContribution: 34,
      kvContribution: 162,
      tax: 125.3,
      netPension: 1678.7,
      breakEvenAge: 67,
      netDifferenceToStandard: 0, // Standard case
    },
    {
      monthsEarly: 24,
      grossPension: 1856,
      deductionEarlyRetirement: 144,
      pvContribution: 31.55,
      kvContribution: 150.34,
      tax: 107.12,
      netPension: 1567,
      breakEvenAge: 71,
      netDifferenceToStandard: -111.7, // 1567 - 1678.7
    },
  ];

  it('renders correctly with no results', () => {
    const { queryByText } = render(CalculatorResultsTable, { props: { results: [] } });
    expect(queryByText('Ihre Rentenberechnung')).toBeTruthy();
    expect(queryByText('Monate früher')).toBeTruthy(); // Check for header
    expect(queryByText('2.000,00 €')).toBeNull(); // No data rows
  });

  it('renders correctly with a single result', () => {
  const { getByText, getAllByText } = render(CalculatorResultsTable, { props: { results: [mockResults[0]] } });

  expect(getByText('0')).toBeTruthy(); // monthsEarly
  expect(getByText('2.000,00 €')).toBeTruthy(); // grossPension
  expect(getAllByText('0,00 €').length).toBeGreaterThan(0); // deductionEarlyRetirement or netDifferenceToStandard
  expect(getByText('34,00 €')).toBeTruthy(); // pvContribution
  expect(getByText('162,00 €')).toBeTruthy(); // kvContribution
  expect(getByText('125,30 €')).toBeTruthy(); // tax
  expect(getByText('1.678,70 €')).toBeTruthy(); // netPension
  expect(getByText('67')).toBeTruthy(); // breakEvenAge
  });

  it('renders correctly with multiple results', () => {
  const { getByText, getAllByText } = render(CalculatorResultsTable, { props: { results: mockResults } });

    // Check first row
  expect(getByText('0')).toBeTruthy();
  expect(getByText('2.000,00 €')).toBeTruthy();
  expect(getAllByText('0,00 €').length).toBeGreaterThan(0); // netDifferenceToStandard for 0 months

  // Check second row
  expect(getByText('24')).toBeTruthy();
  expect(getByText('1.856,00 €')).toBeTruthy();
  expect(getByText('144,00 €')).toBeTruthy();
  expect(getByText('31,55 €')).toBeTruthy();
  expect(getByText('150,34 €')).toBeTruthy();
  expect(getByText('107,12 €')).toBeTruthy();
  expect(getByText('1.567,00 €')).toBeTruthy();
  expect(getByText('71')).toBeTruthy();
  expect(getByText('-111,70 €')).toBeTruthy(); // netDifferenceToStandard for 24 months
  });
});