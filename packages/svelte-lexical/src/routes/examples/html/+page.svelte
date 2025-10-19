<!-- eslint-disable-next-line svelte/no-unused-svelte-ignore -->
<!-- svelte-ignore non_reactive_update-->
<script lang="ts">
  import {generateHtmlFromNodes} from '$lib/index.js';
  import Composer from '$lib/core/Composer.svelte';
  import {onMount} from 'svelte';
  import RichTextComposer from './RichTextComposer.svelte';

  let composer: Composer;
  let html: string = $state('');

  onMount(() => {
    const editor = composer.getEditor();
    editor.registerUpdateListener(() => {
      editor.getEditorState().read(() => {
        html = generateHtmlFromNodes(editor);
      });
    });
  });
</script>

<RichTextComposer bind:composer />

<div class="html-output">
  <h2>HTML Output</h2>
  <!-- eslint-disable-next-line svelte/no-at-html-tags, svelte/no-at-html-tags, -->
  {@html html}
</div>

<div class="html-output">
  <h2>HTML Code</h2>
  <!-- eslint-disable-next-line svelte/no-at-html-tags, svelte/no-at-html-tags, -->
  {html}
</div>

<style>
  .html-output {
    max-width: 1100px;
    margin: 2rem auto;
  }
</style>
