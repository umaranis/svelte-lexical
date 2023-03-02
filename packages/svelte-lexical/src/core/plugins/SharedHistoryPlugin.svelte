<script lang="ts">
  import {getHistoryStateContext} from '../svelteContext';
  import HistoryPlugin from './HistoryPlugin.svelte';
</script>

<HistoryPlugin externalHistoryState={getHistoryStateContext()} />
