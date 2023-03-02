<script lang="ts">
  import {FORMAT_TEXT_COMMAND} from 'lexical';
  import {getEditor} from '../../core/svelteContext';
  import {getContext} from 'svelte';
  import type {Writable} from 'svelte/store';

  const editor = getEditor();
  const isBold: Writable<boolean> = getContext('isBold');
</script>

<button
  on:click={() => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
  }}
  class={'toolbar-item spaced ' + ($isBold ? 'active' : '')}
  aria-label="Format Bold">
  <i class="format bold" />
</button>
