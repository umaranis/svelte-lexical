<script lang="ts">
  import BlockFormatDropDown from '../toolbar/BlockFormatDropDown/BlockFormatDropDown.svelte';
  import BoldButton from '../toolbar/BoldButton.svelte';
  import Divider from '../toolbar/Divider.svelte';
  import RedoButton from '../toolbar/RedoButton.svelte';
  import UndoButton from '../toolbar/UndoButton.svelte';
  import ItalicButton from '../toolbar/ItalicButton.svelte';
  import UnderlineButton from '../toolbar/UnderlineButton.svelte';
  import StrikethroughButton from '../toolbar/StrikethroughButton.svelte';
  import FormatCodeButton from '../toolbar/FormatCodeButton.svelte';
  import DropDownAlign from '../toolbar/DropDownAlign.svelte';
  import InsertDropDown from '../toolbar/InsertDropDown/InsertDropDown.svelte';
  import FontFamilyDropDown from '../toolbar/FontFamilyDropDown.svelte';
  import FontSizeDropDown from '../toolbar/FontSizeDropDown.svelte';
  import ParagraphDropDownItem from '../toolbar/BlockFormatDropDown/ParagraphDropDownItem.svelte';
  import HeadingDropDownItem from '../toolbar/BlockFormatDropDown/HeadingDropDownItem.svelte';
  import BulletDropDrownItem from '../toolbar/BlockFormatDropDown/BulletDropDrownItem.svelte';
  import NumberDropDrownItem from '../toolbar/BlockFormatDropDown/NumberDropDrownItem.svelte';
  import CheckDropDrownItem from '../toolbar/BlockFormatDropDown/CheckDropDrownItem.svelte';
  import QuoteDropDrownItem from '../toolbar/BlockFormatDropDown/QuoteDropDrownItem.svelte';
  import Toolbar from '../toolbar/Toolbar.svelte';
  import InsertImageDialog from '../toolbar/dialogs/InsertImageDialog.svelte';
  import InsertHRDropDownItem from '../toolbar/InsertDropDown/InsertHRDropDownItem.svelte';
  import InsertImageDropDownItem from '../toolbar/InsertDropDown/InsertImageDropDownItem.svelte';

  let imageDialog: InsertImageDialog;
</script>

<Toolbar>
  {#snippet children({editor, activeEditor, blockType})}
    <UndoButton />
    <RedoButton />
    <Divider />
    {#if activeEditor === editor}
      <BlockFormatDropDown>
        <ParagraphDropDownItem />
        <HeadingDropDownItem headingSize="h1" />
        <HeadingDropDownItem headingSize="h2" />
        <HeadingDropDownItem headingSize="h3" />
        <BulletDropDrownItem />
        <NumberDropDrownItem />
        <CheckDropDrownItem />
        <QuoteDropDrownItem />
      </BlockFormatDropDown>
      <Divider />
    {/if}
    <FontFamilyDropDown />
    <FontSizeDropDown />
    <Divider />
    <BoldButton />
    <ItalicButton />
    <UnderlineButton />
    <StrikethroughButton />
    <FormatCodeButton />
    <Divider />
    <InsertDropDown>
      <InsertHRDropDownItem />
      <InsertImageDropDownItem onclick={() => imageDialog.open()} />
    </InsertDropDown>
    <Divider />
    <DropDownAlign />
    <!-- dialogs -->
    <InsertImageDialog bind:this={imageDialog} />
  {/snippet}
</Toolbar>
