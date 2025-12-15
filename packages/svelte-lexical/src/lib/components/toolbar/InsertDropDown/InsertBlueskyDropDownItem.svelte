<script lang="ts">
  import {getEditor} from '$lib/core/composerContext.js';
  import DropDownItem from '../../generic/dropdown/DropDownItem.svelte';

  const editor = getEditor();
</script>

<DropDownItem onclick={editor.extensions.openInsertBlueskyDialog!} class="item">
  <i class="icon bluesky"></i>
  <span class="text">Bluesky Post</span>
</DropDownItem>
