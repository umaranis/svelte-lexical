<svelte:options runes={true} />

<script lang="ts">
  import {
    BlockFormatDropDown,
    UndoButton,
    RedoButton,
    Toolbar,
    Divider,
    ParagraphDropDownItem,
    HeadingDropDownItem,
    BulletDropDrownItem,
    NumberDropDrownItem,
    CheckDropDrownItem,
    QuoteDropDrownItem,
    CodeDropDrownItem,
    CodeLanguageDropDown,
    FontFamilyDropDown,
    // FontSizeDropDown,
    FontSizeEntry,
    BoldButton,
    ItalicButton,
    UnderlineButton,
    InsertLink,
    FormatCodeButton,
    InsertDropDown,
    DropDownAlign,
    InsertHRDropDownItem,
    InsertImageDropDownItem,
    MoreStylesDropDown,
    StrikethroughDropDownItem,
    SubscriptDropDownItem,
    SuperscriptDropDownItem,
    ClearFormattingDropDownItem,
    DropDownTextColorPicker,
    DropDownBackColorPicker,
    InsertColumnLayoutDropDownItem,
    InsertColumnsDialog,
    InsertTableDialog,
    InsertTableDropDownItem,
  } from 'svelte-lexical';
  import InsertImageDialog from './InsertImageDialog.svelte';

  let imageDialog: InsertImageDialog;
  let columnsDialog: InsertColumnsDialog;
  let tableDialog: InsertTableDialog;
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
        <CodeDropDrownItem />
      </BlockFormatDropDown>
      <Divider />
    {/if}
    {#if blockType === 'code'}
      <CodeLanguageDropDown />
    {:else}
      <FontFamilyDropDown />
      <!-- <FontSizeDropDown /> -->
      <FontSizeEntry />
      <Divider />
      <BoldButton />
      <ItalicButton />
      <UnderlineButton />
      <FormatCodeButton />
      <DropDownTextColorPicker />
      <DropDownBackColorPicker />
      <InsertLink />
      <MoreStylesDropDown>
        <StrikethroughDropDownItem />
        <SubscriptDropDownItem />
        <SuperscriptDropDownItem />
        <ClearFormattingDropDownItem />
      </MoreStylesDropDown>
      <Divider />
      {#if activeEditor === editor}
        <InsertDropDown>
          <InsertHRDropDownItem />
          <InsertImageDropDownItem onclick={() => imageDialog.open()} />
          <InsertColumnLayoutDropDownItem
            onclick={() => columnsDialog.open()} />
          <InsertTableDropDownItem onclick={() => tableDialog.open()} />
        </InsertDropDown>
        <Divider />
      {/if}
    {/if}
    <DropDownAlign />
    <!-- dialogs -->
    <InsertImageDialog bind:this={imageDialog} />
    <InsertColumnsDialog bind:this={columnsDialog} />
    <InsertTableDialog bind:this={tableDialog} />
  {/snippet}
</Toolbar>
