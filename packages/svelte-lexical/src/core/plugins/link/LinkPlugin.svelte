<script lang="ts">
  import pkg from '@lexical/link';
  const {LinkNode, TOGGLE_LINK_COMMAND, toggleLink} = pkg;
  import pkgUtil from '@lexical/utils';
  const {mergeRegister} = pkgUtil;
  import pkgLx from 'lexical';
  const {
    $getSelection: getSelection,
    $isElementNode: isElementNode,
    $isRangeSelection: isRangeSelection,
    COMMAND_PRIORITY_LOW,
    PASTE_COMMAND,
  } = pkgLx;
  import {onMount} from 'svelte';
  import {getEditor} from '../../composerContext';

  export let validateUrl: undefined | ((url: string) => boolean) = undefined;

  const editor = getEditor();

  onMount(() => {
    if (!editor.hasNodes([LinkNode])) {
      throw new Error('LinkPlugin: LinkNode not registered on editor');
    }
    return mergeRegister(
      editor.registerCommand(
        TOGGLE_LINK_COMMAND,
        (payload) => {
          if (payload === null) {
            toggleLink(payload);
            return true;
          } else if (typeof payload === 'string') {
            if (validateUrl === undefined || validateUrl(payload)) {
              toggleLink(payload);
              return true;
            }
            return false;
          } else {
            const {url, target, rel, title} = payload;
            toggleLink(url, {rel, target, title});
            return true;
          }
        },
        COMMAND_PRIORITY_LOW,
      ),
      validateUrl !== undefined
        ? editor.registerCommand(
            PASTE_COMMAND,
            (event) => {
              const selection = getSelection();
              if (
                !isRangeSelection(selection) ||
                selection.isCollapsed() ||
                !(event instanceof ClipboardEvent) ||
                event.clipboardData == null
              ) {
                return false;
              }
              const clipboardText = event.clipboardData.getData('text');
              if (!validateUrl!(clipboardText)) {
                return false;
              }
              // If we select nodes that are elements then avoid applying the link.
              if (!selection.getNodes().some((node) => isElementNode(node))) {
                editor.dispatchCommand(TOGGLE_LINK_COMMAND, clipboardText);
                event.preventDefault();
                return true;
              }
              return false;
            },
            COMMAND_PRIORITY_LOW,
          )
        : () => {
            // Don't paste arbritrary text as a link when there's no validate function
          },
    );
  });
</script>
