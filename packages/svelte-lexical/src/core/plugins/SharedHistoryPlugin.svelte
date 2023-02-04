<script>
  import {getHistoryState} from '../svelteContext';
  import HistoryPlugin from './HistoryPlugin.svelte';
</script>

<HistoryPlugin externalHistoryState={getHistoryState()} />
