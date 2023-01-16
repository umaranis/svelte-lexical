<script lang="ts">
  import {createEditor} from 'lexical';
  import {setContext} from 'svelte';
  import {initializeEditor} from './initializeEditor';

  export let config = {};

  const editor = createEditor(config);
  initializeEditor(editor);
  setContext('editor', editor);
</script>

<slot />
