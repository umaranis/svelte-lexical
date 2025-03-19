<script lang="ts">
  import {
    getActiveEditor,
    getBold,
    getIsEditable,
  } from '$lib/core/composerContext.js';
  import {toggleBold} from '$lib/core/commands/toggleBold.js';
  import {SHORTCUTS} from './shortcuts.js';

  const activeEditor = getActiveEditor();
  const isEditable = getIsEditable();

  const isBold = getBold();
</script>

<button
  disabled={!$isEditable}
  onclick={() => toggleBold($activeEditor)}
  class={'toolbar-item spaced ' + ($isBold ? 'active' : '')}
  title={`Bold (${SHORTCUTS.BOLD})`}
  type="button"
  aria-label={`Format text as bold. Shortcut: ${SHORTCUTS.BOLD}`}>
  <i class="format bold"></i>
</button>
