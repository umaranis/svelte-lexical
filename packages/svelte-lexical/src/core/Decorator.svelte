<script lang="ts">
  import {mergeRegister} from '@lexical/utils';
  import {DecoratorNode, type LexicalEditor} from 'lexical';
  import {getContext, onMount, SvelteComponent} from 'svelte';

  const editor: LexicalEditor = getContext('editor');
  const components: Record<string, SvelteComponent> = {};
  const dirtyComponents: Array<string> = [];

  onMount(() => {
    // register Mutation Listener for all Decorator Node types
    // 1- capture dirty nodes (`dirtyComponents`)
    // 2- remove SvelteComponent from cache (`components`) for destroyed nodes
    const unregisterCallBacks: Array<() => void> = [];
    editor._nodes.forEach((n) => {
      if (n.klass.prototype instanceof DecoratorNode) {
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
      // 1- set `props` on existing components
      // 2- create new components and put them in cache
      editor.registerDecoratorListener<{
        componentClass: typeof SvelteComponent;
        props: object;
      }>((decorators) => {
        dirtyComponents.forEach((nodeKey) => {
          const decorator = decorators[nodeKey];
          const com = components[nodeKey];
          const element = editor.getElementByKey(nodeKey);
          if (element?.innerHTML && com) {
            com.$set(decorator.props);
          } else if (element) {
            // render component to target and save reference in cache
            components[nodeKey] = new decorator.componentClass({
              target: element,
              props: decorator.props,
            });
          }
        });
        dirtyComponents.length = 0;
      }),
    );
  });
</script>
