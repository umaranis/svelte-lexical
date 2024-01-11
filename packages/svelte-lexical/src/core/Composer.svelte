<script lang="ts" context="module">
  export type InitialEditorStateType =
    | null
    | string
    | EditorState
    | ((editor: LexicalEditor) => void);

  export type InitialConfigType = Readonly<{
    editor__DEPRECATED?: LexicalEditor | null;
    namespace: string;
    nodes?: ReadonlyArray<
      | Klass<LexicalNode>
      | {
          replace: Klass<LexicalNode>;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          with: <T extends {new (...args: any): any}>(
            node: InstanceType<T>,
          ) => LexicalNode;
        }
    >;
    onError: (error: Error, editor: LexicalEditor) => void;
    editable?: boolean;
    theme?: EditorThemeClasses;
    editorState?: InitialEditorStateType;
  }>;
</script>

<script lang="ts">
  import pkghistory from '@lexical/history';
  const {createEmptyHistoryState} = pkghistory;
  import {
    type EditorState,
    type EditorThemeClasses,
    type Klass,
    type LexicalEditor,
    type LexicalNode,
  } from 'lexical';
  import pkgLx from 'lexical';
  const {createEditor} = pkgLx;
  import {onMount} from 'svelte';
  import {initializeEditor} from './initializeEditor';
  import {
    createSharedEditorContext,
    setEditor,
    setHistoryStateContext,
  } from './composerContext';

  export let initialConfig: InitialConfigType;

  const {
    theme,
    namespace,
    nodes,
    onError,
    editorState: initialEditorState,
    editable,
  } = initialConfig;

  const editor = createEditor({
    editable,
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
