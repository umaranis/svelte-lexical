<script lang="ts">
  import type {SettingsStore} from './setttingsStore';
  import {getContext} from 'svelte';
  import {isDevPlayground} from './appSettings';
  import Switch from '../ui/Switch.svelte';

  const settings: SettingsStore = getContext('settings');

  const windowLocation = window.location;

  let showSettings = $state(false);
  const parentWindow = window.parent;
  const search = windowLocation.search;
  const isSplitScreen =
    parentWindow && parentWindow.location.pathname === '/split/';
</script>

<button
  id="options-button"
  class={`editor-dev-button ${showSettings ? 'active' : ''}`}
  onclick={() => (showSettings = !showSettings)}
  aria-label="Toggle settings">
</button>
{#if showSettings}
  <div class="switches">
    {#if $settings.isRichText && isDevPlayground}
      <Switch
        onclick={() => {
          settings.setOption('isCollab', !$settings.isCollab);
          window.location.reload();
        }}
        checked={$settings.isCollab}
        text="Collaboration" />
    {/if}
    {#if isDevPlayground}
      <Switch
        onclick={() => {
          if (isSplitScreen) {
            window.parent.location.href = `/${search}`;
          } else {
            window.location.href = `/split/${search}`;
          }
        }}
        checked={isSplitScreen}
        text="Split Screen" />
    {/if}
    <!-- <Switch
      on:click={() =>
        settings.setOption('measureTypingPerf', !measureTypingPerf)}
      checked={measureTypingPerf}
      text="Measure Perf" /> -->
    <Switch
      onclick={() =>
        settings.setOption('showTreeView', !$settings.showTreeView)}
      checked={$settings.showTreeView}
      text="Debug View" />
    <!-- <Switch
      on:click={() =>
        settings.setOption(
          'showNestedEditorTreeView',
          !showNestedEditorTreeView,
        )}
      checked={showNestedEditorTreeView}
      text="Nested Editors Debug View" />-->
    <Switch
      onclick={() => {
        settings.setOption('isRichText', !$settings.isRichText);
        settings.setOption('isCollab', false);
      }}
      checked={$settings.isRichText}
      text="Rich Text" />
    <!--<Switch
      on:click={() => settings.setOption('isCharLimit', !isCharLimit)}
      checked={isCharLimit}
      text="Char Limit" />
    <Switch
      on:click={() => settings.setOption('isCharLimitUtf8', !isCharLimitUtf8)}
      checked={isCharLimitUtf8}
      text="Char Limit (UTF-8)" />
    <Switch
      on:click={() => settings.setOption('isMaxLength', !isMaxLength)}
      checked={isMaxLength}
      text="Max Length" />
    <Switch
      on:click={() => settings.setOption('isAutocomplete', !isAutocomplete)}
      checked={isAutocomplete}
      text="Autocomplete" />
    <Switch
      on:click={() => {
        settings.setOption('disableBeforeInput', !disableBeforeInput);
        setTimeout(() => window.location.reload(), 500);
      }}
      checked={disableBeforeInput}
      text="Legacy Events" />
    <Switch
      on:click={() => {
        settings.setOption('showTableOfContents', !showTableOfContents);
      }}
      checked={showTableOfContents}
      text="Table Of Contents" /> -->
  </div>
{/if}
