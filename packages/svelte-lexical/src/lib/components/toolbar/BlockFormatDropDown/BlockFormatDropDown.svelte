<script lang="ts">
  import {getIsEditable} from '$lib/core/composerContext.js';
  import {getContext} from 'svelte';
  import type {Writable} from 'svelte/store';
  import DropDown from '../../generic/dropdown/DropDown.svelte';
  import {blockTypeToBlockName} from './blockTypeToBlockName.js';

  const blockType: Writable<keyof typeof blockTypeToBlockName> =
    getContext('blockType');
  const isEditable = getIsEditable();
</script>

<DropDown
  disabled={!$isEditable}
  buttonClassName="toolbar-item block-controls"
  buttonIconClassName={'icon block-type ' + $blockType}
  buttonLabel={blockTypeToBlockName[$blockType]}
  buttonAriaLabel="Formatting options for text style">
  <slot />
</DropDown>
