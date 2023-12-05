<script lang="ts">
  import type {Doc} from 'yjs';

  import {useCollaborationContext} from './CollaborationContext';
  import type {InitialEditorStateType} from '../../initializeEditor';
  import {getEditor} from '../../composerContext';
  import {
    createBinding,
    type ExcludedProperties,
    type Provider,
  } from '@lexical/yjs';
  import {onMount} from 'svelte';
  import YjsCollaboration from './YjsCollaboration.svelte';
  import YjsHistory from './YjsHistory.svelte';
  import YjsFocusTracking from './YjsFocusTracking.svelte';

  const editor = getEditor();

  export let id: string = editor.getKey();
  export let providerFactory: (
    // eslint-disable-next-line no-shadow
    id: string,
    yjsDocMap: Map<string, Doc>,
  ) => Provider;
  export let shouldBootstrap: boolean;
  export let username: string | undefined = undefined;
  export let cursorColor: string | undefined = undefined;
  export let cursorsContainerRef: HTMLElement | null = null;
  export let initialEditorState: InitialEditorStateType | null = null;
  export let excludedProperties: ExcludedProperties | undefined = undefined;

  const collabContext = useCollaborationContext(username, cursorColor);

  const {yjsDocMap, name, color} = collabContext;

  const provider = providerFactory(id, yjsDocMap);
  const doc = yjsDocMap.get(id);
  const binding = createBinding(
    editor,
    provider,
    id,
    doc,
    yjsDocMap,
    excludedProperties,
  );
  collabContext.clientID = binding.clientID;
  collabContext.isCollabActive = true;

  onMount(() => {
    return () => {
      // Reseting flag only when unmount top level editor collab plugin. Nested
      // editors (e.g. image caption) should unmount without affecting it
      if (editor._parentEditor == null) {
        collabContext.isCollabActive = false;
      }
    };
  });
</script>

<YjsCollaboration
  {editor}
  {id}
  {provider}
  {binding}
  docMap={yjsDocMap}
  {name}
  {color}
  {shouldBootstrap}
  {cursorsContainerRef}
  {initialEditorState} />

<YjsHistory {editor} {binding} />
<YjsFocusTracking {editor} {provider} {name} {color} />
