<script lang="ts">
  import './ContentEditable.css';
  import type {LexicalEditor} from 'lexical';
  import {onMount} from 'svelte';
  import {getEditor} from './composerContext.js';

  export let ariaActiveDescendantID: string | undefined = undefined;
  export let ariaAutoComplete: 'list' | 'none' | 'inline' | 'both' | null =
    null;
  export let ariaControls: string | undefined = undefined;
  export let ariaDescribedBy: string | undefined = undefined;
  export let ariaExpanded: boolean | undefined = undefined;
  export let ariaLabel: string | undefined = undefined;
  export let ariaLabelledBy: string | undefined = undefined;
  export let ariaMultiline: boolean | undefined = undefined;
  export let ariaOwns: string | undefined = undefined;
  export let ariaRequired: boolean | undefined = undefined;
  export let autoCapitalize: string | undefined = undefined;
  //export let className: string;  // @lexical/image plugin seems to depend on the harded class name.
  export let className = 'ContentEditable__root';
  export let id: string | undefined = undefined;
  //export let readOnly: boolean; // it is defined in lexical code but not used
  export let role: string | undefined = 'textbox';
  export let spellCheck = true;
  export let style: string | undefined = undefined;
  export let tabIndex: number | undefined = undefined;
  export let testid: string | undefined = undefined;

  let isEditable = false;
  const editor: LexicalEditor = getEditor();
  let ref: null | HTMLElement;

  onMount(() => {
    // defaultView is required for a root element.
    // In multi-window setups, the defaultView may not exist at certain points.
    if (ref && ref.ownerDocument && ref.ownerDocument.defaultView) {
      editor.setRootElement(ref);
    } else {
      editor.setRootElement(null);
    }

    isEditable = editor.isEditable();
    return editor.registerEditableListener((currentIsEditable) => {
      isEditable = currentIsEditable;
    });
  });
</script>

<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<div
  aria-activedescendant={!isEditable ? undefined : ariaActiveDescendantID}
  aria-autocomplete={!isEditable ? 'none' : ariaAutoComplete}
  aria-controls={!isEditable ? undefined : ariaControls}
  aria-describedby={ariaDescribedBy}
  aria-expanded={!isEditable
    ? undefined
    : role === 'combobox'
      ? !!ariaExpanded
      : undefined}
  aria-label={ariaLabel}
  aria-labelledby={ariaLabelledBy}
  aria-multiline={ariaMultiline}
  aria-owns={!isEditable ? null : ariaOwns}
  aria-readonly={!isEditable ? true : undefined}
  aria-required={ariaRequired}
  autocapitalize={autoCapitalize}
  class={className}
  contentEditable={isEditable}
  data-testid={testid}
  {id}
  bind:this={ref}
  {role}
  spellcheck={spellCheck}
  {style}
  tabindex={tabIndex} />
