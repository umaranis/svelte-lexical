export {default as PlainTextPlugin} from './core/plugins/PlainTextPlugin.svelte';
export {default as RichTextPlugin} from './core/plugins/RichTextPlugin.svelte';
export {default as HistoryPlugin} from './core/plugins/HistoryPlugin.svelte';
export {default as SharedHistoryPlugin} from './core/plugins/SharedHistoryPlugin.svelte';
export {default as ListPlugin} from './core/plugins/ListPlugin.svelte';
export {default as CheckListPlugin} from './core/plugins/CheckListPlugin.svelte';
export {default as HorizontalRulePlugin} from './core/plugins/HorizontalRulePlugin.svelte';
export {default as ImagePlugin} from './core/plugins/ImagePlugin.svelte';
export {default as PlaceHolder} from './core/plugins/PlaceHolder.svelte';
export {default as AutoFocusPlugin} from './core/plugins/AutoFocusPlugin.svelte';
export {default as KeywordPlugin} from './core/plugins/KeywordPlugin.svelte';
export {default as CollaborationPlugin} from './core/plugins/collaboration/CollaborationPlugin.svelte';
export {default as AutoLinkPluginCore} from './core/plugins/auto-link/AutoLinkPluginCore.svelte';
export {default as AutoLinkPlugin} from './core/plugins/auto-link/AutoLinkPlugin.svelte';
export {default as LinkPlugin} from './core/plugins/link/LinkPlugin.svelte';
export * from './core/plugins/link/url';

export {HeadingNode, QuoteNode} from '@lexical/rich-text';
export {ListNode, ListItemNode} from '@lexical/list';
export {HorizontalRuleNode} from './core/plugins/HorizontalRuleNode';
export {ImageNode} from './core/plugins/ImageNode';
export {KeywordNode} from './core/plugins/KeywordNode';
export {AutoLinkNode, LinkNode} from '@lexical/link';

export {default as ToolbarRichText} from './components/richtext/ToolbarRichText.svelte';
export {default as ActionBar} from './components/actionbar/ActionBar.svelte';
export {default as TreeViewPlugin} from './core/plugins/TreeViewPlugin.svelte';

export {default as ContentEditable} from './core/ContentEditable.svelte';
export {default as Composer} from './core/Composer.svelte';

export {default as RichTextComposer} from './components/richtext/RichTextComposer.svelte';

export type {EditorThemeClasses, LexicalEditor} from 'lexical';
export {$createParagraphNode, $createTextNode, $getRoot} from 'lexical';
export {$createHeadingNode, $createQuoteNode} from '@lexical/rich-text';
export {$createLinkNode} from '@lexical/link';
export {$createListItemNode, $createListNode} from '@lexical/list';
