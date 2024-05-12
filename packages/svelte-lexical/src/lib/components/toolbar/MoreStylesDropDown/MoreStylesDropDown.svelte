<script lang="ts">
  import {getIsEditable} from '$lib/core/composerContext.js';
  import DropDown from '$lib/components/generic/dropdown/DropDown.svelte';

  const isEditable = getIsEditable();
</script>

<DropDown
  disabled={!$isEditable}
  buttonClassName="toolbar-item spaced"
  buttonLabel=""
  buttonAriaLabel="Formatting options for additional text styles"
  buttonIconClassName="icon dropdown-more">
  <slot />
</DropDown>
