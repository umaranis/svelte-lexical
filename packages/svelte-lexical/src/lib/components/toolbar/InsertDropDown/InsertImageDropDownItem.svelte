<svelte:options runes={true} />

<script lang="ts">
  import DropDownItem from '../../generic/dropdown/DropDownItem.svelte';
</script>

<DropDownItem on:click class="item">
  <i class="icon image"></i>
  <span class="text">Image</span>
</DropDownItem>
