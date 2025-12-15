<script lang="ts">
  import {getEditor} from '$lib/core/composerContext.js';
  import DropDownItem from '../../generic/dropdown/DropDownItem.svelte';

  let editor = getEditor();
</script>

<DropDownItem onclick={editor.extensions.openInsertColumnsDialog!} class="item">
  <i class="icon columns"></i>
  <span class="text">Columns Layout</span>
</DropDownItem>
