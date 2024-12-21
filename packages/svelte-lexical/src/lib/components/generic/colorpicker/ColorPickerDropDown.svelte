<script lang="ts">
  import ColorPicker from './ColorPicker.svelte';
  import DropDown from '../dropdown/DropDown.svelte';
  import {getIsEditable} from '$lib/core/composerContext.js';

  const isEditable = getIsEditable();

  interface Props {
    buttonClassName: string;
    buttonIconClassName?: string | undefined;
    buttonLabel?: string | undefined;
    title: string | undefined;
    stopCloseOnClickSelf?: boolean;
    color: string;
    onChange: ((color: string, skipHistoryStack: boolean) => void) | undefined;
  }

  let {
    buttonClassName,
    buttonIconClassName = undefined,
    buttonLabel = undefined,
    title,
    stopCloseOnClickSelf = true,
    color,
    onChange,
  }: Props = $props();
</script>

<DropDown
  {buttonClassName}
  {buttonIconClassName}
  {buttonLabel}
  {title}
  disabled={!$isEditable}
  {stopCloseOnClickSelf}>
  <ColorPicker {color} {onChange} />
</DropDown>
