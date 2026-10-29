<script lang="ts">
  import {registerList} from '@lexical/list';
  import {getEditor} from '../composerContext.js';

  interface Props {
    /**
     * When `true`, splitting a numbered list will preserve the numbering continuity.
     * When `false` (default), the new split list resets to 1.
     */
    shouldPreserveNumbering?: boolean;
  }

  let {shouldPreserveNumbering = false}: Props = $props();

  const editor = getEditor();

  $effect(() => {
    // returns callback to unregister
    return registerList(editor, {restoreNumbering: shouldPreserveNumbering});
  });
</script>
