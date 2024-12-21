<script lang="ts">
  import {
    FORMAT_ELEMENT_COMMAND,
    INDENT_CONTENT_COMMAND,
    OUTDENT_CONTENT_COMMAND,
  } from 'lexical';
  import DropDown from '../generic/dropdown/DropDown.svelte';
  import DropDownItem from '../generic/dropdown/DropDownItem.svelte';
  import Divider from './Divider.svelte';
  import {getActiveEditor, getIsEditable} from '$lib/core/composerContext.js';
  import {getContext} from 'svelte';
  import type {Writable} from 'svelte/store';

  const activeEditor = getActiveEditor();
  const isRTL: Writable<boolean> = getContext('isRTL');
  const isEditable = getIsEditable();
</script>

<DropDown
  disabled={!$isEditable}
  buttonLabel="Align"
  buttonIconClassName="icon left-align"
  buttonClassName="toolbar-item spaced alignment"
  buttonAriaLabel="Formatting options for text alignment">
  <DropDownItem
    onclick={() => {
      $activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
    }}
    class="item">
    <i class="icon left-align"></i>
    <span class="text">Left Align</span>
  </DropDownItem>
  <DropDownItem
    onclick={() => {
      $activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
    }}
    class="item">
    <i class="icon center-align"></i>
    <span class="text">Center Align</span>
  </DropDownItem>
  <DropDownItem
    onclick={() => {
      $activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
    }}
    class="item">
    <i class="icon right-align"></i>
    <span class="text">Right Align</span>
  </DropDownItem>
  <DropDownItem
    onclick={() => {
      $activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify');
    }}
    class="item">
    <i class="icon justify-align"></i>
    <span class="text">Justify Align</span>
  </DropDownItem>
  <Divider />
  <DropDownItem
    onclick={() => {
      $activeEditor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined);
    }}
    class="item">
    <i class={'icon ' + ($isRTL ? 'indent' : 'outdent')}></i>
    <span class="text">Outdent</span>
  </DropDownItem>
  <DropDownItem
    onclick={() => {
      $activeEditor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined);
    }}
    class="item">
    <i class={'icon ' + ($isRTL ? 'outdent' : 'indent')}></i>
    <span class="text">Indent</span>
  </DropDownItem>
</DropDown>
