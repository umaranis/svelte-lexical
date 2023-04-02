<script lang="ts">
  import {onMount} from 'svelte';
  import {registerRichText} from '@lexical/rich-text';
  import Decorator from '../Decorator.svelte';
  import {getEditor} from '../composerContext';

  const editor = getEditor();

  // returns callback to unregister
  onMount(() => registerRichText(editor));

  // TODO: add Dragon support - registerDragonSupport(editor)
  // TODO: add support for placeholder text
  // TODO: take care of decorators - useDecorators(editor)
</script>

<Decorator />
