<script lang="ts">
  import {getEditor} from '$lib/core/composerContext.js';
  import DropDownItem from '../../generic/dropdown/DropDownItem.svelte';

  const editor = getEditor();
</script>

<DropDownItem onclick={editor.extensions.openInsertTweetDialog!} class="item">
  <i class="icon x"></i>
  <span class="text">X (Tweet)</span>
</DropDownItem>
