<script lang="ts">
  import {Toolbar, UndoButton, RedoButton} from '$lib/index.js';
</script>

<Toolbar let:editor let:activeEditor let:blockType>
  <UndoButton />
  <RedoButton />
</Toolbar>
