<script lang="ts">
  import type {Snippet} from 'svelte';
  import {setCollaborationContext} from './CollaborationContext.js';

  interface Props {
    children?: Snippet;
  }

  let {children}: Props = $props();

  setCollaborationContext();
</script>

{@render children?.()}
