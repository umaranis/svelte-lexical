<script lang="ts">
  import ColorPicker from './ColorPicker.svelte';
  import DropDown from '../dropdown/DropDown.svelte';
  import {getIsEditable} from '$lib/core/composerContext.js';

  const isEditable = getIsEditable();

  export let buttonClassName: string;
  export let buttonIconClassName: string | undefined = undefined;
  export let buttonLabel: string | undefined = undefined;
  export let title;
  export let stopCloseOnClickSelf = true;
  export let color: string;
  export let onChange:
    | ((color: string, skipHistoryStack: boolean) => void)
    | undefined;
</script>

<DropDown
  {buttonClassName}
  {buttonIconClassName}
  {buttonLabel}
  {title}
  disabled={!isEditable}
  {stopCloseOnClickSelf}>
  <ColorPicker {color} {onChange} />
</DropDown>
