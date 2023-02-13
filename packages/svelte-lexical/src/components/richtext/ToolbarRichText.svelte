<script>
  import {writable} from 'svelte/store';

  import BlockTypeDropDown from '../toolbar/BlockTypeDropDown.svelte';
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
  import FontFamilySelect from '../toolbar/FontFamilySelect.svelte';
  import FontSizeSelect from '../toolbar/FontSizeSelect.svelte';
  import InsertDropDown from '../toolbar/InsertDropDown.svelte';
  import {setContext} from 'svelte';

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
</script>

<StateStoreRichTextUpdator />
<div class="toolbar">
  <UndoButton />
  <RedoButton />
  <Divider />
  <BlockTypeDropDown />
  <Divider />
  <FontFamilySelect />
  <FontSizeSelect />
  <Divider />
  <BoldButton />
  <ItalicButton />
  <UnderlineButton />
  <StrikethroughButton />
  <FormatCodeButton />
  <Divider />
  <InsertDropDown />
  <Divider />
  <DropDownAlign />
</div>
