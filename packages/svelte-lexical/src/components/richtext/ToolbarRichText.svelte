<script lang="ts">
  import {writable} from 'svelte/store';

  import BlockFormatDropDown from '../toolbar/BlockFormatDropDown.svelte';
  import BoldButton from '../toolbar/BoldButton.svelte';
  import Divider from '../toolbar/Divider.svelte';
  import RedoButton from '../toolbar/RedoButton.svelte';
  import UndoButton from '../toolbar/UndoButton.svelte';
  import ItalicButton from '../toolbar/ItalicButton.svelte';
  import UnderlineButton from '../toolbar/UnderlineButton.svelte';
  import StrikethroughButton from '../toolbar/StrikethroughButton.svelte';
  import FormatCodeButton from '../toolbar/FormatCodeButton.svelte';
  import StateStoreRichTextUpdator from './StateStoreRichTextUpdator.svelte';
  import DropDownAlign from '../toolbar/DropDownAlign.svelte';
  import InsertDropDown from '../toolbar/InsertDropDown.svelte';
  import {setContext} from 'svelte';
  import {getEditor} from '../../core/svelteContext';
  import {onMount} from 'svelte';
  import FontFamilyDropDown from '../toolbar/FontFamilyDropDown.svelte';
  import FontSizeDropDown from '../toolbar/FontSizeDropDown.svelte';
  import InsertLink from '../toolbar/InsertLink.svelte';

  const editor = getEditor();

  const isEditable = writable(editor.isEditable());
  setContext('isEditable', isEditable);

  const activeEditor = writable(editor);
  setContext('activeEditor', activeEditor);

  setContext('isBold', writable(false));
  setContext('isItalic', writable(false));
  setContext('isUnderline', writable(false));
  setContext('isStrikethrough', writable(false));
  setContext('blockType', writable('paragraph'));

  setContext('selectedElementKey', writable(null)); // TODO: why is this in store?

  setContext('fontSize', writable('15px'));
  setContext('fontFamily', writable('Arial'));
  setContext('isRTL', writable(false));
  setContext('isLink', writable(false));

  onMount(() => {
    return editor.registerEditableListener((editable) => {
      $isEditable = editable;
    });
  });
</script>

<StateStoreRichTextUpdator />
<div class="toolbar">
  <UndoButton />
  <RedoButton />
  <Divider />
  {#if $activeEditor === editor}
    <BlockFormatDropDown disabled={!$isEditable} />
    <Divider />
  {/if}
  <FontFamilyDropDown disabled={!$isEditable} />
  <FontSizeDropDown disabled={!$isEditable} />
  <Divider />
  <BoldButton />
  <ItalicButton />
  <UnderlineButton />
  <StrikethroughButton />
  <InsertLink />
  <FormatCodeButton />
  <Divider />
  <InsertDropDown disabled={!$isEditable} />
  <Divider />
  <DropDownAlign disabled={!$isEditable} />
</div>
