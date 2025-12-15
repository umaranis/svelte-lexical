<script lang="ts">
  import {getEditor} from '$lib/core/composerContext.js';
  import DropDownItem from '../../generic/dropdown/DropDownItem.svelte';

  const editor = getEditor();
</script>

<DropDownItem onclick={editor.extensions.openInsertYoutubeDialog!} class="item">
  <i class="icon youtube"></i>
  <span class="text">Youtube Video</span>
</DropDownItem>
