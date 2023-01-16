<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<script lang="ts">
  import type {LexicalEditor} from 'lexical';
  import {getContext, onMount} from 'svelte';

  export let ariaActiveDescendantID: string;
  export let ariaAutoComplete: 'list' | 'none' | 'inline' | 'both' | null;
  export let ariaControls: string;
  export let ariaDescribedBy: string;
  export let ariaExpanded: boolean;
  export let ariaLabel: string;
  export let ariaLabelledBy: string;
  export let ariaMultiline: boolean;
  export let ariaOwneeID: string;
  export let ariaRequired: boolean;
  export let autoCapitalize: boolean;
  export let autoComplete: boolean;
  export let autoCorrect: boolean;
  //export let className: string;  // I have hardcoded it. @lexical/image plugin seems to depend on the harded class name.
  export let id: string;
  //export let readOnly: boolean; // it is defined in lexical code but not used
  export let role: 'textbox';
  export let spellCheck = true;
  export let style: string;
  export let tabIndex: number;
  export let testid: string;

  let isEditable = false;
  const editor: LexicalEditor = getContext('editor');
  let ref: null | HTMLElement;

  onMount(() => {
    editor.setRootElement(ref);
    isEditable = editor.isEditable();
    editor.registerEditableListener((currentIsEditable) => {
      isEditable = currentIsEditable;
    });
  });
</script>

<div
  aria-activedescendant={!isEditable ? null : ariaActiveDescendantID}
  aria-autocomplete={!isEditable ? null : ariaAutoComplete}
  aria-controls={!isEditable ? null : ariaControls}
  aria-describedby={ariaDescribedBy}
  aria-expanded={ariaExpanded}
  aria-label={ariaLabel}
  aria-labelledby={ariaLabelledBy}
  aria-multiline={ariaMultiline}
  aria-owns={!isEditable ? null : ariaOwneeID}
  aria-required={ariaRequired}
  autoCapitalize={autoCapitalize !== undefined
    ? String(autoCapitalize)
    : undefined}
  {autoComplete}
  autoCorrect={autoCorrect !== undefined ? String(autoCorrect) : undefined}
  class="ContentEditable__root"
  contentEditable={isEditable}
  data-testid={testid}
  {id}
  bind:this={ref}
  role={!isEditable ? undefined : role}
  spellcheck={spellCheck}
  {style}
  tabindex={tabIndex} />

<style>
  .ContentEditable__root {
    border: 0;
    font-size: 15px;
    display: block;
    position: relative;
    tab-size: 1;
    outline: 0;
    padding: 10px; /* when updated from lexical, left and right padding increases a lot which only makes sense when block rearrange handle is enabled (not implemented yet and won't be included in simple editors) */
    min-height: 150px; /* when updated to latest from lexical, empty editor only receives focus when you click on the first line inside the editor. */
  }
</style>
