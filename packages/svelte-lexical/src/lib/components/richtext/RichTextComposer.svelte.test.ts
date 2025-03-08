import {expect, test} from 'vitest';
import {render} from '@testing-library/svelte';
import '@testing-library/jest-dom/vitest';
//import userEvent from '@testing-library/user-event'

import RichTextComposer from './RichTextComposer.svelte';

test('have Bold button in toolbar', () => {
  const {getByLabelText} = render(RichTextComposer, {});

  expect(
    getByLabelText('Format text as bold. Shortcut: Ctrl+B'),
  ).toBeInTheDocument();
});
