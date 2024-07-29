<script>
  import RichTextComposer from './RichTextComposer.svelte';
  import '../global.css';
</script>

<main>
  <img src="images/logo.svg" alt="Svelte Lexical!" />
  <p>
    Welcome to <a href="https://github.com/umaranis/svelte-lexical/">
      svelte-lexical
    </a>
    demo built using
    <a href="https://kit.svelte.dev">SvelteKit</a>
  </p>
  <div style="text-align: left;">
    <RichTextComposer />
  </div>
  <footer style="padding-top: 50px; color:gray; font-size:small">
    <a href="examples">See more examples</a>
  </footer>
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
