<script lang="ts">
  import {getCommands} from '$lib/core/commands.js';
  import {getEditor} from '$lib/core/composerContext.js';
  import CloseCircleButton from '../../generic/button/CloseCircleButton.svelte';
  import ModalDialog from '../../generic/dialog/ModalDialog.svelte';
  import ColorPicker from './ColorPicker.svelte';

  export let color: string;
  export let title: string;
  let onChange:
    | ((value: string, skipHistoryStack: boolean) => void)
    | undefined;

  const editor = getEditor();

  export let showModal = false;
  export function open(onChangeCallback: (value: string) => void) {
    onChange = onChangeCallback;
    showModal = true;
  }

  function close() {
    showModal = false;
    getCommands().FocusEditor.execute(editor);
  }

  function onColorChange(value: string) {
    if (onChange) {
      onChange(value, true);
    }
    close();
  }
</script>

<ModalDialog bind:showModal>
  <CloseCircleButton on:click={close} />

  <div class="modal">
    <h2 class="Modal__title">{title}</h2>
    <div class="Modal__content">
      <ColorPicker {color} onChange={onColorChange} />
    </div>
  </div>
</ModalDialog>
