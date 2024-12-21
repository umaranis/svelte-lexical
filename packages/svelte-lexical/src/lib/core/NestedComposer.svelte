<script lang="ts">
  import type {
    EditorThemeClasses,
    Klass,
    LexicalEditor,
    LexicalNode,
    KlassConstructor,
    Transform,
  } from 'lexical';
  import {onMount, setContext} from 'svelte';

  interface Props {
    // unlike Composer, a NestedComposer doesn't create the editor, it is passed to it
    initialEditor: LexicalEditor;
    parentEditor: LexicalEditor;
    initialTheme?: EditorThemeClasses | null;
    initialNodes?: ReadonlyArray<Klass<LexicalNode>> | null;
    children?: import('svelte').Snippet;
  }

  let {
    initialEditor = $bindable(),
    parentEditor,
    initialTheme = null,
    initialNodes = null,
    children,
  }: Props = $props();

  function getTransformSetFromKlass(
    klass: KlassConstructor<typeof LexicalNode>,
  ): Set<Transform<LexicalNode>> {
    const transform = klass.transform();
    return transform !== null
      ? new Set<Transform<LexicalNode>>([transform])
      : new Set<Transform<LexicalNode>>();
  }

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
        exportDOM: entry.exportDOM,
        klass: entry.klass,
        replace: entry.replace,
        replaceWithKlass: entry.replaceWithKlass,
        transforms: getTransformSetFromKlass(entry.klass),
      });
    }
  } else {
    for (const klass of initialNodes) {
      const type = klass.getType();
      const registeredKlass = initialEditor._nodes.get(klass.getType());
      initialEditor._nodes.set(type, {
        exportDOM: registeredKlass ? registeredKlass.exportDOM : undefined,
        klass,
        replace: null,
        replaceWithKlass: null,
        transforms: new Set(),
      });
    }
  }

  initialEditor._config.namespace = parentEditor._config.namespace;

  initialEditor._editable = parentEditor._editable;

  onMount(() => {
    return parentEditor.registerEditableListener((editable) => {
      initialEditor.setEditable(editable);
    });
  });
</script>

<!-- TODO: [from lexical - not implemented - not sure if required] If collaboration is enabled, make sure we don't render the children until the collaboration subdocument is ready. -->
{@render children?.()}
