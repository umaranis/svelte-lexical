<script lang="ts">
  import {
    LinkNode,
    TOGGLE_LINK_COMMAND,
    $toggleLink as toggleLink,
  } from '@lexical/link';
  import {mergeRegister, objectKlassEquals} from '@lexical/utils';
  import {
    $getSelection as getSelection,
    $isElementNode as isElementNode,
    $isRangeSelection as isRangeSelection,
    COMMAND_PRIORITY_LOW,
    PASTE_COMMAND,
  } from 'lexical';
  import {onMount} from 'svelte';
  import {getEditor} from '../../composerContext.js';

  interface Props {
    validateUrl?: undefined | ((url: string) => boolean);
  }

  let {validateUrl = undefined}: Props = $props();

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
                !objectKlassEquals(event, ClipboardEvent)
              ) {
                return false;
              }
              const clipboardEvent = event as ClipboardEvent;
              if (clipboardEvent.clipboardData === null) {
                return false;
              }
              const clipboardText =
                clipboardEvent.clipboardData.getData('text');
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
