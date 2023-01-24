export {default as PlainTextPlugin} from './core/plugins/PlainTextPlugin.svelte';
export {default as RichTextPlugin} from './core/plugins/RichTextPlugin.svelte';
export {default as HistoryPlugin} from './core/plugins/HistoryPlugin.svelte';
export {default as ListPlugin} from './core/plugins/ListPlugin.svelte';
export {default as CheckListPlugin} from './core/plugins/CheckListPlugin.svelte';
export {default as HorizontalRulePlugin} from './core/plugins/HorizontalRulePlugin.svelte';
export {default as ImagePlugin} from './core/plugins/ImagePlugin.svelte';

export {HeadingNode, QuoteNode} from '@lexical/rich-text';
export {ListNode, ListItemNode} from '@lexical/list';
export {HorizontalRuleNode} from './core/plugins/HorizontalRuleNode';
export {ImageNode} from './core/plugins/ImageNode';

export {default as ToolbarBasic} from './components/richtext-basic/ToolbarBasic.svelte';
export {default as ToolbarRichText} from './components/richtext/ToolbarRichText.svelte';
export {default as ActionBar} from './components/actionbar/ActionBar.svelte';
export {default as TreeViewPlugin} from './core/plugins/TreeViewPlugin.svelte';

export {default as ContentEditable} from './core/ContentEditable.svelte';
export {default as Composer} from './core/Composer.svelte';

export {default as RichTextComposer} from './components/richtext/RichTextComposer.svelte';

export type {EditorThemeClasses, LexicalEditor} from 'lexical';
