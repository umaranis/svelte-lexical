<!--
@component
This plugin adds the ability to indent content using the tab key. Generally, we don't
recommend using this plugin as it could negatively affect accessibility for keyboard
users, causing focus to become trapped within the editor.
-->
<script lang="ts">
  import {registerTabIndentation} from '@lexical/extension';
  import {getEditor} from '../composerContext.js';
  import {onMount} from 'svelte';

  const {maxIndent = 7}: {maxIndent?: number} = $props();

  const editor = getEditor();
  onMount(() => {
    return registerTabIndentation(editor, maxIndent);
  });
</script>
