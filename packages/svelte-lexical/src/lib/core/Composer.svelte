<script lang="ts" context="module">
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
  import {onMount} from 'svelte';
  import {initializeEditor} from './initializeEditor.js';
  import {
    createSharedEditorContext,
    setEditor,
    setHistoryStateContext,
  } from './composerContext.js';

  export let initialConfig: InitialConfigType;

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

  setHistoryStateContext(createEmptyHistoryState());

  // allows sharing context between plugins and decorator nodes
  createSharedEditorContext();

  onMount(() => {
    const isEditable = initialConfig.editable;
    editor.setEditable(isEditable !== undefined ? isEditable : true);
  });

  export function getEditor() {
    return editor;
  }
</script>

<slot />
