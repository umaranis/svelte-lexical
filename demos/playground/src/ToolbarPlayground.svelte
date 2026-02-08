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
    ShortcutsPlugin,
    InsertYoutubeDialog,
    InsertYoutubeDropDownItem,
    InsertTweetDropDownItem,
    InsertTweetDialog,
    InsertBlueskyDialog,
    InsertBlueskyDropDownItem,
  } from 'svelte-lexical';
  import InsertImageDialog from './InsertImageDialog.svelte';
</script>

<Toolbar>
  {#snippet children({editor, activeEditor, blockType})}
    <ShortcutsPlugin />
    <UndoButton />
    <RedoButton />
    <Divider />
    {#if activeEditor === editor}
      <BlockFormatDropDown>
        <ParagraphDropDownItem />
        <HeadingDropDownItem headingSize="h1" />
        <HeadingDropDownItem headingSize="h2" />
        <HeadingDropDownItem headingSize="h3" />
        <NumberDropDrownItem />
        <BulletDropDrownItem />
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
          <InsertImageDropDownItem />
          <InsertColumnLayoutDropDownItem />
          <InsertTableDropDownItem />
          <InsertYoutubeDropDownItem />
          <InsertTweetDropDownItem />
          <InsertBlueskyDropDownItem />
        </InsertDropDown>
        <Divider />
      {/if}
    {/if}
    <DropDownAlign />
    <!-- dialogs -->
    <InsertImageDialog />
    <InsertColumnsDialog />
    <InsertTableDialog />
    <InsertYoutubeDialog />
    <InsertTweetDialog />
    <InsertBlueskyDialog />
  {/snippet}
</Toolbar>
