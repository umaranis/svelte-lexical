<!--
  @component ComponentPickerMenuPlugin

  A typeahead menu component that provides slash command functionality for inserting
  different types of content blocks (headings, lists, etc.) into the editor.

  The menu is triggered by typing "/" and filters available options based on the
  user's query string, matching against option titles and keywords.

  @example
  ```svelte
  <Composer {initialConfig}>
    ...
    <ComponentPickerMenuPlugin />
    ...
  </Composer>
  ```

  //TODO: add tests for slash command
  //TODO: add more slash commands/options
-->
<script lang="ts">
  import TypeAheadMenu from '$lib/components/generic/contextmenu/TypeAheadMenu.svelte';
  import type {TextNode} from 'lexical';
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
  const baseOptions = getBaseOptions(editor /*, showModal*/);

  $effect(() => {
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

<TypeAheadMenu
  onQueryChange={(value) => {
    queryString = value;
  }}
  {onSelectOption}
  triggerFn={checkForTriggerMatch}
  {options} />
