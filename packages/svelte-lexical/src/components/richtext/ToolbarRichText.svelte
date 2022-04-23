<script>
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
</script>

<div class="toolbar">
  <UndoButton />
  <RedoButton />
  <Divider />
  <BlockTypeDropDown />
  <Divider />
  <BoldButton />
  <ItalicButton />
  <UnderlineButton />
  <StrikethroughButton />
  <FormatCodeButton />
  <Divider />
  <DropDownAlign />
</div>
<StateStoreRichTextUpdator />
