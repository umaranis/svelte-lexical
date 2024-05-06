import {$isAtNodeEnd as isAtNodeEnd} from '@lexical/selection';
import type {RangeSelection} from 'lexical';

export default function getSelectedNode(selection: RangeSelection) {
  const anchor = selection.anchor;
  const focus = selection.focus;
  const anchorNode = selection.anchor.getNode();
  const focusNode = selection.focus.getNode();
  if (anchorNode === focusNode) {
    return anchorNode;
  }
  const isBackward = selection.isBackward();
  if (isBackward) {
    return isAtNodeEnd(focus) ? anchorNode : focusNode;
  } else {
    return isAtNodeEnd(anchor) ? focusNode : anchorNode;
  }
}
