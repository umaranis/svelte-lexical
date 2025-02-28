<script lang="ts">
  import DropDownItem from '$lib/components/generic/dropdown/DropDownItem.svelte';

  import {getActiveEditor} from '$lib/core/composerContext.js';
  import {FORMAT_TEXT_COMMAND} from 'lexical';
  import {getContext} from 'svelte';
  import type {Writable} from 'svelte/store';
  import {SHORTCUTS} from '../shortcuts.js';

  const activeEditor = getActiveEditor();

  const isStrikethrough: Writable<boolean> = getContext('isStrikethrough');
</script>

<DropDownItem
  onclick={() => {
    $activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
  }}
  class={'item wide ' + ($isStrikethrough ? 'active dropdown-item-active' : '')}
  title="Strikethrough"
  ariaLabel="Format text with a strikethrough">
  <div class="icon-text-container">
    <i class="icon strikethrough"></i>
    <span class="text">Strikethrough</span>
  </div>
  <span class="shortcut">{SHORTCUTS.STRIKETHROUGH}</span>
</DropDownItem>
