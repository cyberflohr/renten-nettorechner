import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { LocalStorageService } from '../local-storage.service';

describe('LocalStorageService', () => {
  // Mock localStorage before each test
  const localStorageMock = (() => {
    let store: { [key: string]: string } = {};
    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value.toString();
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
    };
  })();

  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
  });

  beforeEach(() => {
    localStorageMock.clear(); // Clear localStorage before each test
  });

  it('saveLastCalculation should store data in localStorage', () => {
    const mockUserInput = { birthday: '1990-01-01', expectedPension: 1000 };
    const mockResults = [{ monthsEarly: 0, netPension: 800 }];

    LocalStorageService.saveLastCalculation(mockUserInput, mockResults);

    expect(localStorageMock.getItem('lastUserInput')).toBe(JSON.stringify(mockUserInput));
    expect(localStorageMock.getItem('lastCalculationResults')).toBe(JSON.stringify(mockResults));
  });

  it('loadLastCalculation should retrieve data from localStorage', () => {
    const mockUserInput = { birthday: '1990-01-01', expectedPension: 1000 };
    const mockResults = [{ monthsEarly: 0, netPension: 800 }];

    localStorageMock.setItem('lastUserInput', JSON.stringify(mockUserInput));
    localStorageMock.setItem('lastCalculationResults', JSON.stringify(mockResults));

    const { userInput, results } = LocalStorageService.loadLastCalculation();

    expect(userInput).toEqual(mockUserInput);
    expect(results).toEqual(mockResults);
  });

  it('loadLastCalculation should return null if no data is found', () => {
    const { userInput, results } = LocalStorageService.loadLastCalculation();

    expect(userInput).toBeNull();
    expect(results).toBeNull();
  });

  it('clearLastCalculation should remove data from localStorage', () => {
    const mockUserInput = { birthday: '1990-01-01', expectedPension: 1000 };
    const mockResults = [{ monthsEarly: 0, netPension: 800 }];

    localStorageMock.setItem('lastUserInput', JSON.stringify(mockUserInput));
    localStorageMock.setItem('lastCalculationResults', JSON.stringify(mockResults));

    LocalStorageService.clearLastCalculation();

    expect(localStorageMock.getItem('lastUserInput')).toBeNull();
    expect(localStorageMock.getItem('lastCalculationResults')).toBeNull();
  });
});
