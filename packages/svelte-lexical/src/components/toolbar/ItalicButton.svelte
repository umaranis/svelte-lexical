<script lang="ts">
  import {FORMAT_TEXT_COMMAND} from 'lexical';
  import {getEditor} from '../../core/svelteContext';
  import {getContext} from 'svelte';
  import type {Writable} from 'svelte/store';

  const editor = getEditor();
  const isItalic: Writable<boolean> = getContext('isItalic');
</script>

<button
  on:click={() => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
  }}
  class={'toolbar-item spaced ' + ($isItalic ? 'active' : '')}
  aria-label="Format Italics">
  <i class="format italic" />
</button>
