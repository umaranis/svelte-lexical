<script lang="ts">
  import DropDownItem from '$lib/components/generic/dropdown/DropDownItem.svelte';
  import {getActiveEditor} from '$lib/core/composerContext.js';
  import {getContext} from 'svelte';
  import type {Writable} from 'svelte/store';
  import {SHORTCUTS} from '../shortcuts.js';
  import {toggleSuperscript} from '$lib/core/commands/commands.js';

  const activeEditor = getActiveEditor();

  const isSuperscript: Writable<boolean> = getContext('isSuperscript');
</script>

<DropDownItem
  onclick={() => {
    toggleSuperscript($activeEditor);
  }}
  class={'item wide ' + ($isSuperscript ? 'active dropdown-item-active' : '')}
  title="Superscript"
  ariaLabel="Format text with a superscript">
  <div class="icon-text-container">
    <i class="icon subscript"></i>
    <span class="text">Superscript</span>
  </div>
  <span class="shortcut">{SHORTCUTS.SUPERSCRIPT}</span>
</DropDownItem>
