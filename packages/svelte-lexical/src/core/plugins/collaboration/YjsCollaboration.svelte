<script lang="ts">
  import type {Binding} from '@lexical/yjs';
  import type {LexicalEditor} from 'lexical';
  import type {Doc, Transaction, YEvent} from 'yjs';

  import {mergeRegister} from '@lexical/utils';
  import {
    CONNECTED_COMMAND,
    initLocalState,
    syncCursorPositions,
    syncLexicalUpdateToYjs,
    syncYjsChangesToLexical,
    TOGGLE_CONNECT_COMMAND,
  } from '@lexical/yjs';
  import {
    $createParagraphNode as createParagraphNode,
    $getRoot as getRoot,
    $getSelection as getSelection,
    COMMAND_PRIORITY_EDITOR,
  } from 'lexical';
  import type {WebsocketProvider} from 'y-websocket';

  import type {InitialEditorStateType} from '../../initializeEditor';
  import {onMount} from 'svelte';

  export let editor: LexicalEditor;
  export let id: string;
  export let provider: WebsocketProvider;
  export let binding: Binding;
  export let docMap: Map<string, Doc>;
  export let name: string;
  export let color: string;
  export let shouldBootstrap: boolean;
  export let cursorsContainerRef: HTMLElement | null = null;
  export let initialEditorState: InitialEditorStateType | null = null;

  let isReloadingDoc = false;
  let doc = docMap.get(id);

  //const binding = createBinding(editor, provider, id, doc, docMap);

  const connect = () => {
    provider.connect();
  };

  const disconnect = () => {
    try {
      provider.disconnect();
    } catch (e) {
      // Do nothing
    }
  };

  function initializeProviderAndConnect() {
    const {root} = binding;
    const {awareness} = provider;

    const onStatus = ({status}: {status: string}) => {
      editor.dispatchCommand(CONNECTED_COMMAND, status === 'connected');
    };

    const onSync = (isSynced: boolean) => {
      if (
        shouldBootstrap &&
        isSynced &&
        root.isEmpty() &&
        root._xmlText._length === 0 &&
        isReloadingDoc === false
      ) {
        initializeEditor(editor, initialEditorState);
      }

      isReloadingDoc = false;
    };

    const onAwarenessUpdate = () => {
      syncCursorPositions(binding, provider);
    };

    const onYjsTreeChanges = (
      // The below `any` type is taken directly from the vendor types for YJS.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      events: Array<YEvent<any>>,
      transaction: Transaction,
    ) => {
      if (transaction.origin !== binding) {
        syncYjsChangesToLexical(binding, provider, events);
      }
    };

    initLocalState(
      provider,
      name,
      color,
      document.activeElement === editor.getRootElement(),
    );

    const onProviderDocReload = (ydoc: Doc) => {
      clearEditorSkipCollab(editor, binding);
      doc = ydoc;
      docMap.set(id, ydoc);
      isReloadingDoc = true;
    };

    provider.on('reload', onProviderDocReload);
    provider.on('status', onStatus);
    provider.on('sync', onSync);
    awareness.on('update', onAwarenessUpdate);
    // This updates the local editor state when we recieve updates from other clients
    root.getSharedType().observeDeep(onYjsTreeChanges);
    const removeListener = editor.registerUpdateListener(
      ({
        prevEditorState,
        editorState,
        dirtyLeaves,
        dirtyElements,
        normalizedNodes,
        tags,
      }) => {
        if (tags.has('skip-collab') === false) {
          syncLexicalUpdateToYjs(
            binding,
            provider,
            prevEditorState,
            editorState,
            dirtyElements,
            dirtyLeaves,
            normalizedNodes,
            tags,
          );
        }
      },
    );
    connect();

    return () => {
      if (isReloadingDoc === false) {
        disconnect();
      }

      provider.off('sync', onSync);
      provider.off('status', onStatus);
      provider.off('reload', onProviderDocReload);
      awareness.off('update', onAwarenessUpdate);
      root.getSharedType().unobserveDeep(onYjsTreeChanges);
      docMap.delete(id);
      removeListener();
    };
  }

  function createCursorsContainer() {
    const ref = document.createElement('div');
    const target = cursorsContainerRef || document.body;
    target.appendChild(ref);
    binding.cursorsContainer = ref;

    return () => {
      if (ref?.parentNode) {
        ref.parentNode?.removeChild(ref);
      }
    };
  }

  onMount(() => {
    return mergeRegister(
      createCursorsContainer(),
      initializeProviderAndConnect(),
      editor.registerCommand(
        TOGGLE_CONNECT_COMMAND,
        (payload) => {
          if (connect !== undefined && disconnect !== undefined) {
            const shouldConnect = payload;

            if (shouldConnect) {
              // eslint-disable-next-line no-console
              console.log('Collaboration connected!');
              connect();
            } else {
              // eslint-disable-next-line no-console
              console.log('Collaboration disconnected!');
              disconnect();
            }
          }

          return true;
        },
        COMMAND_PRIORITY_EDITOR,
      ),
    );
  });

  function initializeEditor(
    editor: LexicalEditor,
    initialEditorState?: InitialEditorStateType,
  ): void {
    editor.update(
      () => {
        const root = getRoot();

        if (root.isEmpty()) {
          if (initialEditorState) {
            switch (typeof initialEditorState) {
              case 'string': {
                const parsedEditorState =
                  editor.parseEditorState(initialEditorState);
                editor.setEditorState(parsedEditorState, {
                  tag: 'history-merge',
                });
                break;
              }
              case 'object': {
                editor.setEditorState(initialEditorState, {
                  tag: 'history-merge',
                });
                break;
              }
              case 'function': {
                editor.update(
                  () => {
                    const root1 = getRoot();
                    if (root1.isEmpty()) {
                      initialEditorState(editor);
                    }
                  },
                  {tag: 'history-merge'},
                );
                break;
              }
            }
          } else {
            const paragraph = createParagraphNode();
            root.append(paragraph);
            const {activeElement} = document;

            if (
              getSelection() !== null ||
              (activeElement !== null &&
                activeElement === editor.getRootElement())
            ) {
              paragraph.select();
            }
          }
        }
      },
      {
        tag: 'history-merge',
      },
    );
  }

  function clearEditorSkipCollab(editor: LexicalEditor, binding: Binding) {
    // reset editor state
    editor.update(
      () => {
        const root = getRoot();
        root.clear();
        root.select();
      },
      {
        tag: 'skip-collab',
      },
    );

    if (binding.cursors == null) {
      return;
    }

    const cursors = binding.cursors;

    if (cursors == null) {
      return;
    }
    const cursorsContainer = binding.cursorsContainer;

    if (cursorsContainer == null) {
      return;
    }

    // reset cursors in dom
    const cursorsArr = Array.from(cursors.values());

    for (let i = 0; i < cursorsArr.length; i++) {
      const cursor = cursorsArr[i];
      const selection = cursor.selection;

      if (selection && selection.selections != null) {
        const selections = selection.selections;

        for (let j = 0; j < selections.length; j++) {
          cursorsContainer.removeChild(selections[i]);
        }
      }
    }
  }
</script>
