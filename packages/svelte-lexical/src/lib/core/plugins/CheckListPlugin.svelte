<script lang="ts">
  import type {LexicalEditor} from 'lexical';

  import {registerCheckList} from '@lexical/list';
  import {getEditor} from '../composerContext.js';

  interface Props {
    /**
     * When `true`, clicking a checklist item will not focus the editor (useful for mobile).
     */
    disableTakeFocusOnClick?: boolean;
  }

  let {disableTakeFocusOnClick = false}: Props = $props();

  const editor: LexicalEditor = getEditor();

  $effect(() => {
    return registerCheckList(editor, {disableTakeFocusOnClick});
  });
</script>
