import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest';
import { render, fireEvent, cleanup } from '@testing-library/vue';
import CalculatorInputForm from '../CalculatorInputForm.vue';
import { createPinia, setActivePinia } from 'pinia';
import { useCalculationStore } from '@/stores/calculation.store';

describe('CalculatorInputForm', () => {
  let calculationStore: ReturnType<typeof useCalculationStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    calculationStore = useCalculationStore();
    // Spy on the setStatus method of the store
    vi.spyOn(calculationStore, 'setStatus');
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks(); // Restore all mocks after each test
  });

  it('renders all input fields correctly', () => {
    const { getByLabelText } = render(CalculatorInputForm);

    expect(getByLabelText('Geburtstag:')).toBeTruthy();
    expect(getByLabelText('Voraussichtliche Altersrente (monatlich in €):')).toBeTruthy();
    expect(getByLabelText('Bundesland:')).toBeTruthy();
    expect(getByLabelText('Kirchensteuerpflichtig')).toBeTruthy();
    expect(getByLabelText('Versichertenstatus:')).toBeTruthy();
    expect(getByLabelText('Gesetzlich (GKV)')).toBeTruthy();
    expect(getByLabelText('Privat (PKV)')).toBeTruthy();
  });

  it('updates formData when input values change', async () => {
    const { getByLabelText } = render(CalculatorInputForm);

    const pensionInput = getByLabelText('Voraussichtliche Altersrente (monatlich in €):') as HTMLInputElement;
    await fireEvent.update(pensionInput, '1500');
    expect(pensionInput.value).toBe('1500');
  });

  it('emits form:update event when input values change and validation passes', async () => {
    const { getByLabelText, emitted, container } = render(CalculatorInputForm);

    // Fill all required fields
    await fireEvent.update(getByLabelText('Geburtstag:'), '1970-01-01');
    await fireEvent.update(getByLabelText('Voraussichtliche Altersrente (monatlich in €):'), '1000');
    await fireEvent.update(getByLabelText('Bislang erreichte Rentenanwartschaft (monatlich in €):'), '0');
    await fireEvent.update(getByLabelText('Datum des Rentenbescheids:'), '2025-01-01');
    await fireEvent.change(container.querySelector('form') as HTMLFormElement);

    const emittedEvents = emitted()['form:update'] as any[];
    expect(emittedEvents).toBeTruthy();
    expect(emittedEvents[0][0]).toMatchObject({
      expectedPension: 1000,
    });
    expect(calculationStore.setStatus).toHaveBeenCalledWith('', 'info');
  });

  it('prevents form:update event when expectedPension is not positive and sets error status', async () => {
    const { getByLabelText, emitted, container } = render(CalculatorInputForm);

    const pensionInput = getByLabelText('Voraussichtliche Altersrente (monatlich in €):') as HTMLInputElement;
    await fireEvent.update(pensionInput, '0');
    await fireEvent.change(container.querySelector('form') as HTMLFormElement);

    expect(calculationStore.setStatus).toHaveBeenCalledWith('Die voraussichtliche Altersrente muss positiv sein.', 'error');
    expect(emitted()['form:update']).toBeFalsy();
  });
});