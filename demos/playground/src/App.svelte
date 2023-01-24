<script>
  import {onMount} from 'svelte';
  import {RichTextComposer} from 'svelte-lexical';
  import PlaygroundEditorTheme from './themes/PlaygroundEditorTheme';

  let composerComponent;

  onMount(() => {
    const editor = composerComponent.getEditor();
    editor.registerUpdateListener(({editorState}) => {
      console.log(JSON.stringify(editorState));
    });
  });
</script>

<main>
  <h1>Svelte Lexical!</h1>
  <p>
    This Rich Text Editor is build with <a
      href="https://github.com/umaranis/svelte-lexical/">
      svelte-lexical
    </a>
  </p>

  <!-- `text-align: left` added to reset the center text alignement of the main div. 
    Shouldn't there be a way in lexical to handle this?
    Check if lexical is affected by this by enclosing editor in a center aligned div
  -->
  <div style="text-align: left;">
    <RichTextComposer
      theme={PlaygroundEditorTheme}
      bind:this={composerComponent} />
  </div>
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
