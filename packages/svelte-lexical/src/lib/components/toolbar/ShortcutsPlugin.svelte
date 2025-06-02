<script lang="ts">
  import {
    getActiveEditor,
    getBlockType,
    getFontSize,
    getIsLink,
  } from '$lib/core/composerContext.js';
  import type {HeadingTagType} from '@lexical/rich-text';
  import {
    COMMAND_PRIORITY_NORMAL,
    FORMAT_ELEMENT_COMMAND,
    FORMAT_TEXT_COMMAND,
    INDENT_CONTENT_COMMAND,
    isModifierMatch,
    KEY_DOWN_COMMAND,
    OUTDENT_CONTENT_COMMAND,
  } from 'lexical';

  import {
    clearFormatting,
    formatBulletList,
    formatCheckList,
    formatCode,
    formatHeading,
    formatNumberedList,
    formatParagraph,
    formatQuote,
    InsertLink,
  } from '$lib/core/commands.js';
  import {
    isCenterAlign,
    isClearFormatting,
    isDecreaseFontSize,
    isFormatBulletList,
    isFormatCheckList,
    isFormatCode,
    isFormatHeading,
    isFormatNumberedList,
    isFormatParagraph,
    isFormatQuote,
    isIncreaseFontSize,
    isIndent,
    isInsertCodeBlock,
    isInsertLink,
    isJustifyAlign,
    isLeftAlign,
    isOutdent,
    isRightAlign,
    isStrikeThrough,
    isSubscript,
    isSuperscript,
  } from './shortcuts.js';
  import {
    decreaseFontSize,
    increaseFontSize,
  } from '$lib/core/commands/updateFontSize.js';

  const activeEditor = getActiveEditor();
  const blockType = getBlockType();
  const isLink = getIsLink();
  const fontSize = getFontSize();

  const keyboardShortcutsHandler = (event: KeyboardEvent) => {
    // Short-circuit, a least one modifier must be set
    if (isModifierMatch(event, {})) {
      return false;
    } else if (isFormatParagraph(event)) {
      formatParagraph($activeEditor);
    } else if (isFormatHeading(event)) {
      const {code} = event;
      const headingSize = `h${code[code.length - 1]}` as HeadingTagType;
      formatHeading($activeEditor, $blockType, headingSize);
    } else if (isFormatBulletList(event)) {
      formatBulletList($activeEditor, $blockType);
    } else if (isFormatNumberedList(event)) {
      formatNumberedList($activeEditor, $blockType);
    } else if (isFormatCheckList(event)) {
      formatCheckList($activeEditor, $blockType);
    } else if (isFormatCode(event)) {
      formatCode($activeEditor, $blockType);
    } else if (isFormatQuote(event)) {
      formatQuote($activeEditor, $blockType);
    } else if (isStrikeThrough(event)) {
      $activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
    } else if (isIndent(event)) {
      $activeEditor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined);
    } else if (isOutdent(event)) {
      $activeEditor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined);
    } else if (isCenterAlign(event)) {
      $activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
    } else if (isLeftAlign(event)) {
      $activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
    } else if (isRightAlign(event)) {
      $activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
    } else if (isJustifyAlign(event)) {
      $activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify');
    } else if (isSubscript(event)) {
      $activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'subscript');
    } else if (isSuperscript(event)) {
      $activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'superscript');
    } else if (isInsertCodeBlock(event)) {
      $activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
    } else if (isIncreaseFontSize(event)) {
      increaseFontSize($activeEditor, Number($fontSize.slice(0, -2)));
    } else if (isDecreaseFontSize(event)) {
      decreaseFontSize($activeEditor, Number($fontSize.slice(0, -2)));
    } else if (isClearFormatting(event)) {
      clearFormatting($activeEditor);
    } else if (isInsertLink(event)) {
      InsertLink($activeEditor, $isLink);
    } else {
      // No match for any of the event handlers
      return false;
    }

    event.preventDefault();
    return true;
  };

  $effect(() => {
    return $activeEditor.registerCommand(
      KEY_DOWN_COMMAND,
      keyboardShortcutsHandler,
      COMMAND_PRIORITY_NORMAL,
    );
  });
</script>
