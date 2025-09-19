import { vi } from 'vitest';

// Stub window.alert globally for all tests
vi.stubGlobal('alert', vi.fn());
