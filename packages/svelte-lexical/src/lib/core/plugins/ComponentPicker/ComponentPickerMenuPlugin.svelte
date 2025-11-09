<!--
  @component ComponentPickerMenu

  A typeahead menu component that provides slash command functionality for inserting
  different types of content blocks (headings, lists, etc.) into the editor.

  The menu is triggered by typing "/" and filters available options based on the
  user's query string, matching against option titles and keywords.

  @example
  ```svelte
  <Composer {initialConfig}>
    ...
    <ComponentPickerMenu />
    ...
  </Composer>
  ```

  //TODO: Support dark mode
  //TODO: Support all themes
-->
<script lang="ts">
  import TypeAheadMenu from '$lib/components/generic/contextmenu/TypeAheadMenu.svelte';
  import Portal from '$lib/components/generic/portal/Portal.svelte';
  import type {TextNode} from 'lexical';
  import ComponentPickerMenuItem from './ComponentPickerMenuItem.svelte';
  import type {ComponentPickerOption} from './ComponentPickerOption.js';
  import {getBaseOptions, getDynamicOptions} from './getOptions.js';
  import {useBasicTypeaheadTriggerMatch} from '$lib/components/generic/contextmenu/typeAheadMenuHelpers.js';
  import {getEditor} from '$lib/core/composerContext.js';

  const editor = getEditor();
  let queryString = $state<string | null>(null);

  const checkForTriggerMatch = useBasicTypeaheadTriggerMatch('/', {
    allowWhitespace: true,
    minLength: 0,
  });

  let options: ComponentPickerOption[] = $state([]);

  $effect(() => {
    const baseOptions = getBaseOptions(editor /*, showModal*/);

    if (!queryString) {
      options = baseOptions;
      return;
    }

    const regex = new RegExp(queryString, 'i');

    options = [
      ...getDynamicOptions(editor, queryString),
      ...baseOptions.filter(
        (option) =>
          regex.test(option.title) ||
          option.keywords.some((keyword) => regex.test(keyword)),
      ),
    ];
  });

  const onSelectOption = (
    selectedOption: ComponentPickerOption,
    nodeToRemove: TextNode | null,
    closeMenu: () => void,
    matchingString: string,
  ) => {
    editor.update(() => {
      nodeToRemove?.remove();
      selectedOption.onSelect(matchingString);
      closeMenu();
    });
  };
</script>

{#snippet menuRenderFn(
  anchorElementRef: HTMLElement | null,
  {
    selectedIndex,
    selectOptionAndCleanUp,
  }: {
    selectedIndex: {value: number | null};
    selectOptionAndCleanUp: (option: ComponentPickerOption) => void;
  },
)}
  {#if anchorElementRef && options.length}
    <Portal target={anchorElementRef}>
      <div class="typeahead-popover component-picker-menu">
        <ul>
          {#each options as option, i (option.key)}
            <ComponentPickerMenuItem
              index={i}
              isSelected={selectedIndex.value === i}
              onclick={() => {
                selectedIndex.value = i;
                selectOptionAndCleanUp(option);
              }}
              onmouseenter={() => {
                selectedIndex.value = i;
              }}
              {option} />
          {/each}
        </ul>
      </div>
      ,
    </Portal>
  {/if}
{/snippet}

<TypeAheadMenu
  onQueryChange={(value) => {
    queryString = value;
  }}
  {onSelectOption}
  triggerFn={checkForTriggerMatch}
  {options}
  {menuRenderFn} />
