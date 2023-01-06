<script lang="ts">
  import { mergeRegister } from "@lexical/utils";
  import { CLICK_COMMAND, COMMAND_PRIORITY_LOW, type LexicalEditor } from "lexical";
  import { getContext, onMount } from "svelte";
  import {
    clearEditorSelection,
    isNodeSelected,
    setEditorSelection,
  } from "../lexicalNodeSelection";

  export let editor: LexicalEditor;
  export let nodeKey: string;
  let selected = false;
  let self: EventTarget;

  onMount(() => {
    return mergeRegister(
      editor.registerUpdateListener(() => {
        selected = isNodeSelected(editor, nodeKey);
      }),
      editor.registerCommand(CLICK_COMMAND, (event: MouseEvent) => {
        if(event.target === self) {
          if(!event.shiftKey) {
            clearEditorSelection(editor);
          }
          setEditorSelection(editor, nodeKey, !selected);
          return true;
        }
        return false; 
      }, COMMAND_PRIORITY_LOW)
    );
  });
</script>

<hr class:selected bind:this={self}/>
