<script>
  import PlainTextComposer from './PlainTextComposer.svelte';
</script>

<main>
  <img src="images/logo.svg" alt="Svelte Lexical!" />
  <p>
    This Plain Text Editor is build with <a
      href="https://github.com/umaranis/svelte-lexical/">
      svelte-lexical
    </a>
  </p>

  <PlainTextComposer />
</main>

<style>
  main {
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
