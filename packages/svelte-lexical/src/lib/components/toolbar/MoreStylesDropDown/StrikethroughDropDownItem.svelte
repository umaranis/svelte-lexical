<script lang="ts">
  import DropDownItem from '$lib/components/generic/dropdown/DropDownItem.svelte';

  import {getActiveEditor} from '$lib/core/composerContext.js';
  import {FORMAT_TEXT_COMMAND} from 'lexical';
  import {getContext} from 'svelte';
  import type {Writable} from 'svelte/store';

  const activeEditor = getActiveEditor();

  const isStrikethrough: Writable<boolean> = getContext('isStrikethrough');
</script>

<DropDownItem
  onclick={() => {
    $activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
  }}
  class={'item ' + ($isStrikethrough ? 'active dropdown-item-active' : '')}
  title="Strikethrough"
  ariaLabel="Format text with a strikethrough">
  <i class="icon strikethrough"></i>
  <span class="text">Strikethrough</span>
</DropDownItem>
