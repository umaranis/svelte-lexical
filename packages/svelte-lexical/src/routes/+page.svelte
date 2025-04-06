<script>
  import RichTextComposer from './RichTextComposer.svelte';
  import '../global.css';
  import GitHubButton from './GitHubButton.svelte';
  import PlaygroundButton from './PlaygroundButton.svelte';
  import {MediaQuery} from 'svelte/reactivity';

  const isDarkMode = new MediaQuery('(prefers-color-scheme: dark)');

  let imageSrc = $state('images/logo.svg');

  $effect(() => {
    // get around this issue: https://svelte.dev/docs/svelte/runtime-warnings#Client-warnings-hydration_attribute_changed
    imageSrc = isDarkMode.current ? 'images/logo_white.svg' : 'images/logo.svg';
  });
</script>

<main>
  <img src={imageSrc} alt="Svelte Lexical!" />
  <p style="margin-top: -1em; line-height: 1.7em">
    Welcome to <span class="emp-sl">Svelte-Lexical</span>
    , a rich text editor for
    <span class="emp-svelte">Svelte</span>
    and
    <span class="emp-svelte">SvelteKit</span>
    .
  </p>
  <div style="margin-top: 7em">
    <PlaygroundButton />
    <GitHubButton />
  </div>
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

  .emp-sl {
    font-size: 1em;
    background-color: #fb8500; /*#ff6600; */
    color: white;
    padding: 0.2em 0.2em;
    border-radius: 0.2em;
  }

  .emp-svelte {
    font-size: 1em;
    background-color: #219ebc;
    color: white;
    padding: 0.2em 0.2em;
    border-radius: 0.2em;
  }
</style>
