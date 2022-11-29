<script lang="ts">
    import {LexicalEditor} from 'lexical';
    import {getContext} from 'svelte';
    import {importFile} from '../../utils/fileImportExport.ts';

    const editor: LexicalEditor = getContext('editor');
</script>
<button
        class="action-button import"
        on:click={() => importFile(editor)}
        title="Import"
        aria-label="Import editor state from JSON">
    <i class="import" />
</button>