<svelte:options runes={true} />

<script lang="ts">
  import {BoldButton} from '$lib/index.js';
  import {Divider} from '$lib/index.js';
  import {ItalicButton} from '$lib/index.js';
  import {UnderlineButton} from '$lib/index.js';
  import {StrikethroughButton} from '$lib/index.js';
  import {FormatCodeButton} from '$lib/index.js';
  import {DropDownAlign} from '$lib/index.js';
  import {FontFamilyDropDown} from '$lib/index.js';
  import {FontSizeDropDown} from '$lib/index.js';
  import {Toolbar} from '$lib/index.js';
</script>

<Toolbar>
  {#snippet children({editor, activeEditor, blockType})}
    <FontFamilyDropDown />
    <FontSizeDropDown />
    <Divider />
    <BoldButton />
    <ItalicButton />
    <UnderlineButton />
    <StrikethroughButton />
    <FormatCodeButton />
    <Divider />
    <DropDownAlign />
  {/snippet}
</Toolbar>
