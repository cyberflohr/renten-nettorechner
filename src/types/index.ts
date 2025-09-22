export interface UserInput {
  birthday: string; // YYYY-MM-DD
  expectedPension: number;
  currentPensionEntitlement: number; // New: Bislang erreichte Rentenanwartschaft
  statementDate: string; // New: Date of the pension statement (YYYY-MM-DD)
  hasChildren: boolean;
  churchTaxRate: number;
}

export interface CalculationResult {
  retirementDate: string; // New: Retirement start date
  monthsEarly: number;
  grossPension: number;
  deductionEarlyRetirement: number;
  pvContribution: number;
  kvContribution: number;
  tax: number;
  churchTax: number;
  netPension: number;
  breakEvenAge: number;
  netDifferenceToStandard: number; // New: Net difference to standard retirement (0 months early)
  taxableIncome: number; // New: Taxable income field added
  taxationPercentage: number; // Besteuerungsanteil bei Rentenbeginn in Prozent
}
