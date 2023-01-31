<script lang="ts">
  import type {LexicalEditor} from 'lexical';
  import {onMount, SvelteComponent} from 'svelte';
  import {getContext} from 'svelte';

  const editor: LexicalEditor = getContext('editor');

  onMount(() => {
    return editor.registerDecoratorListener<{
      componentClass: typeof SvelteComponent;
      props: object;
    }>((decorators) => {
      // The editor's decorators object is passed in!
      console.log(decorators);

      const decoratorKeys = Object.keys(decorators);

      for (let i = 0; i < decoratorKeys.length; i++) {
        const nodeKey = decoratorKeys[i];

        const element = editor.getElementByKey(nodeKey);

        if (!element?.innerHTML) {
          if (element !== null) {
            new decorators[nodeKey]['componentClass']({
              target: element,
              props: decorators[nodeKey]['props'],
            });
          }
        }
      }
    });
  });
</script>
