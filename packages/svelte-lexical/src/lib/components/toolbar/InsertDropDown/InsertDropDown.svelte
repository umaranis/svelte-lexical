<script lang="ts">
  import {getIsEditable} from '$lib/core/composerContext.js';
  import DropDown from '../../generic/dropdown/DropDown.svelte';
  interface Props {
    children?: import('svelte').Snippet;
  }

  let {children}: Props = $props();

  const isEditable = getIsEditable();
</script>

<DropDown
  disabled={!$isEditable}
  buttonClassName="toolbar-item spaced"
  buttonLabel="Insert"
  buttonAriaLabel="Insert specialized editor node"
  buttonIconClassName="icon plus">
  {@render children?.()}
</DropDown>
