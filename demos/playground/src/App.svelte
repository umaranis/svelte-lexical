<script lang="ts">
  import {setContext} from 'svelte';
  import RichTextComposer from './RichTextComposer.svelte';
  import Settings from './settings/Settings.svelte';
  import {createSettingsStore} from './settings/settingsStore';
  import {MediaQuery} from 'svelte/reactivity';

  const isDarkMode = new MediaQuery('(prefers-color-scheme: dark)');

  const settings = createSettingsStore();
  setContext('settings', settings);

  let imageSrc = $state('images/logo.svg');

  $effect(() => {
    // get around this issue: https://svelte.dev/docs/svelte/runtime-warnings#Client-warnings-hydration_attribute_changed
    imageSrc = isDarkMode.current ? 'images/logo_white.svg' : 'images/logo.svg';
  });
</script>

<main>
  <img src={imageSrc} alt="Svelte Lexical!" />
  <p>
    This is the <a href="https://github.com/umaranis/svelte-lexical/">
      svelte-lexical
    </a>
    <strong>playground.</strong>
  </p>
  <p>
    It demonstrates most of the features of the library. It is also used for
    running end-to-end (e2e) tests.
  </p>

  <!-- `text-align: left` added to reset the center text alignment of the main div.
    Shouldn't there be a way in lexical to handle this?
    Check if lexical is affected by this by enclosing editor in a center aligned div
  -->
  <div style="text-align: left;">
    <RichTextComposer />
    <Settings />
  </div>
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

  a {
    color: var(--link-color);
  }
</style>
