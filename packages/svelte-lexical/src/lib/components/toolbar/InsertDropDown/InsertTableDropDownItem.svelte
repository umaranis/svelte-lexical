<script lang="ts">
  import {getEditor} from '$lib/core/composerContext.js';
  import DropDownItem from '../../generic/dropdown/DropDownItem.svelte';

  const editor = getEditor();
</script>

<DropDownItem onclick={editor.extensions.openInsertTableDialog!} class="item">
  <i class="icon table"></i>
  <span class="text">Table</span>
</DropDownItem>
