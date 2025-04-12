<script lang="ts">
  import DropDownItem from '../../generic/dropdown/DropDownItem.svelte';

  let {onclick} = $props();
</script>

<DropDownItem {onclick} class="item">
  <i class="icon bluesky"></i>
  <span class="text">Bluesky Post</span>
</DropDownItem>
