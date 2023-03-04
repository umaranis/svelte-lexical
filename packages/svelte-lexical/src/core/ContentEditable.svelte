<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<script lang="ts">
  // @ts-nocheck because of autoComplete error on div attribute
  // no way to turn this error off for a single line: https://github.com/sveltejs/language-tools/issues/1026
  // TODO: remove @ts-nocheck after making nay changes to enable type checking, then reapply to avoid autoComplete attribute error

  import type {LexicalEditor} from 'lexical';
  import {onMount} from 'svelte';
  import {getEditor} from './svelteContext';

  export let ariaActiveDescendantID: string | undefined = undefined;
  export let ariaAutoComplete: 'list' | 'none' | 'inline' | 'both' | null =
    null;
  export let ariaControls: string | undefined = undefined;
  export let ariaDescribedBy: string | undefined = undefined;
  export let ariaExpanded: boolean | undefined = undefined;
  export let ariaLabel: string | undefined = undefined;
  export let ariaLabelledBy: string | undefined = undefined;
  export let ariaMultiline: boolean | undefined = undefined;
  export let ariaOwneeID: string | undefined = undefined;
  export let ariaRequired: boolean | undefined = undefined;
  export let autoCapitalize: boolean | undefined = undefined;
  export let autoComplete: boolean | undefined = undefined;
  export let autoCorrect: boolean | undefined = undefined;
  //export let className: string;  // @lexical/image plugin seems to depend on the harded class name.
  export let className = 'ContentEditable__root';
  export let id: string | undefined = undefined;
  //export let readOnly: boolean; // it is defined in lexical code but not used
  export let role: 'textbox' | undefined = undefined;
  export let spellCheck = true;
  export let style: string | undefined = undefined;
  export let tabIndex: number | undefined = undefined;
  export let testid: string | undefined = undefined;

  let isEditable = false;
  const editor: LexicalEditor = getEditor();
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
  class={className}
  contentEditable={isEditable}
  data-testid={testid}
  {id}
  bind:this={ref}
  role={!isEditable ? undefined : role}
  spellcheck={spellCheck}
  {style}
  tabindex={tabIndex} />

<style>
  :global(.ContentEditable__root) {
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
