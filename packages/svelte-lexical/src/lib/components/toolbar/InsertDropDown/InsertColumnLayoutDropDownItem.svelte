<script lang="ts">
  import {getActiveEditor} from '../../../core/composerContext.js';
  import DropDownItem from '../../generic/dropdown/DropDownItem.svelte';

  const activeEditor = getActiveEditor();
</script>

<DropDownItem on:click class="item">
  <i class="icon columns" />
  <span class="text">Columns Layout</span>
</DropDownItem>
