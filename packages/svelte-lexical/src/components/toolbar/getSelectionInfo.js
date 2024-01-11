import pkgSelection from '@lexical/selection';
const { $isAtNodeEnd: isAtNodeEnd } = pkgSelection;

export default function getSelectedNode(selection) {
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
