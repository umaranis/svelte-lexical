<script lang="ts">
  import CollaborationPlugin from '../collaboration/CollaborationPlugin.svelte';
  import {setImageHistoryPluginType} from '../../composerContext';
  import {createWebsocketProvider} from '../collaboration/collaboration';

  setImageHistoryPluginType({
    componentType: CollaborationPlugin,
    props: {
      providerFactory: createWebsocketProvider,
      shouldBootstrap: true,
    },
  });
</script>
