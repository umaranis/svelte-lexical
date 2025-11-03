<script lang="ts">
  import {getIsEditable, getReactiveState} from '$lib/core/composerContext.js';
  import {toggleBold} from '$lib/core/commands/toggleBold.js';
  import {SHORTCUTS} from './shortcuts.js';

  const isEditable = getIsEditable();
  const reactiveState = getReactiveState();
</script>

<button
  disabled={!$isEditable}
  onclick={() => toggleBold(reactiveState.activeEditor)}
  class={'toolbar-item spaced ' + (reactiveState.isBold ? 'active' : '')}
  title={`Bold (${SHORTCUTS.BOLD})`}
  type="button"
  aria-label={`Format text as bold. Shortcut: ${SHORTCUTS.BOLD}`}>
  <i class="format bold"></i>
</button>
