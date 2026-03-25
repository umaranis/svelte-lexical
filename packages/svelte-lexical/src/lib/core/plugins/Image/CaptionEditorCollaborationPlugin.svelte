<!-- eslint-disable-next-line svelte/no-unused-svelte-ignore -->
<!-- svelte-ignore state_referenced_locally -->
<script lang="ts">
  import CollaborationPlugin from '../collaboration/CollaborationPlugin.svelte';
  import {setImageHistoryPluginType} from '../../composerContext.js';
  import type {Provider} from '@lexical/yjs';
  import type {Doc} from 'yjs';

  interface Props {
    providerFactory: (id: string, yjsDocMap: Map<string, Doc>) => Provider;
  }

  let {providerFactory}: Props = $props();

  setImageHistoryPluginType({
    componentType: CollaborationPlugin,
    props: {
      providerFactory: providerFactory,
      shouldBootstrap: true,
    },
  });
</script>
