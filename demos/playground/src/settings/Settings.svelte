<script lang="ts">
  import type {SettingsStore} from './settingsStore';
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

<style>
  .editor-dev-button {
    position: relative;
    display: block;
    width: 40px;
    height: 40px;
    font-size: 12px;
    border-radius: 20px;
    border: none;
    cursor: pointer;
    outline: none;
    box-shadow: 0px 1px 10px rgba(0, 0, 0, 0.3);
    background-color: #444;
  }

  .editor-dev-button::after {
    content: '';
    position: absolute;
    top: 10px;
    right: 10px;
    bottom: 10px;
    left: 10px;
    display: block;
    background-size: contain;
    filter: invert(1);
  }

  .editor-dev-button:hover {
    background-color: #555;
  }

  .editor-dev-button.active {
    background-color: rgb(233, 35, 35);
  }

  #options-button {
    position: fixed;
    left: 20px;
    bottom: 20px;
  }

  #options-button::after {
    background-image: url(../images/icons/gear.svg);
  }

  .switches {
    z-index: 6;
    position: fixed;
    left: 10px;
    bottom: 70px;
    animation: slide-in 0.4s ease;
  }

  @keyframes slide-in {
    0% {
      opacity: 0;
      transform: translateX(-200px);
    }
    100% {
      opacity: 1;
      transform: translateX(0);
    }
  }
</style>
