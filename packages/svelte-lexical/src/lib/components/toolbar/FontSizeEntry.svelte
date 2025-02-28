<script lang="ts">
  import {run} from 'svelte/legacy';
  import {getActiveEditor, getIsEditable} from '$lib/core/composerContext.js';
  import {getContext} from 'svelte';
  import type {Readable} from 'svelte/store';
  import {MAX_ALLOWED_FONT_SIZE, MIN_ALLOWED_FONT_SIZE} from './ToolbarData.js';
  import {
    updateFontSize,
    updateFontSizeInSelection,
    UpdateFontSizeType,
  } from '$lib/core/commands.js';
  import {SHORTCUTS} from './shortcuts.js';

  let selectionFontSize: Readable<string> = getContext('fontSize');
  let isEditable = getIsEditable();

  let activeEditor = getActiveEditor();

  let inputValue: string;
  run(() => {
    inputValue = $selectionFontSize.slice(0, -2);
  });
  let inputChangeFlag = false;

  function handleKeyPress(e: KeyboardEvent) {
    const inputValueNumber = Number(inputValue);

    if (e.key === 'Tab') {
      return;
    }
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

  function updateFontSizeByInputValue(inputValueNumber: number) {
    let updatedFontSize = inputValueNumber;
    if (inputValueNumber > MAX_ALLOWED_FONT_SIZE) {
      updatedFontSize = MAX_ALLOWED_FONT_SIZE;
    } else if (inputValueNumber < MIN_ALLOWED_FONT_SIZE) {
      updatedFontSize = MIN_ALLOWED_FONT_SIZE;
    }

    inputValue = String(updatedFontSize);
    updateFontSizeInSelection(
      $activeEditor,
      String(updatedFontSize) + 'px',
      null,
    );
    inputChangeFlag = false;
  }
</script>

<button
  type="button"
  disabled={!isEditable ||
    ($selectionFontSize !== '' && Number(inputValue) <= MIN_ALLOWED_FONT_SIZE)}
  onclick={() =>
    updateFontSize($activeEditor, UpdateFontSizeType.decrement, inputValue)}
  aria-label="Increase font size"
  class="toolbar-item sl_font-decrement"
  title={`Decrease font size (${SHORTCUTS.DECREASE_FONT_SIZE})`}>
  <i class="format sl_minus-icon"></i>
</button>

<input
  type="number"
  title="Font size"
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
  onclick={() =>
    updateFontSize($activeEditor, UpdateFontSizeType.increment, inputValue)}
  aria-label="Decrease font size"
  class="toolbar-item sl_font-increment"
  title={`Increase font size (${SHORTCUTS.INCREASE_FONT_SIZE})`}>
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
