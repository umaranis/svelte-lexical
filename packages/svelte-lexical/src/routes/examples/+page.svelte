<script>
  import Composer2RichTextBasic from './Composer2RichTextBasic.svelte';
  import Composer3RichTextAdv from './Composer3RichTextAdv.svelte';
  import '../../global.css';
  import Composer1PlainText from './Composer1PlainText.svelte';
  import Composer4RtLinks from './Composer4RTLinks.svelte';
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
    <div>
      <div class="example-intro">
        <h1>1. Plain Text Editor</h1>
        <div>Plain text Editor with history plugin.</div>
      </div>
      <Composer1PlainText />
    </div>
    <div>
      <div class="example-intro">
        <h1>2. Rich Text Editor - Basic</h1>
        <div>Basic Rich text Editor with no plugins.</div>
      </div>
      <Composer2RichTextBasic />
    </div>
    <div>
      <div class="example-intro">
        <h1>3. Rich Text Editor - Advanced</h1>
        <div>
          Rich text Editor with following plugins: History, List, CheckList,
          HorizontalRule, Image and MarkdownShortcutPlugin.
        </div>
      </div>
      <Composer3RichTextAdv />
    </div>
    <div>
      <div class="example-intro">
        <h1>4. Rich Text Editor with Hyperlinks</h1>
        <div>
          Rich text Editor with links support using LinkPlugin, AutoLinkPlugin
          and FloatingLinkEditorPlugin. It also includes all plugins from the
          previous example i.e. History, List, CheckList, HorizontalRule, Image
          and MarkdownShortcutPlugin.
        </div>
      </div>
      <Composer4RtLinks />
    </div>
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

  .example-intro {
    max-width: 1100px;
    margin: 70px auto 10px auto;
  }
</style>
