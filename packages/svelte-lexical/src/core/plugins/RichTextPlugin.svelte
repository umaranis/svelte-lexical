<script>
  import { onMount, getContext } from 'svelte';
  import { registerRichText } from '@lexical/rich-text';

  const editor = getContext('editor');

  // returns callback to unregister
  onMount(() => registerRichText(editor));

  // TODO: add Dragon support - registerDragonSupport(editor)
  // TODO: add support for placeholder text
  // TODO: take care of decorators - useDecorators(editor)
</script>
