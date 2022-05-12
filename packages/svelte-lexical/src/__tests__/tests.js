/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { render, fireEvent } from '@testing-library/svelte';
import RichTextBasicComposer from '../components/richtext-basic/RichTextBasicComposer.svelte';

test('have Bold button in toolbar', () => {
  const { getByLabelText } = render(RichTextBasicComposer, { theme: null });

  expect(getByLabelText('Format Bold')).toBeInTheDocument();
});
