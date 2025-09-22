import { describe, it, expect, beforeEach } from 'vitest';
import { CalculationService } from '../calculation.service';
import type { UserInput } from '@/types';

describe('CalculationService', () => {
  let service: CalculationService;

  beforeEach(() => {
    service = new CalculationService();
  });

  it('should calculate correctly for 0 months early retirement', async () => {
    const input: UserInput = {
      birthday: '1970-01-01',
      expectedPension: 2000,
      currentPensionEntitlement: 1800,
      statementDate: '2023-01-01',
      hasChildren: false,
      churchTaxRate: 0,
    };

    const results = await service.calculate(input);
    expect(results).toHaveLength(9);

    const result0Months = results[0];
    expect(result0Months.monthsEarly).toBe(0);
    expect(result0Months.grossPension).toBeCloseTo(2000);
    expect(result0Months.deductionEarlyRetirement).toBeCloseTo(0);
    expect(result0Months.kvContribution).toBeGreaterThan(0);
    expect(result0Months.pvContribution).toBeGreaterThan(0);
    expect(result0Months.tax).toBeGreaterThan(0);
    expect(result0Months.netPension).toBeLessThan(2000);
    expect(result0Months.netDifferenceToStandard).toBeCloseTo(0);
  });

  it('should apply correct deductions for 24 months early retirement', async () => {
    const input: UserInput = {
      birthday: '1970-01-01',
      expectedPension: 2000,
      currentPensionEntitlement: 1800,
      statementDate: '2023-01-01',
      hasChildren: false,
      churchTaxRate: 0,
    };

    const results = await service.calculate(input);
    const result24Months = results.find(r => r.monthsEarly === 24)!;
    const result0Months = results[0];

    expect(result24Months.monthsEarly).toBe(24);
    expect(result24Months.deductionEarlyRetirement).toBeCloseTo(2000 * 0.003 * 24);
    expect(result24Months.grossPension).toBeCloseTo(1827.6);
    expect(result24Months.netDifferenceToStandard).toBeCloseTo(result24Months.netPension - result0Months.netPension);
  });

  it('should calculate KV/PV contributions correctly', async () => {
    const input: UserInput = {
      birthday: '1970-01-01',
      expectedPension: 1000,
      currentPensionEntitlement: 900,
      statementDate: '2023-01-01',
      hasChildren: false,
      churchTaxRate: 0,
    };

    const results = await service.calculate(input);
    const result0Months = results[0];

    const expectedKV = 1000 * (0.146 / 2 + 0.016 / 2); // Updated
    const expectedPV = 1000 * (0.034); // Simplified

    expect(result0Months.kvContribution).toBeCloseTo(expectedKV);
    expect(result0Months.pvContribution).toBeCloseTo(expectedPV);
  });

  it('should calculate PV correctly with and without children', async () => {
    const inputWithChildren: UserInput = {
      birthday: '1970-01-01',
      expectedPension: 1000,
      currentPensionEntitlement: 900,
      statementDate: '2023-01-01',
      hasChildren: true,
      churchTaxRate: 0,
    };
    const resultsWithChildren = await service.calculate(inputWithChildren);
    const pvWithChildren = resultsWithChildren[0].pvContribution;

    const inputWithoutChildren: UserInput = {
      birthday: '1970-01-01',
      expectedPension: 1000,
      currentPensionEntitlement: 900,
      statementDate: '2023-01-01',
      hasChildren: false,
      churchTaxRate: 0,
    };
    const resultsWithoutChildren = await service.calculate(inputWithoutChildren);
    const pvWithoutChildren = resultsWithoutChildren[0].pvContribution;

    // Assuming 1000 gross pension
    expect(pvWithChildren).toBeCloseTo(1000 * 0.028);
    expect(pvWithoutChildren).toBeCloseTo(1000 * 0.034);
    expect(pvWithChildren).toBeLessThan(pvWithoutChildren);
  });

  it('should calculate church tax correctly with 9% rate', async () => {
    const inputChurchTaxPayer: UserInput = {
      birthday: '1970-01-01',
      expectedPension: 2000,
      currentPensionEntitlement: 1800,
      statementDate: '2023-01-01',
      hasChildren: false,
      churchTaxRate: 0.09,
    };
    const resultsChurchTaxPayer = await service.calculate(inputChurchTaxPayer);
    const resultChurchTaxPayer = resultsChurchTaxPayer[0];

    expect(resultChurchTaxPayer.churchTax).toBeCloseTo(resultChurchTaxPayer.tax * 0.09);
    expect(resultChurchTaxPayer.netPension).toBeCloseTo(1643.28);
  });

  it('should calculate church tax correctly with 8% rate', async () => {
    const inputChurchTaxPayer: UserInput = {
      birthday: '1970-01-01',
      expectedPension: 2000,
      currentPensionEntitlement: 1800,
      statementDate: '2023-01-01',
      hasChildren: false,
      churchTaxRate: 0.08,
    };
    const resultsChurchTaxPayer = await service.calculate(inputChurchTaxPayer);
    const resultChurchTaxPayer = resultsChurchTaxPayer[0];

    expect(resultChurchTaxPayer.churchTax).toBeCloseTo(resultChurchTaxPayer.tax * 0.08);
    expect(resultChurchTaxPayer.netPension).toBeCloseTo(1644.45);
  });

  it('should not calculate church tax if churchTaxRate is 0', async () => {
    const inputNoChurchTax: UserInput = {
      birthday: '1970-01-01',
      expectedPension: 2000,
      currentPensionEntitlement: 1800,
      statementDate: '2023-01-01',
      hasChildren: false,
      churchTaxRate: 0,
    };
    const resultsNoChurchTax = await service.calculate(inputNoChurchTax);
    const resultNoChurchTax = resultsNoChurchTax[0];

    expect(resultNoChurchTax.churchTax).toBeCloseTo(0);
    expect(resultNoChurchTax.netPension).toBeCloseTo(resultNoChurchTax.grossPension - resultNoChurchTax.kvContribution - resultNoChurchTax.pvContribution - resultNoChurchTax.tax);
  });
});
