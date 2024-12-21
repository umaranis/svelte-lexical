<script lang="ts">
  import {
    $isCodeNode as isCodeNode,
    CODE_LANGUAGE_FRIENDLY_NAME_MAP,
    getLanguageFriendlyName,
  } from '@lexical/code';
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
  const codeLanguage: Writable<string> = getContext('codeLanguage');

  const CODE_LANGUAGE_OPTIONS = getCodeLanguageOptions();

  function getCodeLanguageOptions(): [string, string][] {
    const options: [string, string][] = [];

    for (const [lang, friendlyName] of Object.entries(
      CODE_LANGUAGE_FRIENDLY_NAME_MAP,
    )) {
      options.push([lang, friendlyName]);
    }

    return options;
  }

  function onCodeLanguageSelect(value: string) {
    $activeEditor.update(() => {
      if ($selectedElementKey !== null) {
        const node = getNodeByKey($selectedElementKey);
        if (isCodeNode(node)) {
          node.setLanguage(value);
        }
      }
    });
  }
</script>

<DropDown
  disabled={!$isEditable}
  buttonClassName="toolbar-item code-language"
  buttonLabel={getLanguageFriendlyName($codeLanguage)}
  buttonAriaLabel="Select language">
  {#each CODE_LANGUAGE_OPTIONS as [value, name]}
    <DropDownItem
      class={`item ${
        value === $codeLanguage ? 'active dropdown-item-active' : ''
      }`}
      onclick={() => onCodeLanguageSelect(value)}>
      <span class="text">{name}</span>
    </DropDownItem>
  {/each}
</DropDown>
