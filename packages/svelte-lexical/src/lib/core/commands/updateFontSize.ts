import {$getSelection, type LexicalEditor} from 'lexical';
import {$patchStyleText} from '@lexical/selection';

export const MIN_ALLOWED_FONT_SIZE = 8;
export const MAX_ALLOWED_FONT_SIZE = 72;
export const DEFAULT_FONT_SIZE = 15;

function parseFontSize(input: string): [number, string] | null {
  const match = input.match(/^(\d+(?:\.\d+)?)(px|pt)$/);
  return match ? [Number(match[1]), match[2]] : null;
}

function normalizeToPx(fontSize: number, unit: string): number {
  return unit === 'pt' ? Math.round((fontSize * 4) / 3) : fontSize;
}

function isValidFontSize(fontSizePx: number): boolean {
  return (
    fontSizePx >= MIN_ALLOWED_FONT_SIZE && fontSizePx <= MAX_ALLOWED_FONT_SIZE
  );
}

export function parseFontSizeForToolbar(input: string): string {
  const parsed = parseFontSize(input);
  if (!parsed) {
    return '';
  }

  const [fontSize, unit] = parsed;
  const fontSizePx = normalizeToPx(fontSize, unit);
  return `${fontSizePx}px`;
}

export function parseAllowedFontSize(input: string): string {
  const parsed = parseFontSize(input);
  if (!parsed) {
    return '';
  }

  const [fontSize, unit] = parsed;
  const fontSizePx = normalizeToPx(fontSize, unit);
  return isValidFontSize(fontSizePx) ? input : '';
}

export function increaseFontSize(
  editor: LexicalEditor,
  currentFontSize: number,
) {
  const nextFontSize = calculateFontSizeIncrement(currentFontSize);
  updateFontSize(editor, nextFontSize);
}

export function decreaseFontSize(
  editor: LexicalEditor,
  currentFontSize: number,
) {
  const nextFontSize = calculateFontSizeDecrement(currentFontSize);
  updateFontSize(editor, nextFontSize);
}

export function updateFontSize(editor: LexicalEditor, newFontSize: number) {
  if (newFontSize > MAX_ALLOWED_FONT_SIZE) {
    newFontSize = MAX_ALLOWED_FONT_SIZE;
  } else if (newFontSize < MIN_ALLOWED_FONT_SIZE) {
    newFontSize = MIN_ALLOWED_FONT_SIZE;
  }

  const newFontSizeString = `${newFontSize}px`;
  editor.update(() => {
    if (editor.isEditable()) {
      const selection = $getSelection();
      if (selection !== null) {
        $patchStyleText(selection, {
          'font-size': newFontSizeString,
        });
      }
    }
  });
}

function calculateFontSizeDecrement(currentFontSize: number): number {
  switch (true) {
    case currentFontSize > MAX_ALLOWED_FONT_SIZE:
      return MAX_ALLOWED_FONT_SIZE;
    case currentFontSize >= 48:
      return (currentFontSize -= 12);
    case currentFontSize >= 24:
      return (currentFontSize -= 4);
    case currentFontSize >= 14:
      return (currentFontSize -= 2);
    case currentFontSize >= 9:
      return (currentFontSize -= 1);
    default:
      return (currentFontSize = MIN_ALLOWED_FONT_SIZE);
  }
}

function calculateFontSizeIncrement(currentFontSize: number): number {
  switch (true) {
    case currentFontSize < MIN_ALLOWED_FONT_SIZE:
      return MIN_ALLOWED_FONT_SIZE;
    case currentFontSize < 12:
      return (currentFontSize += 1);
    case currentFontSize < 20:
      return (currentFontSize += 2);
    case currentFontSize < 36:
      return (currentFontSize += 4);
    case currentFontSize <= 60:
      return (currentFontSize += 12);
    default:
      return MAX_ALLOWED_FONT_SIZE;
  }
}
