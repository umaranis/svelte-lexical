<script lang="ts" module>
  export type InitialEditorStateType =
    | null
    | string
    | EditorState
    | ((editor: LexicalEditor) => void);

  export type InitialConfigType = Readonly<{
    editor__DEPRECATED?: LexicalEditor | null;
    namespace: string;
    nodes?: ReadonlyArray<Klass<LexicalNode> | LexicalNodeReplacement>;
    onError: (error: Error, editor: LexicalEditor) => void;
    editable?: boolean;
    theme?: EditorThemeClasses;
    editorState?: InitialEditorStateType;
    html?: HTMLConfig;
  }>;
</script>

<script lang="ts">
  import {createEmptyHistoryState} from '@lexical/history';
  import {
    createEditor,
    type EditorState,
    type EditorThemeClasses,
    type Klass,
    type LexicalEditor,
    type LexicalNode,
    type LexicalNodeReplacement,
    type HTMLConfig,
  } from 'lexical';
  import {onMount, setContext} from 'svelte';
  import {initializeEditor} from './initializeEditor.js';
  import {
    createSharedEditorContext,
    setEditor,
    setHistoryStateContext,
  } from './composerContext.js';
  import {writable} from 'svelte/store';

  interface Props {
    initialConfig: InitialConfigType;
    children?: import('svelte').Snippet;
  }

  let {initialConfig, children}: Props = $props();

  const {
    theme,
    namespace,
    nodes,
    onError,
    editorState: initialEditorState,
    editable,
    html,
  } = initialConfig;

  const editor = createEditor({
    editable,
    html,
    namespace,
    nodes,
    onError: (error) => onError(error, editor),
    theme,
  });
  initializeEditor(editor, initialEditorState);
  setEditor(editor);

  const isEditable = writable(editable !== undefined ? editable : true);
  setContext('isEditable', isEditable);

  onMount(() => {
    editor.setEditable($isEditable);
    return editor.registerEditableListener((editable) => {
      $isEditable = editable;
    });
  });

  setHistoryStateContext(createEmptyHistoryState());

  // allows sharing context between plugins and decorator nodes
  createSharedEditorContext();

  export function getEditor() {
    return editor;
  }
</script>

{@render children?.()}
