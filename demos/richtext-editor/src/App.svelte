<script>
  import {RichTextComposer} from 'svelte-lexical';
  import {theme as editorTheme} from 'svelte-lexical/dist/themes/default';
</script>

<main>
  <div class="header">
    <img src="/images/logo.svg" alt="Svelte Lexical!" />
    <p>
      This Rich Text Editor is build with <a
        href="https://github.com/umaranis/svelte-lexical/">
        svelte-lexical
      </a>
    </p>
  </div>

  <RichTextComposer theme={editorTheme} />
</main>

<style>
  .header {
    text-align: center;
    padding: 1em;
    max-width: none;
    margin: 0 auto;
  }

  img {
    margin: 2em;
    max-width: 800px;
  }
</style>
