import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest'; // Import vi
import { render, cleanup } from '@testing-library/vue';
import HomeView from '../HomeView.vue';
import { createPinia } from 'pinia';

describe('HomeView', () => {
  let pinia: ReturnType<typeof createPinia>;
  const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {}); // Mock alert

  beforeEach(() => {
    pinia = createPinia();
  });

  afterEach(() => {
    cleanup();
    alertMock.mockRestore(); // Restore alert
  });

  it('renders the main title correctly', () => {
    const { getByText } = render(HomeView, {
      global: {
        plugins: [pinia],
      },
    });
    expect(getByText('Renten-Nettorechner')).toBeTruthy();
  });

  it('renders the input form component', () => {
    const { getByTestId } = render(HomeView, {
      global: {
        plugins: [pinia],
      },
    });
    expect(getByTestId('calculator-input-form')).toBeTruthy();
  });

  it('renders the results table placeholder initially', () => {
    const { getByText } = render(HomeView, {
      global: {
        plugins: [pinia],
      },
    });
    expect(getByText('Ergebnistabelle (Platzhalter)')).toBeTruthy();
  });

  it('renders the disclaimer', () => {
    const { getByText } = render(HomeView, {
      global: {
        plugins: [pinia],
      },
    });
    expect(getByText(/Wichtiger Hinweis:/)).toBeTruthy();
  });
});
