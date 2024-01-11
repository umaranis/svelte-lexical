<script lang="ts">
  import pkgcode from '@lexical/code';
  const {
    $isCodeNode: isCodeNode,
    CODE_LANGUAGE_FRIENDLY_NAME_MAP,
    getLanguageFriendlyName,
  } = pkgcode;
  import {type NodeKey} from 'lexical';
  import pkgLx from 'lexical';
  const {$getNodeByKey: getNodeByKey} = pkgLx;
  import {getContext} from 'svelte';
  import type {Writable} from 'svelte/store';
  import {getActiveEditor, getIsEditable} from '../../core/composerContext';
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
      on:click={() => onCodeLanguageSelect(value)}>
      <span class="text">{name}</span>
    </DropDownItem>
  {/each}
</DropDown>
