<script lang="ts">
  import {getContext} from 'svelte';
  import {FORMAT_TEXT_COMMAND} from 'lexical';
  import type {Writable} from 'svelte/store';
  import {getEditor} from '../../core/svelteContext';

  const editor = getEditor();
  const isUnderline: Writable<boolean> = getContext('isUnderline');
</script>

<button
  on:click={() => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
  }}
  class={'toolbar-item spaced ' + ($isUnderline ? 'active' : '')}
  aria-label="Format Underline">
  <i class="format underline" />
</button>
