<script lang="ts">
  import {run} from 'svelte/legacy';
  import {getActiveEditor, getIsEditable} from '$lib/core/composerContext.js';
  import {getContext} from 'svelte';
  import type {Readable} from 'svelte/store';
  import {
    decreaseFontSize,
    increaseFontSize,
    MAX_ALLOWED_FONT_SIZE,
    MIN_ALLOWED_FONT_SIZE,
    updateFontSize,
  } from '$lib/core/commands/updateFontSize.js';
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

      updateFontSize($activeEditor, inputValueNumber);
    }
  }

  const handleInputBlur = () => {
    if (inputValue !== '' && inputChangeFlag) {
      const inputValueNumber = Number(inputValue);
      updateFontSize($activeEditor, inputValueNumber);
    }
  };
</script>

<button
  type="button"
  disabled={!isEditable ||
    ($selectionFontSize !== '' && Number(inputValue) <= MIN_ALLOWED_FONT_SIZE)}
  onclick={() => decreaseFontSize($activeEditor, Number(inputValue))}
  aria-label="Decrease font size"
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
  onclick={() => increaseFontSize($activeEditor, Number(inputValue))}
  aria-label="Increase font size"
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
