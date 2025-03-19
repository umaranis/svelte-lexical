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
    KEY_MODIFIER_COMMAND,
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

  const keyboardShortcutsHandler = (payload: KeyboardEvent) => {
    const event: KeyboardEvent = payload;

    if (isFormatParagraph(event)) {
      event.preventDefault();
      formatParagraph($activeEditor);
    } else if (isFormatHeading(event)) {
      event.preventDefault();
      const {code} = event;
      const headingSize = `h${code[code.length - 1]}` as HeadingTagType;
      formatHeading($activeEditor, $blockType, headingSize);
    } else if (isFormatBulletList(event)) {
      event.preventDefault();
      formatBulletList($activeEditor, $blockType);
    } else if (isFormatNumberedList(event)) {
      event.preventDefault();
      formatNumberedList($activeEditor, $blockType);
    } else if (isFormatCheckList(event)) {
      event.preventDefault();
      formatCheckList($activeEditor, $blockType);
    } else if (isFormatCode(event)) {
      event.preventDefault();
      formatCode($activeEditor, $blockType);
    } else if (isFormatQuote(event)) {
      event.preventDefault();
      formatQuote($activeEditor, $blockType);
    } else if (isStrikeThrough(event)) {
      event.preventDefault();
      $activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
    } else if (isIndent(event)) {
      event.preventDefault();
      $activeEditor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined);
    } else if (isOutdent(event)) {
      event.preventDefault();
      $activeEditor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined);
    } else if (isCenterAlign(event)) {
      event.preventDefault();
      $activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
    } else if (isLeftAlign(event)) {
      event.preventDefault();
      $activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
    } else if (isRightAlign(event)) {
      event.preventDefault();
      $activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
    } else if (isJustifyAlign(event)) {
      event.preventDefault();
      $activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify');
    } else if (isSubscript(event)) {
      event.preventDefault();
      $activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'subscript');
    } else if (isSuperscript(event)) {
      event.preventDefault();
      $activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'superscript');
    } else if (isInsertCodeBlock(event)) {
      event.preventDefault();
      $activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
    } else if (isIncreaseFontSize(event)) {
      event.preventDefault();
      increaseFontSize($activeEditor, Number($fontSize.slice(0, -2)));
    } else if (isDecreaseFontSize(event)) {
      event.preventDefault();
      decreaseFontSize($activeEditor, Number($fontSize.slice(0, -2)));
    } else if (isClearFormatting(event)) {
      event.preventDefault();
      clearFormatting($activeEditor);
    } else if (isInsertLink(event)) {
      InsertLink($activeEditor, $isLink);
    }

    return false;
  };

  $effect(() => {
    return $activeEditor.registerCommand(
      KEY_MODIFIER_COMMAND,
      keyboardShortcutsHandler,
      COMMAND_PRIORITY_NORMAL,
    );
  });
</script>
