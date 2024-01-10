<script lang="ts">
  import {onMount} from 'svelte';
  import pkg from '@lexical/plain-text';
  const {registerPlainText} = pkg;
  import {getEditor} from '../composerContext';

  const editor = getEditor();

  // returns callback to unregister
  onMount(() => registerPlainText(editor));

  // TODO: add Dragon support - registerDragonSupport(editor)
</script>
