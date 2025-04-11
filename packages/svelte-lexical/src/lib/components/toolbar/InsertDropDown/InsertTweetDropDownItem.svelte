<script lang="ts">
  import DropDownItem from '../../generic/dropdown/DropDownItem.svelte';

  let {onclick} = $props();
</script>

<DropDownItem {onclick} class="item">
  <i class="icon x"></i>
  <span class="text">X (Tweet)</span>
</DropDownItem>
