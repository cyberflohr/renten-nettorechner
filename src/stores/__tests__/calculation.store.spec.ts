import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useCalculationStore } from '../calculation.store';
import { CalculationService } from '@/services/calculation.service';
import type { UserInput, CalculationResult } from '@/types';

describe('Calculation Store', () => {
  let store: ReturnType<typeof useCalculationStore>;
  let calculationServiceSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useCalculationStore();
    // Mock the CalculationService to control its behavior in tests
    calculationServiceSpy = vi.spyOn(CalculationService.prototype, 'calculate');
  });

  it('should have correct initial state', () => {
    expect(store.userInput).toBeNull();
    expect(store.results).toBeNull();
    expect(store.isLoading).toBe(false);
    expect(store.error).toBeNull();
    expect(store.hasResults).toBe(false);
  });

  it('setUserInput should update userInput and trigger calculateResults', async () => {
    const input: UserInput = {
      birthday: '1990-01-01',
      expectedPension: 1000,
      taxClass: 'I',
      state: 'Berlin',
      churchTax: false,
      insuranceStatus: 'Standard',
    };

    // Mock the calculate method to return a predefined result
    const mockResults: CalculationResult[] = [{ monthsEarly: 0, grossPension: 1000, deductionEarlyRetirement: 0, pvContribution: 0, kvContribution: 0, tax: 0, netPension: 1000, breakEvenAge: 67 }];
    calculationServiceSpy.mockResolvedValue(mockResults);

    store.setUserInput(input);

    expect(store.userInput).toEqual(input);
    // Ensure calculate was called
    expect(calculationServiceSpy).toHaveBeenCalledWith(input);
    // Wait for the async action to complete
    await vi.waitFor(() => {
      expect(store.results).toEqual(mockResults);
      expect(store.isLoading).toBe(false);
    });
  });

  it('calculateResults should set isLoading and update results on success', async () => {
    const input: UserInput = {
      birthday: '1990-01-01',
      expectedPension: 1000,
      taxClass: 'I',
      state: 'Berlin',
      churchTax: false,
      insuranceStatus: 'Standard',
    };
    store.userInput = input; // Manually set userInput for this test

    const mockResults: CalculationResult[] = [{ monthsEarly: 0, grossPension: 1000, deductionEarlyRetirement: 0, pvContribution: 0, kvContribution: 0, tax: 0, netPension: 1000, breakEvenAge: 67 }];
    calculationServiceSpy.mockResolvedValue(mockResults);

    const promise = store.calculateResults();

    expect(store.isLoading).toBe(true);
    await promise; // Wait for the promise to resolve

    expect(store.results).toEqual(mockResults);
    expect(store.isLoading).toBe(false);
    expect(store.error).toBeNull();
  });

  it('calculateResults should set error on failure', async () => {
    const input: UserInput = {
      birthday: '1990-01-01',
      expectedPension: 1000,
      taxClass: 'I',
      state: 'Berlin',
      churchTax: false,
      insuranceStatus: 'Standard',
    };
    store.userInput = input; // Manually set userInput for this test

    const errorMessage = 'Calculation failed';
    calculationServiceSpy.mockRejectedValue(new Error(errorMessage));

    const promise = store.calculateResults();

    expect(store.isLoading).toBe(true);
    await promise; // Wait for the promise to resolve

    expect(store.results).toBeNull();
    expect(store.isLoading).toBe(false);
    expect(store.error).toBe(`Bei der Berechnung ist ein Fehler aufgetreten: ${errorMessage}`);
  });

  it('clearResults should clear results and error', () => {
    store.results = [{ monthsEarly: 0, grossPension: 100, deductionEarlyRetirement: 0, pvContribution: 0, kvContribution: 0, tax: 0, netPension: 100, breakEvenAge: 67 }];
    store.error = 'Some error';

    store.clearResults();

    expect(store.results).toBeNull();
    expect(store.error).toBeNull();
  });
});
