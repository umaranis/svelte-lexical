<script>
  import pkgLRT from '@lexical/rich-text';
  import pkgLL from '@lexical/list';
  import TextEditor from '../../core/TextEditor.svelte';
  import RichTextPlugin from '../../core/plugins/RichTextPlugin.svelte';
  import HistoryPlugin from '../../core/plugins/HistoryPlugin.svelte';
  import ListPlugin from '../../core/plugins/ListPlugin.svelte';

  const { HeadingNode, QuoteNode } = pkgLRT;
  const { ListItemNode, ListNode } = pkgLL;

  export let theme;

  const config = {
    theme,
    nodes: [HeadingNode, ListNode, ListItemNode, QuoteNode],
    onError: (error) => {
      throw error;
    },
  };
</script>

<TextEditor {config}>
  <slot name="toolbar" slot="toolbar" />
  <RichTextPlugin />
  <HistoryPlugin />
  <ListPlugin />
</TextEditor>
