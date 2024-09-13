<script lang="ts">
  import {writable} from 'svelte/store';

  import StateStoreRichTextUpdator from './StateStoreRichTextUpdator.svelte';
  import {setContext} from 'svelte';
  import {getEditor} from '$lib/core/composerContext.js';
  import {onMount} from 'svelte';
  import type {NodeKey} from 'lexical';

  const editor = getEditor();

  const isEditable = writable(editor.isEditable());
  setContext('isEditable', isEditable);

  const activeEditor = writable(editor);
  setContext('activeEditor', activeEditor);

  setContext('isBold', writable(false));
  setContext('isItalic', writable(false));
  setContext('isUnderline', writable(false));
  setContext('isStrikethrough', writable(false));
  setContext('isSubscript', writable(false));
  setContext('isSuperscript', writable(false));
  setContext('isCode', writable(false));

  const blockType = writable('paragraph');
  setContext('blockType', blockType);

  setContext('selectedElementKey', writable<NodeKey | null>(null));

  setContext('fontSize', writable('15px'));
  setContext('fontFamily', writable('Arial'));
  setContext('fontColor', writable('#000'));
  setContext('bgColor', writable('#fff'));
  setContext('isRTL', writable(false));
  setContext('codeLanguage', writable(''));
  setContext('isLink', writable(false));
  setContext('isImageCaption', writable(false));

  onMount(() => {
    return editor.registerEditableListener((editable) => {
      $isEditable = editable;
    });
  });
</script>

<StateStoreRichTextUpdator />
<div class="toolbar">
  <slot {editor} activeEditor={$activeEditor} blockType={$blockType} />
</div>
