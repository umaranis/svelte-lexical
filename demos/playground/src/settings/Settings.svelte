<script lang="ts">
  import type {SettingsStore} from './setttingsStore';
  import {getContext} from 'svelte';
  import {isDevPlayground} from './appSettings';
  import Switch from '../ui/Switch.svelte';

  const settings: SettingsStore = getContext('settings');

  const windowLocation = window.location;
  let measureTypingPerf: boolean,
    isCollab: boolean,
    isRichText: boolean,
    isMaxLength: boolean,
    isCharLimit: boolean,
    isCharLimitUtf8: boolean,
    isAutocomplete: boolean,
    showTreeView: boolean,
    showNestedEditorTreeView: boolean,
    disableBeforeInput: boolean,
    showTableOfContents: boolean;

  $: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    measureTypingPerf = $settings.measureTypingPerf;
    isCollab = $settings.isCollab;
    isRichText = $settings.isRichText;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isMaxLength = $settings.isMaxLength;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isCharLimit = $settings.isCharLimit;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isCharLimitUtf8 = $settings.isCharLimit;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isAutocomplete = $settings.isAutocomplete;
    showTreeView = $settings.showTreeView;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    showNestedEditorTreeView = $settings.showNestedEditorTreeView;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    disableBeforeInput = $settings.disableBeforeInput;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    showTableOfContents = $settings.showTableOfContents;
  }

  let showSettings = false;
  const parentWindow = window.parent;
  const search = windowLocation.search;
  const isSplitScreen =
    parentWindow && parentWindow.location.pathname === '/split/';
</script>

<button
  id="options-button"
  class={`editor-dev-button ${showSettings ? 'active' : ''}`}
  on:click={() => (showSettings = !showSettings)} />
{#if showSettings}
  <div class="switches">
    {#if isRichText && isDevPlayground}
      <Switch
        on:click={() => {
          settings.setOption('isCollab', !isCollab);
          window.location.reload();
        }}
        checked={isCollab}
        text="Collaboration" />
    {/if}
    {#if isDevPlayground}
      <Switch
        on:click={() => {
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
      on:click={() => settings.setOption('showTreeView', !showTreeView)}
      checked={showTreeView}
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
      on:click={() => {
        settings.setOption('isRichText', !isRichText);
        settings.setOption('isCollab', false);
      }}
      checked={isRichText}
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
