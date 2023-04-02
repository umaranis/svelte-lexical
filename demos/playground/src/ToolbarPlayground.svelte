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
    BoldButton,
    ItalicButton,
    UnderlineButton,
    StrikethroughButton,
    InsertLink,
    FormatCodeButton,
    InsertDropDown,
    DropDownAlign,
  } from 'svelte-lexical';
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
    <Divider />
    <BoldButton />
    <ItalicButton />
    <UnderlineButton />
    <StrikethroughButton />
    <InsertLink />
    <FormatCodeButton />
    <Divider />
    <InsertDropDown />
    <Divider />
  {/if}
  <DropDownAlign />
</Toolbar>
