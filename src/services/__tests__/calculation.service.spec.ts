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
    };

    const results = await service.calculate(input);
    expect(results).toHaveLength(69);

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
    };

    const results = await service.calculate(input);
    const result24Months = results.find(r => r.monthsEarly === 24)!;
    const result0Months = results[0];

    expect(result24Months.monthsEarly).toBe(24);
    expect(result24Months.deductionEarlyRetirement).toBeCloseTo(2000 * 0.003 * 24);
    expect(result24Months.grossPension).toBeCloseTo(2000 * (1 - 0.003 * 24));
    expect(result24Months.netDifferenceToStandard).toBeCloseTo(result24Months.netPension - result0Months.netPension);
  });

  it('should calculate KV/PV contributions correctly', async () => {
    const input: UserInput = {
      birthday: '1970-01-01',
      expectedPension: 1000,
      currentPensionEntitlement: 900,
      statementDate: '2023-01-01',
    };

    const results = await service.calculate(input);
    const result0Months = results[0];

    const expectedKV = 1000 * (0.146 / 2 + 0.013 / 2); // Simplified
    const expectedPV = 1000 * (0.034); // Simplified

    expect(result0Months.kvContribution).toBeCloseTo(expectedKV);
    expect(result0Months.pvContribution).toBeCloseTo(expectedPV);
  });
});
