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
  import LeftAlignButton from '../toolbar/LeftAlignButton.svelte';
  import CenterAlignButton from '../toolbar/CenterAlignButton.svelte';
  import RightAlignButton from '../toolbar/RightAlignButton.svelte';
  import JustifyAlignButton from '../toolbar/JustifyAlignButton.svelte';
  import StateStoresBasicUpdator from './StateStoreBasicUpdator.svelte';
</script>

<StateStoresBasicUpdator />
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
  <LeftAlignButton />
  <CenterAlignButton />
  <RightAlignButton />
  <JustifyAlignButton />
</div>
