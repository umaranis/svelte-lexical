<script lang="ts">
  import DropDownItem from '$lib/components/generic/dropdown/DropDownItem.svelte';
  import {getActiveEditor} from '$lib/core/composerContext.js';
  import {FORMAT_TEXT_COMMAND} from 'lexical';
  import {getContext} from 'svelte';
  import type {Writable} from 'svelte/store';

  const activeEditor = getActiveEditor();

  const isSuperscript: Writable<boolean> = getContext('isSuperscript');
</script>

<DropDownItem
  on:click={() => {
    $activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'superscript');
  }}
  class={'item ' + ($isSuperscript ? 'active dropdown-item-active' : '')}
  title="Superscript"
  ariaLabel="Format text with a superscript">
  <i class="icon subscript" />
  <span class="text">Superscript</span>
</DropDownItem>
