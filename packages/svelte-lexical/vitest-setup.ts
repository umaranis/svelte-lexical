import '@testing-library/svelte/vitest';
import '@testing-library/jest-dom/vitest';

import {beforeAll, vi} from 'vitest';

beforeAll(() => {
  // jsdom doens't support html dialog yet - https://github.com/jsdom/jsdom/issues/3294
  HTMLDialogElement.prototype.show = vi.fn();
  HTMLDialogElement.prototype.showModal = vi.fn();
  HTMLDialogElement.prototype.close = vi.fn();
});
