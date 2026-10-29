<!--
@component
This plugin adds the ability to indent content using the tab key. Generally, we don't
recommend using this plugin as it could negatively affect accessibility for keyboard
users, causing focus to become trapped within the editor.
-->
<script lang="ts">
  import {
    type CanIndentPredicate,
    registerTabIndentation,
  } from '@lexical/extension';
  import {getEditor} from '../composerContext.js';
  import {onMount} from 'svelte';

  const {
    maxIndent = 7,
    canIndent,
  }: {
    maxIndent?: number;
    /**
     * By default, indents are set on all elements for which the {@link ElementNode.canIndent} returns true.
     * This option allows you to set indents for specific nodes without overriding the method for others.
     */
    canIndent?: CanIndentPredicate;
  } = $props();

  const editor = getEditor();
  onMount(() => {
    return registerTabIndentation(editor, maxIndent, canIndent);
  });
</script>
