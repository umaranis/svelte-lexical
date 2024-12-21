<script lang="ts">
  import DropDownItem from '$lib/components/generic/dropdown/DropDownItem.svelte';
  import {getActiveEditor} from '$lib/core/composerContext.js';
  import {FORMAT_TEXT_COMMAND} from 'lexical';
  import {getContext} from 'svelte';
  import type {Writable} from 'svelte/store';

  const activeEditor = getActiveEditor();

  const isSubscript: Writable<boolean> = getContext('isSubscript');
</script>

<DropDownItem
  onclick={() => {
    $activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'subscript');
  }}
  class={'item ' + ($isSubscript ? 'active dropdown-item-active' : '')}
  title="Subscript"
  ariaLabel="Format text with a subscript">
  <i class="icon subscript"></i>
  <span class="text">Subscript</span>
</DropDownItem>
