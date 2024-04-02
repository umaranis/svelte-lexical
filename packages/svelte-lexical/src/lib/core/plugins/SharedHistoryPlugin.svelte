<script lang="ts">
  import {getHistoryStateContext} from '../composerContext.js';
  import HistoryPlugin from './HistoryPlugin.svelte';
</script>

<HistoryPlugin externalHistoryState={getHistoryStateContext()} />
