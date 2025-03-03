<script lang="ts">
  import {getActiveEditor} from '$lib/core/composerContext.js';
  import {getContext} from 'svelte';
  import DropdownColorPicker from '../generic/colorpicker/ColorPickerDropDown.svelte';
  import type {Writable} from 'svelte/store';
  import {$patchStyleText as patchStyleText} from '@lexical/selection';
  import {$getSelection as getSelection} from 'lexical';

  const fontColor = getContext<Writable<string>>('fontColor');

  const activeEditor = getActiveEditor();

  const onFontColorSelect = (value: string, skipHistoryStack: boolean) => {
    applyStyleText({color: value}, skipHistoryStack);
  };

  const applyStyleText = (
    styles: Record<string, string>,
    skipHistoryStack?: boolean,
  ) => {
    $activeEditor.update(
      () => {
        const selection = getSelection();
        if (selection !== null) {
          patchStyleText(selection, styles);
        }
      },
      skipHistoryStack ? {tag: 'historic'} : {},
    );
  };
</script>

<DropdownColorPicker
  buttonClassName="toolbar-item color-picker"
  buttonIconClassName="icon font-color"
  buttonAriaLabel="Formatting text color"
  title="Text color"
  color={$fontColor}
  onChange={onFontColorSelect} />
