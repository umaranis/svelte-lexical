<script lang="ts">
  import type {
    EditorThemeClasses,
    Klass,
    LexicalEditor,
    LexicalNode,
  } from 'lexical';
  import {onMount, setContext} from 'svelte';

  // unlike Composer, a NestedComposer doesn't create the editor, it is passed to it
  export let initialEditor: LexicalEditor;
  export let parentEditor: LexicalEditor;
  export let initialTheme: EditorThemeClasses | null = null;
  export let initialNodes: ReadonlyArray<Klass<LexicalNode>> | null = null;

  setContext('editor', initialEditor);

  const composerTheme = initialTheme || parentEditor._config.theme;
  if (composerTheme) {
    initialEditor._config.theme = composerTheme;
  }

  initialEditor._parentEditor = parentEditor;

  if (!initialNodes) {
    const parentNodes = (initialEditor._nodes = new Map(parentEditor._nodes));
    for (const [type, entry] of parentNodes) {
      initialEditor._nodes.set(type, {
        klass: entry.klass,
        replace: entry.replace,
        transforms: new Set(),
      });
    }
  } else {
    for (const klass of initialNodes) {
      const type = klass.getType();
      initialEditor._nodes.set(type, {
        klass,
        replace: null,
        transforms: new Set(),
      });
    }
  }

  initialEditor._config.namespace = parentEditor._config.namespace;

  onMount(() => {
    return parentEditor.registerEditableListener((editable) => {
      initialEditor.setEditable(editable);
    });
  });
</script>

<slot />
