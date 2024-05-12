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
    FontSizeDropDown,
    FontSizeEntry,
    BoldButton,
    ItalicButton,
    UnderlineButton,
    StrikethroughButton,
    InsertLink,
    FormatCodeButton,
    InsertDropDown,
    DropDownAlign,
    InsertHRDropDownItem,
    InsertImageDropDownItem,
    MoreStylesDropDown,
    StrikethroughDropDownItem,
  } from 'svelte-lexical';
  import InsertImageDialog from './InsertImageDialog.svelte';

  let imageDialog: InsertImageDialog;
</script>

<Toolbar let:editor let:activeEditor let:blockType>
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
    <FontSizeDropDown />
    <FontSizeEntry />
    <Divider />
    <BoldButton />
    <ItalicButton />
    <UnderlineButton />
    <FormatCodeButton />
    <InsertLink />
    <MoreStylesDropDown>
      <StrikethroughDropDownItem />
    </MoreStylesDropDown>
    <Divider />
    <InsertDropDown>
      <InsertHRDropDownItem />
      <InsertImageDropDownItem on:click={() => imageDialog.open()} />
    </InsertDropDown>
    <Divider />
  {/if}
  <DropDownAlign />
  <!-- dialogs -->
  <InsertImageDialog bind:this={imageDialog} />
</Toolbar>
