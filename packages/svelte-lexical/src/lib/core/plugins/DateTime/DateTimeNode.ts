import {
  $getState,
  $setState,
  buildImportMap,
  createCommand,
  createState,
  DecoratorNode,
  type DOMConversionOutput,
  type DOMExportOutput,
  type LexicalCommand,
  type LexicalNode,
  type SerializedLexicalNode,
  type Spread,
  type StateConfigValue,
  type StateValueOrUpdater,
} from 'lexical';
import type {ComponentProps} from 'svelte';
import DateTimeComponent from './DateTimeComponent.svelte';

export type DateTimePayload = {
  dateTime: Date;
};

export const INSERT_DATETIME_COMMAND: LexicalCommand<DateTimePayload> =
  createCommand('INSERT_DATETIME_COMMAND');

const getDateTimeText = (dateTime: Date) => {
  if (dateTime === undefined) {
    return '';
  }
  const hours = dateTime?.getHours();
  const minutes = dateTime?.getMinutes();
  return (
    dateTime.toDateString() +
    (hours === 0 && minutes === 0
      ? ''
      : ` ${hours.toString().padStart(2, '0')}:${minutes
          .toString()
          .padStart(2, '0')}`)
  );
};

export type SerializedDateTimeNode = Spread<
  {
    dateTime?: string;
  },
  SerializedLexicalNode
>;

function $convertDateTimeElement(
  domNode: HTMLElement,
): DOMConversionOutput | null {
  const dateTimeValue = domNode.getAttribute('data-lexical-datetime');
  if (dateTimeValue) {
    const node = $createDateTimeNode(new Date(Date.parse(dateTimeValue)));
    return {node};
  }
  return null;
}

const dateTimeState = createState('dateTime', {
  parse: (v) => new Date(v as string),
  unparse: (v) => v.toISOString(),
});

type DecoratorDateTimeType = {
  componentClass: typeof DateTimeComponent;
  updateProps: (props: ComponentProps<typeof DateTimeComponent>) => void;
};

export class DateTimeNode extends DecoratorNode<DecoratorDateTimeType> {
  $config() {
    return this.config('datetime', {
      extends: DecoratorNode,
      importDOM: buildImportMap({
        span: (domNode) =>
          domNode.getAttribute('data-lexical-datetime') !== null
            ? {
                conversion: $convertDateTimeElement,
                priority: 2,
              }
            : null,
      }),
      stateConfigs: [{flat: true, stateConfig: dateTimeState}],
    });
  }

  getDateTime(): StateConfigValue<typeof dateTimeState> {
    return $getState(this, dateTimeState);
  }

  setDateTime(valueOrUpdater: StateValueOrUpdater<typeof dateTimeState>): this {
    return $setState(this, dateTimeState, valueOrUpdater);
  }

  getTextContent(): string {
    const dateTime = this.getDateTime();
    return getDateTimeText(dateTime);
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('span');
    element.textContent = getDateTimeText(this.getDateTime());
    element.setAttribute(
      'data-lexical-datetime',
      this.getDateTime()?.toString() || '',
    );
    return {element};
  }

  createDOM(): HTMLElement {
    const element = document.createElement('span');
    element.setAttribute(
      'data-lexical-datetime',
      this.getDateTime()?.toString() || '',
    );
    element.style.display = 'inline-block';
    return element;
  }

  updateDOM(): false {
    return false;
  }

  isInline(): boolean {
    return true;
  }

  decorate(): DecoratorDateTimeType {
    const dateTime = this.getDateTime();
    return {
      componentClass: DateTimeComponent,
      updateProps: (props) => {
        props.dateTime = dateTime;
        props.nodeKey = this.__key;
      },
    };
  }
}

export function $createDateTimeNode(dateTime: Date): DateTimeNode {
  return new DateTimeNode().setDateTime(dateTime);
}

export function $isDateTimeNode(
  node: LexicalNode | null | undefined,
): node is DateTimeNode {
  return node instanceof DateTimeNode;
}
