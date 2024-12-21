<script lang="ts">
  import {run} from 'svelte/legacy';

  import {$patchStyleText as patchStyleText} from '@lexical/selection';
  import {$getSelection as getSelection} from 'lexical';
  import {getActiveEditor, getIsEditable} from '$lib/core/composerContext.js';
  import {getContext} from 'svelte';
  import type {Readable} from 'svelte/store';

  const MIN_ALLOWED_FONT_SIZE = 8;
  const MAX_ALLOWED_FONT_SIZE = 72;
  const DEFAULT_FONT_SIZE = 15;

  enum updateFontSizeType {
    increment = 1,
    decrement,
  }

  let selectionFontSize: Readable<string> = getContext('fontSize');
  let isEditable = getIsEditable();

  let activeEditor = getActiveEditor();

  let inputValue: string;
  run(() => {
    inputValue = $selectionFontSize.slice(0, -2);
  });
  let inputChangeFlag = false;

  /**
   * Calculates the new font size based on the update type.
   * @param currentFontSize - The current font size
   * @param updateType - The type of change, either increment or decrement
   * @returns the next font size
   */
  function calculateNextFontSize(
    currentFontSize: number,
    updateType: updateFontSizeType | null,
  ) {
    if (!updateType) {
      return currentFontSize;
    }

    let updatedFontSize: number = currentFontSize;
    switch (updateType) {
      case updateFontSizeType.decrement:
        switch (true) {
          case currentFontSize > MAX_ALLOWED_FONT_SIZE:
            updatedFontSize = MAX_ALLOWED_FONT_SIZE;
            break;
          case currentFontSize >= 48:
            updatedFontSize -= 12;
            break;
          case currentFontSize >= 24:
            updatedFontSize -= 4;
            break;
          case currentFontSize >= 14:
            updatedFontSize -= 2;
            break;
          case currentFontSize >= 9:
            updatedFontSize -= 1;
            break;
          default:
            updatedFontSize = MIN_ALLOWED_FONT_SIZE;
            break;
        }
        break;

      case updateFontSizeType.increment:
        switch (true) {
          case currentFontSize < MIN_ALLOWED_FONT_SIZE:
            updatedFontSize = MIN_ALLOWED_FONT_SIZE;
            break;
          case currentFontSize < 12:
            updatedFontSize += 1;
            break;
          case currentFontSize < 20:
            updatedFontSize += 2;
            break;
          case currentFontSize < 36:
            updatedFontSize += 4;
            break;
          case currentFontSize <= 60:
            updatedFontSize += 12;
            break;
          default:
            updatedFontSize = MAX_ALLOWED_FONT_SIZE;
            break;
        }
        break;

      default:
        break;
    }
    return updatedFontSize;
  }

  /**
   * Patches the selection with the updated font size.
   */
  function updateFontSizeInSelection(
    newFontSize: string | null,
    updateType: updateFontSizeType | null,
  ) {
    const getNextFontSize = (prevFontSize: string | null): string => {
      if (!prevFontSize) {
        prevFontSize = `${DEFAULT_FONT_SIZE}px`;
      }
      prevFontSize = prevFontSize.slice(0, -2);
      const nextFontSize = calculateNextFontSize(
        Number(prevFontSize),
        updateType,
      );
      return `${nextFontSize}px`;
    };

    $activeEditor.update(() => {
      if ($activeEditor.isEditable()) {
        const selection = getSelection();
        if (selection !== null) {
          patchStyleText(selection, {
            'font-size': newFontSize || getNextFontSize,
          });
        }
      }
    });
  }

  function handleKeyPress(e: KeyboardEvent) {
    const inputValueNumber = Number(inputValue);

    if (['e', 'E', '+', '-'].includes(e.key) || isNaN(inputValueNumber)) {
      e.preventDefault();
      inputValue = '';
      return;
    }
    inputChangeFlag = true;
    if (e.key === 'Enter' || e.key === 'Tab' || e.key === 'Escape') {
      e.preventDefault();

      updateFontSizeByInputValue(inputValueNumber);
    }
  }

  const handleInputBlur = () => {
    if (inputValue !== '' && inputChangeFlag) {
      const inputValueNumber = Number(inputValue);
      updateFontSizeByInputValue(inputValueNumber);
    }
  };

  function handleButtonClick(updateType: updateFontSizeType) {
    if (inputValue !== '') {
      const nextFontSize = calculateNextFontSize(
        Number(inputValue),
        updateType,
      );
      updateFontSizeInSelection(String(nextFontSize) + 'px', null);
    } else {
      updateFontSizeInSelection(null, updateType);
    }
  }

  function updateFontSizeByInputValue(inputValueNumber: number) {
    let updatedFontSize = inputValueNumber;
    if (inputValueNumber > MAX_ALLOWED_FONT_SIZE) {
      updatedFontSize = MAX_ALLOWED_FONT_SIZE;
    } else if (inputValueNumber < MIN_ALLOWED_FONT_SIZE) {
      updatedFontSize = MIN_ALLOWED_FONT_SIZE;
    }

    inputValue = String(updatedFontSize);
    updateFontSizeInSelection(String(updatedFontSize) + 'px', null);
    inputChangeFlag = false;
  }
</script>

<button
  type="button"
  disabled={!isEditable ||
    ($selectionFontSize !== '' && Number(inputValue) <= MIN_ALLOWED_FONT_SIZE)}
  onclick={() => handleButtonClick(updateFontSizeType.decrement)}
  aria-label="Increase font size"
  class="toolbar-item sl_font-decrement">
  <i class="format sl_minus-icon"></i>
</button>

<input
  type="number"
  bind:value={inputValue}
  disabled={!$isEditable}
  class="toolbar-item sl_font-size-input"
  min={MIN_ALLOWED_FONT_SIZE}
  max={MAX_ALLOWED_FONT_SIZE}
  onkeydown={handleKeyPress}
  onblur={handleInputBlur} />

<button
  type="button"
  disabled={!isEditable ||
    ($selectionFontSize !== '' && Number(inputValue) >= MAX_ALLOWED_FONT_SIZE)}
  onclick={() => handleButtonClick(updateFontSizeType.increment)}
  aria-label="Decrease font size"
  class="toolbar-item sl_font-increment">
  <i class="format sl_add-icon"></i>
</button>

<style>
  input[type='number']::-webkit-outer-spin-button,
  input[type='number']::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type='number'] {
    appearance: textfield;
    -moz-appearance: textfield;
  }
</style>
