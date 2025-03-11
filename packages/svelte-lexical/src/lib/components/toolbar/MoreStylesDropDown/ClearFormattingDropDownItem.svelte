<script lang="ts">
  import DropDownItem from '$lib/components/generic/dropdown/DropDownItem.svelte';
  import {clearFormatting} from '$lib/core/commands.js';
  import {getActiveEditor} from '$lib/core/composerContext.js';
  import {SHORTCUTS} from '../shortcuts.js';

  const activeEditor = getActiveEditor();
</script>

<DropDownItem
  onclick={() => clearFormatting($activeEditor)}
  class="item wide "
  title="Clear text formatting"
  ariaLabel="Clear all text formatting">
  <div class="icon-text-container">
    <i class="icon clear"></i>
    <span class="text">Clear formatting</span>
  </div>
  <span class="shortcut">{SHORTCUTS.CLEAR_FORMATTING}</span>
</DropDownItem>
