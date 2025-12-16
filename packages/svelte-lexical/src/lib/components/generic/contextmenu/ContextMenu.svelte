<script lang="ts" generics="TOption extends MenuOption">
  import {
    COMMAND_PRIORITY_LOW,
    KEY_ARROW_DOWN_COMMAND,
    KEY_ARROW_UP_COMMAND,
    KEY_ENTER_COMMAND,
    KEY_ESCAPE_COMMAND,
    KEY_TAB_COMMAND,
    TextNode,
    type CommandListenerPriority,
    type LexicalEditor,
  } from 'lexical';
  import {
    $splitNodeContainingQuery as splitNodeContainingQuery,
    MenuOption,
    scrollIntoViewIfNeeded,
    type MenuRenderFn,
    type MenuResolution,
  } from './contextMenuHelpers.js';
  import {mergeRegister} from '@lexical/utils';
  import {SCROLL_TYPEAHEAD_OPTION_INTO_VIEW_COMMAND} from './typeAheadMenuHelpers.js';
  import {onMount} from 'svelte';

  interface Props {
    close: () => void;
    editor: LexicalEditor;
    anchorElementRef: HTMLElement | null;
    resolution: {value: MenuResolution};
    options: Array<TOption>;
    shouldSplitNodeWithQuery?: boolean;
    menuRenderFn: MenuRenderFn<TOption>;
    onSelectOption: (
      option: TOption,
      textNodeContainingQuery: TextNode | null,
      closeMenu: () => void,
      matchingString: string,
    ) => void;
    commandPriority?: CommandListenerPriority;
    preselectFirstItem?: boolean;
  }
  let {
    close,
    editor,
    anchorElementRef,
    resolution,
    options,
    menuRenderFn,
    onSelectOption,
    shouldSplitNodeWithQuery = false,
    commandPriority = COMMAND_PRIORITY_LOW,
    preselectFirstItem = true,
  }: Props = $props();

  const selectedIndex = $state<{value: null | number}>({value: null});

  $effect(() => {
    // TODO: this is a $effect dependency. Test if it is reactive.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const matchingString =
      resolution.value.match && resolution.value.match.matchingString;

    if (preselectFirstItem) {
      selectedIndex.value = 0;
    }
  });

  const selectOptionAndCleanUp = (selectedEntry: TOption) => {
    editor.update(() => {
      const textNodeContainingQuery =
        resolution.value.match != null && shouldSplitNodeWithQuery
          ? splitNodeContainingQuery(resolution.value.match)
          : null;

      onSelectOption(
        selectedEntry,
        textNodeContainingQuery,
        close,
        resolution.value.match ? resolution.value.match.matchingString : '',
      );
    });
  };

  const updateSelectedIndex = (index: number) => {
    const rootElem = editor.getRootElement();
    if (rootElem !== null) {
      rootElem.setAttribute('aria-activedescendant', 'typeahead-item-' + index);
      selectedIndex.value = index;
    }
  };

  $effect(() => {
    return () => {
      const rootElem = editor.getRootElement();
      if (rootElem !== null) {
        rootElem.removeAttribute('aria-activedescendant');
      }
    };
  });

  $effect.pre(() => {
    if (options === null) {
      selectedIndex.value = null;
    } else if (selectedIndex.value === null && preselectFirstItem) {
      updateSelectedIndex(0);
    }
  });

  onMount(() => {
    return mergeRegister(
      mergeRegister(
        editor.registerCommand(
          SCROLL_TYPEAHEAD_OPTION_INTO_VIEW_COMMAND,
          ({option}) => {
            if (option.ref && option.ref != null) {
              scrollIntoViewIfNeeded(option.ref);
              return true;
            }

            return false;
          },
          commandPriority,
        ),
      ),
      editor.registerCommand<KeyboardEvent>(
        KEY_ARROW_DOWN_COMMAND,
        (payload) => {
          const event = payload;
          if (options !== null && options.length) {
            const newSelectedIndex =
              selectedIndex.value === null
                ? 0
                : selectedIndex.value !== options.length - 1
                  ? selectedIndex.value + 1
                  : 0;
            updateSelectedIndex(newSelectedIndex);
            const option = options[newSelectedIndex];
            if (option.ref != null && option.ref) {
              editor.dispatchCommand(
                SCROLL_TYPEAHEAD_OPTION_INTO_VIEW_COMMAND,
                {
                  index: newSelectedIndex,
                  option,
                },
              );
            }
            event.preventDefault();
            event.stopImmediatePropagation();
          }
          return true;
        },
        commandPriority,
      ),
      editor.registerCommand<KeyboardEvent>(
        KEY_ARROW_UP_COMMAND,
        (payload) => {
          const event = payload;
          if (options !== null && options.length) {
            const newSelectedIndex =
              selectedIndex.value === null
                ? options.length - 1
                : selectedIndex.value !== 0
                  ? selectedIndex.value - 1
                  : options.length - 1;
            updateSelectedIndex(newSelectedIndex);
            const option = options[newSelectedIndex];
            if (option.ref != null && option.ref) {
              scrollIntoViewIfNeeded(option.ref);
            }
            event.preventDefault();
            event.stopImmediatePropagation();
          }
          return true;
        },
        commandPriority,
      ),
      editor.registerCommand<KeyboardEvent>(
        KEY_ESCAPE_COMMAND,
        (payload) => {
          const event = payload;
          event.preventDefault();
          event.stopImmediatePropagation();
          close();
          return true;
        },
        commandPriority,
      ),
      editor.registerCommand<KeyboardEvent>(
        KEY_TAB_COMMAND,
        (payload) => {
          const event = payload;
          if (
            options === null ||
            selectedIndex.value === null ||
            options[selectedIndex.value] == null
          ) {
            return false;
          }
          event.preventDefault();
          event.stopImmediatePropagation();
          selectOptionAndCleanUp(options[selectedIndex.value]);
          return true;
        },
        commandPriority,
      ),
      editor.registerCommand(
        KEY_ENTER_COMMAND,
        (event: KeyboardEvent | null) => {
          if (
            options === null ||
            selectedIndex.value === null ||
            options[selectedIndex.value] == null
          ) {
            return false;
          }
          if (event !== null) {
            event.preventDefault();
            event.stopImmediatePropagation();
          }
          selectOptionAndCleanUp(options[selectedIndex.value]);
          return true;
        },
        commandPriority,
      ),
    );
  });
</script>

{@render menuRenderFn(
  anchorElementRef,
  {
    options,
    selectOptionAndCleanUp,
    selectedIndex,
  },
  resolution.value.match ? resolution.value.match.matchingString : '',
)}
