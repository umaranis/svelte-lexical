<script lang="ts">
  import InsertTableDialog from '$lib/components/toolbar/dialogs/InsertTableDialog.svelte';
  import InsertTableDropDownItem from '$lib/components/toolbar/InsertDropDown/InsertTableDropDownItem.svelte';
  import {
    BlockFormatDropDown,
    CodeDropDrownItem,
    FontSizeEntry,
    InsertLink,
  } from '../lib/index.js';
  import {BoldButton} from '../lib/index.js';
  import {Divider} from '../lib/index.js';
  import {RedoButton} from '../lib/index.js';
  import {UndoButton} from '../lib/index.js';
  import {ItalicButton} from '../lib/index.js';
  import {UnderlineButton} from '../lib/index.js';
  import {StrikethroughButton} from '../lib/index.js';
  import {FormatCodeButton} from '../lib/index.js';
  import {DropDownAlign} from '../lib/index.js';
  import {InsertDropDown} from '../lib/index.js';
  import {FontFamilyDropDown} from '../lib/index.js';
  import {ParagraphDropDownItem} from '../lib/index.js';
  import {HeadingDropDownItem} from '../lib/index.js';
  import {BulletDropDrownItem} from '../lib/index.js';
  import {NumberDropDrownItem} from '../lib/index.js';
  import {CheckDropDrownItem} from '../lib/index.js';
  import {QuoteDropDrownItem} from '../lib/index.js';
  import {Toolbar} from '../lib/index.js';
  import {InsertImageDialog} from '../lib/index.js';
  import {InsertHRDropDownItem} from '../lib/index.js';
  import {InsertImageDropDownItem} from '../lib/index.js';
  import {InsertColumnLayoutDropDownItem} from '../lib/index.js';
  import {InsertColumnsDialog} from '../lib/index.js';

  let imageDialog: InsertImageDialog = $state();
  let columnsDialog: InsertColumnsDialog = $state();
  let tableDialog: InsertTableDialog = $state();
</script>

<Toolbar   >
  {#snippet children({ editor, activeEditor, blockType })}
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
    <FontFamilyDropDown />
    <FontSizeEntry />
    <Divider />
    <BoldButton />
    <ItalicButton />
    <UnderlineButton />
    <StrikethroughButton />
    <FormatCodeButton />
    <InsertLink />
    <Divider />
    <InsertDropDown>
      <InsertHRDropDownItem />
      <InsertImageDropDownItem on:click={() => imageDialog.open()} />
      <InsertColumnLayoutDropDownItem on:click={() => columnsDialog.open()} />
      <InsertTableDropDownItem on:click={() => tableDialog.open()} />
    </InsertDropDown>
    <Divider />
    <DropDownAlign />
    <!-- dialogs -->
    <InsertImageDialog bind:this={imageDialog} />
    <InsertColumnsDialog bind:this={columnsDialog} />
    <InsertTableDialog bind:this={tableDialog} />
  {/snippet}
</Toolbar>
