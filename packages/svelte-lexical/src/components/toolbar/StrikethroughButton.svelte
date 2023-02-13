<script lang="ts">
  import {FORMAT_TEXT_COMMAND} from 'lexical';
  import {getContext} from 'svelte';
  import type {Writable} from 'svelte/store';
  import {getEditor} from '../../core/svelteContext';

  const editor = getEditor();
  const isStrikethrough: Writable<boolean> = getContext('isStrikethrough');
</script>

<button
  on:click={() => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
  }}
  class={'toolbar-item spaced ' + ($isStrikethrough ? 'active' : '')}
  aria-label="Format Strikethrough">
  <i class="format strikethrough" />
</button>
