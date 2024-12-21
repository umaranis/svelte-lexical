<script lang="ts">
  import {getIsEditable} from '$lib/core/composerContext.js';
  import DropDown from '$lib/components/generic/dropdown/DropDown.svelte';
  interface Props {
    children?: import('svelte').Snippet;
  }

  let {children}: Props = $props();

  const isEditable = getIsEditable();
</script>

<DropDown
  disabled={!$isEditable}
  buttonClassName="toolbar-item spaced"
  buttonLabel=""
  buttonAriaLabel="Formatting options for additional text styles"
  buttonIconClassName="icon dropdown-more">
  {@render children?.()}
</DropDown>
