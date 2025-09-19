export class LocalStorageService {
  private static readonly USER_INPUT_KEY = 'lastUserInput';
  private static readonly CALCULATION_RESULTS_KEY = 'lastCalculationResults';

  public static saveLastCalculation(userInput: any, results: any): void {
    try {
      localStorage.setItem(LocalStorageService.USER_INPUT_KEY, JSON.stringify(userInput));
      localStorage.setItem(LocalStorageService.CALCULATION_RESULTS_KEY, JSON.stringify(results));
      console.log('Calculation saved to Local Storage.');
    } catch (e) {
      console.error('Error saving to Local Storage:', e);
    }
  }

  public static loadLastCalculation(): { userInput: any | null; results: any | null } {
    try {
      const userInput = localStorage.getItem(LocalStorageService.USER_INPUT_KEY);
      const results = localStorage.getItem(LocalStorageService.CALCULATION_RESULTS_KEY);
      
      return {
        userInput: userInput ? JSON.parse(userInput) : null,
        results: results ? JSON.parse(results) : null,
      };
    } catch (e) {
      console.error('Error loading from Local Storage:', e);
      return { userInput: null, results: null };
    }
  }

  public static clearLastCalculation(): void {
    try {
      localStorage.removeItem(LocalStorageService.USER_INPUT_KEY);
      localStorage.removeItem(LocalStorageService.CALCULATION_RESULTS_KEY);
      console.log('Last calculation cleared from Local Storage.');
    } catch (e) {
      console.error('Error clearing Local Storage:', e);
    }
  }
}
