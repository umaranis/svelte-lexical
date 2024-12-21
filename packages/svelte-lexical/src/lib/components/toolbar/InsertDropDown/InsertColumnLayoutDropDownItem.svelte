<script lang="ts">
  import DropDownItem from '../../generic/dropdown/DropDownItem.svelte';

  let {onclick} = $props();
</script>

<DropDownItem {onclick} class="item">
  <i class="icon columns"></i>
  <span class="text">Columns Layout</span>
</DropDownItem>
