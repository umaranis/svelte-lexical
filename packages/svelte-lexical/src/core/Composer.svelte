<script lang="ts">
  import {createEmptyHistoryState} from '@lexical/history';
  import {createEditor} from 'lexical';
  import {initializeEditor} from './initializeEditor';
  import {setEditor, setHistoryState} from './svelteContext';

  export let config = {};

  const editor = createEditor(config);
  initializeEditor(editor);
  setEditor(editor);
  setHistoryState(createEmptyHistoryState());
</script>

<slot />
