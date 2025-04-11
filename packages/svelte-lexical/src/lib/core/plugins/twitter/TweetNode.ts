import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  ElementFormatType,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  Spread,
} from 'lexical';
import {
  DecoratorBlockNode,
  type SerializedDecoratorBlockNode,
} from '../DecoratorBlockNode.js';
import TweetComponent from './TweetComponent.svelte';
import type {ComponentProps} from 'svelte';

function $convertTweetElement(
  domNode: HTMLDivElement,
): DOMConversionOutput | null {
  const id = domNode.getAttribute('data-lexical-tweet-id');
  if (id) {
    const node = $createTweetNode(id);
    return {node};
  }
  return null;
}

export type SerializedTweetNode = Spread<
  {
    id: string;
  },
  SerializedDecoratorBlockNode
>;

type DecoratorTweetType = {
  componentClass: typeof TweetComponent;
  updateProps: (props: ComponentProps<typeof TweetComponent>) => void;
};

export class TweetNode extends DecoratorBlockNode {
  __id: string;

  static getType(): string {
    return 'tweet';
  }

  static clone(node: TweetNode): TweetNode {
    return new TweetNode(node.__id, node.__format, node.__key);
  }

  static importJSON(serializedNode: SerializedTweetNode): TweetNode {
    return $createTweetNode(serializedNode.id).updateFromJSON(serializedNode);
  }

  exportJSON(): SerializedTweetNode {
    return {
      ...super.exportJSON(),
      id: this.getId(),
    };
  }

  static importDOM(): DOMConversionMap<HTMLDivElement> | null {
    return {
      div: (domNode: HTMLDivElement) => {
        if (!domNode.hasAttribute('data-lexical-tweet-id')) {
          return null;
        }
        return {
          conversion: $convertTweetElement,
          priority: 2,
        };
      },
    };
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('div');
    element.setAttribute('data-lexical-tweet-id', this.__id);
    const text = document.createTextNode(this.getTextContent());
    element.append(text);
    return {element};
  }

  constructor(id: string, format?: ElementFormatType, key?: NodeKey) {
    super(format, key);
    this.__id = id;
  }

  getId(): string {
    return this.__id;
  }

  getTextContent(
    _includeInert?: boolean | undefined,
    _includeDirectionless?: false | undefined,
  ): string {
    return `https://x.com/i/web/status/${this.__id}`;
  }

  decorate(editor: LexicalEditor, config: EditorConfig): DecoratorTweetType {
    const embedBlockTheme = config.theme.embedBlock || {};
    const className = {
      base: embedBlockTheme.base || '',
      focus: embedBlockTheme.focus || '',
    };
    return {
      componentClass: TweetComponent,
      updateProps: (props) => {
        props.className = className;
        props.format = this.__format;
        props.loadingComponent = 'Loading...';
        props.nodeKey = this.__key;
        props.tweetID = this.__id;
      },
    };
  }
}

export function $createTweetNode(tweetID: string): TweetNode {
  return new TweetNode(tweetID);
}

export function $isTweetNode(
  node: TweetNode | LexicalNode | null | undefined,
): node is TweetNode {
  return node instanceof TweetNode;
}
