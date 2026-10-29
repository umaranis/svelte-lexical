<script lang="ts">
  import './DateTimeNode.css';
  import {
    $getNodeByKey as getNodeByKey,
    IS_BOLD,
    IS_HIGHLIGHT,
    IS_ITALIC,
    IS_STRIKETHROUGH,
    IS_UNDERLINE,
    type NodeKey,
  } from 'lexical';
  import {getEditor} from '../../composerContext.js';
  import {createNodeSelectionStore} from '../../nodeSelectionStore.js';
  import Portal from '../../../components/generic/portal/Portal.svelte';
  import DayPicker from './DayPicker.svelte';
  import {
    $isDateTimeNode as isDateTimeNode,
    type DateTimeNode,
  } from './DateTimeNode.js';

  interface Props {
    dateTime: Date | undefined;
    format: number;
    nodeKey: NodeKey;
  }

  let {dateTime, format, nodeKey}: Props = $props();

  const FORMAT_CLASSES = [
    [IS_BOLD, 'bold'],
    [IS_HIGHLIGHT, 'highlight'],
    [IS_ITALIC, 'italic'],
    [IS_STRIKETHROUGH, 'strikethrough'],
    [IS_UNDERLINE, 'underline'],
  ] as const;

  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const OFFSET = 5;
  const SHIFT_PADDING = 10;

  const editor = getEditor();
  let isOpen = $state(false);
  let pillRef: HTMLDivElement | undefined = $state();
  let pickerRef: HTMLDivElement | undefined = $state();
  let pickerStyle = $state('');
  // svelte-ignore state_referenced_locally
  let selected = $state(dateTime);
  let includeTime = $state(getInitialIncludeTime());
  let timeValue = $state(getInitialTimeValue());

  function getInitialIncludeTime() {
    if (dateTime === undefined) {
      return false;
    }
    const hours = dateTime?.getHours();
    const minutes = dateTime?.getMinutes();
    return hours !== 0 || minutes !== 0;
  }

  function getInitialTimeValue() {
    if (dateTime === undefined) {
      return '00:00';
    }
    const hours = dateTime?.getHours();
    const minutes = dateTime?.getMinutes();
    if (hours !== 0 || minutes !== 0) {
      return `${hours?.toString().padStart(2, '0')}:${minutes
        ?.toString()
        .padStart(2, '0')}`;
    }
    return '00:00';
  }

  // svelte-ignore state_referenced_locally
  const isNodeSelected = createNodeSelectionStore(editor, nodeKey);

  const classNames = $derived.by(() => {
    const names = ['dateTimePill'];
    for (const [flag, className] of FORMAT_CLASSES) {
      if (format & flag) {
        names.push(className);
      }
    }
    if ($isNodeSelected) {
      names.push('selected');
    }
    return names.join(' ');
  });

  // placement bottom-start, flip to top-start, shift with padding (same as the floating-ui setup in lexical playground)
  function updatePosition() {
    if (!pillRef || !pickerRef) {
      return;
    }
    const reference = pillRef.getBoundingClientRect();
    const floating = pickerRef.getBoundingClientRect();
    let top = reference.bottom + OFFSET;
    if (
      top + floating.height > window.innerHeight &&
      reference.top - OFFSET - floating.height >= 0
    ) {
      top = reference.top - OFFSET - floating.height;
    }
    const left = Math.max(
      SHIFT_PADDING,
      Math.min(
        reference.left,
        window.innerWidth - floating.width - SHIFT_PADDING,
      ),
    );
    pickerStyle = `top: ${top}px; left: ${left}px;`;
  }

  $effect(() => {
    if (!isOpen || !pickerRef) {
      return;
    }
    updatePosition();
    const resizeObserver = new ResizeObserver(updatePosition);
    resizeObserver.observe(pickerRef);
    window.addEventListener('resize', updatePosition);
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        isOpen = false;
      }
    };
    document.addEventListener('keydown', onKeyDown);
    // lock scroll while picker is open
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updatePosition);
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  });

  function withDateTimeNode(cb: (node: DateTimeNode) => void) {
    editor.update(() => {
      const node = getNodeByKey(nodeKey);
      if (isDateTimeNode(node)) {
        cb(node);
      }
    });
  }

  function setTime(date: Date, hours: number, minutes: number) {
    const newDate = new Date(date);
    newDate.setHours(hours, minutes);
    return newDate;
  }

  function handleCheckboxChange(e: Event & {currentTarget: HTMLInputElement}) {
    const checked = e.currentTarget.checked;
    withDateTimeNode((node) => {
      if (checked) {
        includeTime = true;
      } else {
        if (selected) {
          const newSelectedDate = setTime(selected, 0, 0);
          node.setDateTime(newSelectedDate);
        }
        includeTime = false;
        timeValue = '00:00';
      }
    });
  }

  function handleTimeChange(e: Event & {currentTarget: HTMLInputElement}) {
    const time = e.currentTarget.value;
    withDateTimeNode((node) => {
      if (!selected) {
        timeValue = time;
        return;
      }
      const [hours, minutes] = time
        .split(':')
        .map((str: string) => parseInt(str, 10));
      const newSelectedDate = setTime(selected, hours, minutes);
      selected = newSelectedDate;
      node.setDateTime(newSelectedDate);
      timeValue = time;
    });
  }

  function handleDaySelect(date: Date | undefined) {
    withDateTimeNode((node) => {
      if (!timeValue || !date) {
        selected = date;
        return;
      }
      const [hours, minutes] = timeValue
        .split(':')
        .map((str) => parseInt(str, 10));
      const newDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        hours,
        minutes,
      );
      node.setDateTime(newDate);
      selected = newDate;
    });
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class={classNames}
  bind:this={pillRef}
  onclick={(e) => {
    e.preventDefault();
    isOpen = true;
  }}>
  {dateTime?.toDateString() + (includeTime ? ' ' + timeValue : '') ||
    'Invalid Date'}
  {#if isOpen}
    <Portal>
      <div
        class="dateTimeOverlay"
        role="presentation"
        onclick={(e) => {
          if (e.target === e.currentTarget) {
            isOpen = false;
          }
        }}>
        <div
          class="dateTimePicker"
          role="dialog"
          bind:this={pickerRef}
          style={pickerStyle}>
          <DayPicker
            {selected}
            onSelect={handleDaySelect}
            startMonth={new Date(1925, 0)}
            endMonth={new Date(2042, 7)} />
          <form style="margin-block-end: 1em;">
            <div
              style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; width: 300px;">
              <input
                type="checkbox"
                id="option1"
                name="option1"
                value="value1"
                checked={includeTime}
                onchange={handleCheckboxChange} />
              <label>
                <input
                  type="time"
                  value={timeValue}
                  oninput={handleTimeChange}
                  disabled={!includeTime} />
              </label>
              <span>{userTimeZone}</span>
            </div>
          </form>
        </div>
      </div>
    </Portal>
  {/if}
</div>
