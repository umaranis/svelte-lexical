<script lang="ts">
  import type {Doc} from 'yjs';

  import {useCollaborationContext} from './CollaborationContext.js';
  import type {InitialEditorStateType} from '../../initializeEditor.js';
  import {getEditor} from '../../composerContext.js';
  import {
    createBinding,
    type ExcludedProperties,
    type Provider,
    type SyncCursorPositionsFn,
  } from '@lexical/yjs';
  import {onMount} from 'svelte';
  import YjsCollaboration from './YjsCollaboration.svelte';
  import YjsHistory from './YjsHistory.svelte';
  import YjsFocusTracking from './YjsFocusTracking.svelte';

  const editor = getEditor();

  interface Props {
    id?: string;
    providerFactory: (id: string, yjsDocMap: Map<string, Doc>) => Provider;
    shouldBootstrap: boolean;
    username?: string | undefined;
    cursorColor?: string | undefined;
    cursorsContainerRef?: HTMLElement | null;
    initialEditorState?: InitialEditorStateType | null;
    excludedProperties?: ExcludedProperties | undefined;
    awarenessData?: object | undefined;
    syncCursorPositionsFn?: SyncCursorPositionsFn;
  }

  let {
    id = editor.getKey(),
    providerFactory,
    shouldBootstrap,
    username = undefined,
    cursorColor = undefined,
    cursorsContainerRef = null,
    initialEditorState = null,
    excludedProperties = undefined,
    awarenessData = undefined,
    syncCursorPositionsFn = undefined,
  }: Props = $props();

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
  {initialEditorState}
  {awarenessData}
  {syncCursorPositionsFn} />

<YjsHistory {editor} {binding} />
<YjsFocusTracking {editor} {provider} {name} {color} {awarenessData} />
