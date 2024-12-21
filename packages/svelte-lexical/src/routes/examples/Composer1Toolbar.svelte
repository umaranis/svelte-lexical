<svelte:options runes={true} />

<script lang="ts">
  import {Toolbar, UndoButton, RedoButton} from '$lib/index.js';
</script>

<Toolbar>
  {#snippet children({editor, activeEditor, blockType})}
    <UndoButton />
    <RedoButton />
  {/snippet}
</Toolbar>
