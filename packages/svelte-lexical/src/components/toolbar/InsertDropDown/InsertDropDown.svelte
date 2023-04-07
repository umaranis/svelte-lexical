<script lang="ts">
  import {getIsEditable} from '../../../core/composerContext';
  import DropDown from '../../generic/dropdown/DropDown.svelte';

  const isEditable = getIsEditable();
</script>

<DropDown
  disabled={!$isEditable}
  buttonClassName="toolbar-item spaced"
  buttonLabel="Insert"
  buttonAriaLabel="Insert specialized editor node"
  buttonIconClassName="icon plus">
  <slot />
</DropDown>
