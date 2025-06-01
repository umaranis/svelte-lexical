<script lang="ts">
  import {getActiveEditor} from '$lib/core/composerContext.js';
  import {getContext} from 'svelte';
  import DropdownColorPicker from '../generic/colorpicker/ColorPickerDropDown.svelte';
  import type {Writable} from 'svelte/store';
  import {$patchStyleText as patchStyleText} from '@lexical/selection';
  import {$getSelection as getSelection, HISTORIC_TAG} from 'lexical';

  const bgColor = getContext<Writable<string>>('bgColor');

  const activeEditor = getActiveEditor();

  const onBgColorSelect = (value: string, skipHistoryStack: boolean) => {
    applyStyleText({'background-color': value}, skipHistoryStack);
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
      skipHistoryStack ? {tag: HISTORIC_TAG} : {},
    );
  };
</script>

<DropdownColorPicker
  buttonClassName="toolbar-item color-picker"
  buttonIconClassName="icon bg-color"
  title="Background color"
  color={$bgColor}
  onChange={onBgColorSelect} />
