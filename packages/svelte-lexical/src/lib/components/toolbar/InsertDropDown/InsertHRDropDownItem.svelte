<script lang="ts">
  import {getActiveEditor} from '$lib/core/composerContext.js';
  import {INSERT_HORIZONTAL_RULE_COMMAND} from '$lib/core/plugins/HorizontalRuleNode.js';
  import DropDownItem from '../../generic/dropdown/DropDownItem.svelte';

  const activeEditor = getActiveEditor();
</script>

<DropDownItem
  on:click={() => {
    $activeEditor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined);
  }}
  class="item">
  <i class="icon horizontal-rule" />
  <span class="text">Horizontal Rule</span>
</DropDownItem>
