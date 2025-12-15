<svelte:options runes={true} />

<script lang="ts">
  import DropDownItem from '../../generic/dropdown/DropDownItem.svelte';
  import {getEditor} from '$lib/core/composerContext.js';

  const editor = getEditor();
</script>

<DropDownItem onclick={editor.extensions.openInsertImageDialog!} class="item">
  <i class="icon image"></i>
  <span class="text">Image</span>
</DropDownItem>
