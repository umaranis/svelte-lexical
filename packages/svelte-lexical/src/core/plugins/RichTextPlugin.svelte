<script lang="ts">
  import {onMount} from 'svelte';
  import pkg from '@lexical/rich-text';
  const {registerRichText} = pkg;
  import Decorator from '../Decorator.svelte';
  import {getEditor} from '../composerContext';

  const editor = getEditor();

  // returns callback to unregister
  onMount(() => registerRichText(editor));

  // TODO: add Dragon support - registerDragonSupport(editor)
</script>

<Decorator />
