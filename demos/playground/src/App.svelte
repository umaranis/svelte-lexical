<script lang="ts">
  import {setContext} from 'svelte';
  import RichTextComposer from './RichTextComposer.svelte';
  import Settings from './settings/Settings.svelte';
  import {createSettingsStore} from './settings/settingsStore';
  import {
    ThemeSelector,
    ThemeImage,
  } from 'svelte-lexical/dist/themes/system-light-dark/ui';

  const settings = createSettingsStore();
  setContext('settings', settings);
</script>

<main>
  <div class="header-container">
    <ThemeSelector />
  </div>
  <ThemeImage
    lightSrc="images/logo.svg"
    darkSrc="images/logo_white.svg"
    alt="Svelte Lexical!"
    style="margin: 2em auto; max-width: 800px; display: block;" />
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

  <footer>
    <p>
      Created by <a
        href="https://umaranis.com"
        target="_blank"
        rel="noopener noreferrer">
        Syed Umar Anis
      </a>
    </p>
  </footer>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    text-align: center;
    padding: 1em;
    max-width: none;
    margin: 0 auto;
  }

  .header-container {
    display: flex;
    justify-content: flex-end;
    /* padding: 0.5em 1em; */ /* this somehow affects a unit test for selection*/
  }

  a {
    color: var(--link-color);
  }

  footer {
    margin-top: auto;
    text-align: center;
    padding: 2em 1em 1em;
    font-size: 0.9em;
  }

  footer a {
    color: var(--link-color);
    text-decoration: none;
    font-weight: 500;
  }

  footer a:hover {
    text-decoration: underline;
  }
</style>
