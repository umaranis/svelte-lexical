<!-- read the documentation at `/docs/decorator-node.md` -->
<script lang="ts">
  import {mergeRegister} from '@lexical/utils';
  import {
    DecoratorNode,
    type KlassConstructor,
    type LexicalEditor,
    type LexicalNode,
  } from 'lexical';
  import {getAllContexts, mount, onMount, type Component} from 'svelte';
  import {getEditor} from './composerContext.js';

  type MyKlassConstructor = KlassConstructor<typeof LexicalNode> & {
    skipDecorateRender: boolean;
  };

  const contexts = getAllContexts();

  const editor: LexicalEditor = getEditor();
  // cache for svelte components' props
  const components: Record<string, Record<string, unknown>> = {};
  // cache for dirty components identified by mutation listener (cache is cleared after decorator listener renders them)
  const dirtyComponents: Array<string> = [];

  onMount(() => {
    // register Mutation Listener for all Decorator Node types (except where skipDecorateRender = true)
    // 1- capture dirty nodes (`dirtyComponents`)
    // 2- remove SvelteComponent from cache (`components`) for destroyed nodes
    const unregisterCallBacks: Array<() => void> = [];
    editor._nodes.forEach((n) => {
      if (
        n.klass.prototype instanceof DecoratorNode &&
        !(n.klass as MyKlassConstructor).skipDecorateRender
      ) {
        let unreg = editor.registerMutationListener(
          n.klass,
          (nodes, payload) => {
            for (let [key, val] of nodes) {
              if (val === 'destroyed') {
                delete components[key];
              } else {
                dirtyComponents.push(key);
              }
            }
          },
        );
        unregisterCallBacks.push(unreg);
      }
    });

    return mergeRegister(
      ...unregisterCallBacks,
      // register Decorator listener to render nodes
      // use dirty nodes identified by the mutation listener
      // 1- set `props` on existing svelte components
      // 2- create new components and put them in cache
      editor.registerDecoratorListener<{
        componentClass: Component;
        updateProps: (props: Record<string, unknown>) => void;
      }>((decorators) => {
        dirtyComponents.forEach((nodeKey) => {
          const decorator = decorators[nodeKey];
          const com = components[nodeKey];
          const element = editor.getElementByKey(nodeKey);
          if (element?.innerHTML && com) {
            const props = components[nodeKey];
            decorator.updateProps(props);
          } else if (element) {
            // render component to target and save reference in cache
            const props = $state({});
            decorator.updateProps(props);
            components[nodeKey] = props;
            mount(decorator.componentClass, {
              target: element,
              props: props,
              context: contexts,
            });
          }
        });
        dirtyComponents.length = 0;
      }),
    );
  });
</script>
