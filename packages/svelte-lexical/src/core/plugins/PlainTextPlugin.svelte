<script lang="ts">
  import {onMount} from 'svelte';
  import {registerPlainText} from '@lexical/plain-text';
  import {getEditor} from '../svelteContext';

  const editor = getEditor();

  // returns callback to unregister
  onMount(() => registerPlainText(editor));

  // TODO: add Dragon support - registerDragonSupport(editor)
  // TODO: add support for placeholder text
  // TODO: take care of decorators - useDecorators(editor)
</script>
