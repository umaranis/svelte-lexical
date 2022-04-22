<script>
  import { onMount, getContext } from 'svelte';
  import { registerPlainText } from '@lexical/plain-text';

  const editor = getContext('editor');

  // returns callback to unregister
  onMount(() => registerPlainText(editor));

  // TODO: add Dragon support - registerDragonSupport(editor)
  // TODO: add support for placeholder text
  // TODO: take care of decorators - useDecorators(editor)
</script>
