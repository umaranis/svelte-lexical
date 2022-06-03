<script>
    import { RichTextBasicComposer } from 'svelte-lexical';
    import PlaygroundEditorTheme from '../themes/PlaygroundEditorTheme';
    import '../global.css';
</script>
<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
<RichTextBasicComposer theme={PlaygroundEditorTheme}/>