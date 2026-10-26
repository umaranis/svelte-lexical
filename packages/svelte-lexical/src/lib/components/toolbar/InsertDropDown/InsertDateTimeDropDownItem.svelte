<script lang="ts">
  import {getActiveEditor} from '$lib/core/composerContext.js';
  import {INSERT_DATETIME_COMMAND} from '$lib/core/plugins/DateTime/DateTimeNode.js';
  import DropDownItem from '../../generic/dropdown/DropDownItem.svelte';

  const activeEditor = getActiveEditor();
</script>

<DropDownItem
  onclick={() => {
    const dateTime = new Date();
    dateTime.setHours(0, 0, 0, 0);
    $activeEditor.dispatchCommand(INSERT_DATETIME_COMMAND, {dateTime});
  }}
  class="item">
  <i class="icon calendar"></i>
  <span class="text">Date</span>
</DropDownItem>
