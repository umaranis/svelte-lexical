<script lang="ts">
  import {getHistoryStateContext} from '../composerContext';
  import HistoryPlugin from './HistoryPlugin.svelte';
</script>

<HistoryPlugin externalHistoryState={getHistoryStateContext()} />
