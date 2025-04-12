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
import BlueskyPostComponent from './BlueskyPostComponent.svelte';
import type {ComponentProps} from 'svelte';

function $convertBlueskyElement(
  domNode: HTMLDivElement,
): DOMConversionOutput | null {
  const profile = domNode.getAttribute('data-lexical-profile-id');
  const postKey = domNode.getAttribute('data-lexical-post-key');
  if (profile && postKey) {
    const node = $createBlueskyNode(profile, postKey);
    return {node};
  }
  return null;
}

export type SerializedBlueskyNode = Spread<
  {
    profile: string;
    postKey: string;
  },
  SerializedDecoratorBlockNode
>;

type DecoratorBlueskyType = {
  componentClass: typeof BlueskyPostComponent;
  updateProps: (props: ComponentProps<typeof BlueskyPostComponent>) => void;
};

export class BlueskyNode extends DecoratorBlockNode {
  __profile: string;
  __postKey: string;

  static getType(): string {
    return 'bluesky';
  }

  static clone(node: BlueskyNode): BlueskyNode {
    return new BlueskyNode(
      node.__profile,
      node.__postKey,
      node.__format,
      node.__key,
    );
  }

  static importJSON(serializedNode: SerializedBlueskyNode): BlueskyNode {
    return $createBlueskyNode(
      serializedNode.profile,
      serializedNode.postKey,
    ).updateFromJSON(serializedNode);
  }

  exportJSON(): SerializedBlueskyNode {
    return {
      ...super.exportJSON(),
      profile: this.__profile,
      postKey: this.__postKey,
    };
  }

  static importDOM(): DOMConversionMap<HTMLDivElement> | null {
    return {
      div: (domNode: HTMLDivElement) => {
        if (!domNode.hasAttribute('data-lexical-profile-id')) {
          return null;
        }
        return {
          conversion: $convertBlueskyElement,
          priority: 2,
        };
      },
    };
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('div');
    element.setAttribute('data-lexical-profile-id', this.__profile);
    element.setAttribute('data-lexical-post-key', this.__postKey);
    const text = document.createTextNode(this.getTextContent());
    element.append(text);
    return {element};
  }

  constructor(
    profile: string,
    postKey: string,
    format?: ElementFormatType,
    key?: NodeKey,
  ) {
    super(format, key);
    this.__profile = profile;
    this.__postKey = postKey;
  }

  getProfile(): string {
    return this.__profile;
  }

  getPostKey(): string {
    return this.__postKey;
  }

  getTextContent(
    _includeInert?: boolean | undefined,
    _includeDirectionless?: false | undefined,
  ): string {
    return `https://bsky.app/profile/${this.__profile}/post/${this.__postKey}`;
  }

  decorate(editor: LexicalEditor, config: EditorConfig): DecoratorBlueskyType {
    const embedBlockTheme = config.theme.embedBlock || {};
    const className = {
      base: embedBlockTheme.base || '',
      focus: embedBlockTheme.focus || '',
    };
    return {
      componentClass: BlueskyPostComponent,
      updateProps: (props) => {
        props.className = className;
        props.format = this.__format;
        props.nodeKey = this.__key;
        props.profile = this.__profile;
        props.postKey = this.__postKey;
      },
    };
  }
}

export function $createBlueskyNode(
  profile: string,
  postKey: string,
): BlueskyNode {
  return new BlueskyNode(profile, postKey);
}

export function $isBlueskyNode(
  node: BlueskyNode | LexicalNode | null | undefined,
): node is BlueskyNode {
  return node instanceof BlueskyNode;
}
