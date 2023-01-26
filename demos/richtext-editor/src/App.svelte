<script>
  import {RichTextComposer} from 'svelte-lexical';
  import PlaygroundEditorTheme from './themes/PlaygroundEditorTheme';
</script>

<main>
  <h1>Svelte Lexical!</h1>
  <p>
    This Rich Text Editor is build with <a
      href="https://github.com/umaranis/svelte-lexical/">
      svelte-lexical
    </a>
  </p>

  <RichTextComposer theme={PlaygroundEditorTheme} />
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
