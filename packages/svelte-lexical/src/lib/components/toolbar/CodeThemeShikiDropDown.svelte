<script lang="ts">
  import {$isCodeNode as isCodeNode} from '@lexical/code';
  import {getCodeThemeOptions} from '@lexical/code-shiki';
  import {$getNodeByKey as getNodeByKey, type NodeKey} from 'lexical';
  import {getContext} from 'svelte';
  import type {Writable} from 'svelte/store';
  import {getActiveEditor, getIsEditable} from '$lib/core/composerContext.js';
  import DropDown from '../generic/dropdown/DropDown.svelte';
  import DropDownItem from '../generic/dropdown/DropDownItem.svelte';

  const activeEditor = getActiveEditor();
  const isEditable = getIsEditable();

  const selectedElementKey: Writable<NodeKey | null> =
    getContext('selectedElementKey');
  const codeTheme: Writable<string> = getContext('codeTheme');

  const CODE_THEME_OPTIONS_SHIKI: [string, string][] =
    getCodeThemeOptions().filter((option) =>
      [
        'catppuccin-latte',
        'everforest-light',
        'github-light',
        'gruvbox-light-medium',
        'kanagawa-lotus',
        'dark-plus',
        'light-plus',
        'material-theme-lighter',
        'min-light',
        'one-light',
        'rose-pine-dawn',
        'slack-ochin',
        'snazzy-light',
        'solarized-light',
        'vitesse-light',
      ].includes(option[0]),
    );

  function getThemeFriendlyName(theme: string): string {
    const themeObj = CODE_THEME_OPTIONS_SHIKI.find(
      (option) => option[0] === theme,
    );
    return themeObj ? themeObj[1] : theme;
  }

  function onCodeThemeSelect(value: string) {
    $activeEditor.update(() => {
      if ($selectedElementKey !== null) {
        const node = getNodeByKey($selectedElementKey);
        if (isCodeNode(node)) {
          node.setTheme(value);
        }
      }
    });
  }
</script>

<DropDown
  disabled={!$isEditable}
  buttonClassName="toolbar-item code-language"
  buttonLabel={getThemeFriendlyName($codeTheme)}
  buttonAriaLabel="Select language">
  <!-- eslint-disable-next-line svelte/require-each-key -->
  {#each CODE_THEME_OPTIONS_SHIKI as [value, name]}
    <DropDownItem
      class={`item ${
        value === $codeTheme ? 'active dropdown-item-active' : ''
      }`}
      onclick={() => onCodeThemeSelect(value)}>
      <span class="text">{name}</span>
    </DropDownItem>
  {/each}
</DropDown>
