<svelte:options runes={true} />

<script lang="ts">
  import CodeLanguageDropDown from '$lib/components/toolbar/CodeLanguageDropDown.svelte';
  import DropDownBackColorPicker from '$lib/components/toolbar/DropDownBackColorPicker.svelte';
  import DropDownTextColorPicker from '$lib/components/toolbar/DropDownTextColorPicker.svelte';
  import {
    BlockFormatDropDown,
    CodeDropDrownItem,
    FontSizeEntry,
    InsertLink,
  } from '$lib/index.js';
  import {BoldButton} from '$lib/index.js';
  import {Divider} from '$lib/index.js';
  import {RedoButton} from '$lib/index.js';
  import {UndoButton} from '$lib/index.js';
  import {ItalicButton} from '$lib/index.js';
  import {UnderlineButton} from '$lib/index.js';
  import {StrikethroughButton} from '$lib/index.js';
  import {FormatCodeButton} from '$lib/index.js';
  import {DropDownAlign} from '$lib/index.js';
  import {InsertDropDown} from '$lib/index.js';
  import {FontFamilyDropDown} from '$lib/index.js';
  import {ParagraphDropDownItem} from '$lib/index.js';
  import {HeadingDropDownItem} from '$lib/index.js';
  import {BulletDropDrownItem} from '$lib/index.js';
  import {NumberDropDrownItem} from '$lib/index.js';
  import {CheckDropDrownItem} from '$lib/index.js';
  import {QuoteDropDrownItem} from '$lib/index.js';
  import {Toolbar} from '$lib/index.js';
  import {InsertImageDialog} from '$lib/index.js';
  import {InsertHRDropDownItem} from '$lib/index.js';
  import {InsertImageDropDownItem} from '$lib/index.js';

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
        <CodeDropDrownItem />
      </BlockFormatDropDown>
      <Divider />
    {/if}
    {#if blockType === 'code'}
      <CodeLanguageDropDown />
    {:else}
      <FontFamilyDropDown />
      <FontSizeEntry />
      <Divider />
      <BoldButton />
      <ItalicButton />
      <UnderlineButton />
      <StrikethroughButton />
      <FormatCodeButton />
      <DropDownTextColorPicker />
      <DropDownBackColorPicker />
      <InsertLink />
      <Divider />
      <InsertDropDown>
        <InsertHRDropDownItem />
        <InsertImageDropDownItem onclick={() => imageDialog.open()} />
      </InsertDropDown>
      <Divider />
    {/if}
    <DropDownAlign />
    <!-- dialogs -->
    <InsertImageDialog bind:this={imageDialog} />
  {/snippet}
</Toolbar>
