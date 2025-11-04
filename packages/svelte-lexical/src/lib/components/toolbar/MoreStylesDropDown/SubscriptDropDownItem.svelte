<script lang="ts">
  import DropDownItem from '$lib/components/generic/dropdown/DropDownItem.svelte';
  import {getActiveEditor} from '$lib/core/composerContext.js';
  import {getContext} from 'svelte';
  import type {Writable} from 'svelte/store';
  import {SHORTCUTS} from '../shortcuts.js';
  import {toggleSubscript} from '$lib/core/commands/commands.js';

  const activeEditor = getActiveEditor();

  const isSubscript: Writable<boolean> = getContext('isSubscript');
</script>

<DropDownItem
  onclick={() => {
    toggleSubscript($activeEditor);
  }}
  class={'item wide ' + ($isSubscript ? 'active dropdown-item-active' : '')}
  title="Subscript"
  ariaLabel="Format text with a subscript">
  <div class="icon-text-container">
    <i class="icon subscript"></i>
    <span class="text">Subscript</span>
  </div>
  <span class="shortcut">{SHORTCUTS.SUBSCRIPT}</span>
</DropDownItem>
