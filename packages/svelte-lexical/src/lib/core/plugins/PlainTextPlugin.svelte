<script lang="ts">
  import {onMount} from 'svelte';
  import {registerPlainText} from '@lexical/plain-text';
  import {getEditor} from '../composerContext.js';

  const editor = getEditor();

  // returns callback to unregister
  onMount(() => registerPlainText(editor));

  // TODO: add Dragon support - registerDragonSupport(editor)
</script>
