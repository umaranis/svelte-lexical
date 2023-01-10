<script lang="ts">
  import type {LexicalEditor} from 'lexical';

  export let onResizeStart: () => void;
  export let onResizeEnd: (
    width: 'inherit' | number,
    height: 'inherit' | number,
  ) => void;
  export let buttonRef: HTMLButtonElement | null;
  export let imageRef: HTMLElement | null;
  export let maxWidth: number | null;
  export let editor: LexicalEditor;
  export let showCaption: boolean;
  export let setShowCaption: (show: boolean) => void;
  export let captionsEnabled: boolean;

  let controlWrapperRef: HTMLDivElement;

  function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
  }

  const Direction = {
    east: 1 << 0,
    north: 1 << 3,
    south: 1 << 1,
    west: 1 << 2,
  };

  const userSelect = {
    priority: '',
    value: 'default',
  };

  const positioningRef: {
    currentHeight: 'inherit' | number;
    currentWidth: 'inherit' | number;
    direction: number;
    isResizing: boolean;
    ratio: number;
    startHeight: number;
    startWidth: number;
    startX: number;
    startY: number;
  } = {
    currentHeight: 0,
    currentWidth: 0,
    direction: 0,
    isResizing: false,
    ratio: 0,
    startHeight: 0,
    startWidth: 0,
    startX: 0,
    startY: 0,
  };

  const editorRootElement = editor.getRootElement();
  // Find max width, accounting for editor padding.
  const maxWidthContainer = maxWidth
    ? maxWidth
    : editorRootElement !== null
    ? editorRootElement.getBoundingClientRect().width - 20
    : 100;
  const maxHeightContainer =
    editorRootElement !== null
      ? editorRootElement.getBoundingClientRect().height - 20
      : 100;

  const minWidth = 100;
  const minHeight = 100;

  const setStartCursor = (direction: number) => {
    const ew = direction === Direction.east || direction === Direction.west;
    const ns = direction === Direction.north || direction === Direction.south;
    const nwse =
      (direction & Direction.north && direction & Direction.west) ||
      (direction & Direction.south && direction & Direction.east);

    const cursorDir = ew ? 'ew' : ns ? 'ns' : nwse ? 'nwse' : 'nesw';

    if (editorRootElement !== null) {
      editorRootElement.style.setProperty(
        'cursor',
        `${cursorDir}-resize`,
        'important',
      );
    }
    if (document.body !== null) {
      document.body.style.setProperty(
        'cursor',
        `${cursorDir}-resize`,
        'important',
      );
      userSelect.value = document.body.style.getPropertyValue(
        '-webkit-user-select',
      );
      userSelect.priority = document.body.style.getPropertyPriority(
        '-webkit-user-select',
      );
      document.body.style.setProperty(
        '-webkit-user-select',
        `none`,
        'important',
      );
    }
  };

  const setEndCursor = () => {
    if (editorRootElement !== null) {
      editorRootElement.style.setProperty('cursor', 'default');
    }
    if (document.body !== null) {
      document.body.style.setProperty('cursor', 'default');
      document.body.style.setProperty(
        '-webkit-user-select',
        userSelect.value,
        userSelect.priority,
      );
    }
  };

  const handlePointerDown = (event: PointerEvent, direction: number) => {
    if (!editor.isEditable()) {
      return;
    }

    const image = imageRef;
    const controlWrapper = controlWrapperRef;

    if (image !== null && controlWrapper !== null) {
      const {width, height} = image.getBoundingClientRect();
      const positioning = positioningRef;
      positioning.startWidth = width;
      positioning.startHeight = height;
      positioning.ratio = width / height;
      positioning.currentWidth = width;
      positioning.currentHeight = height;
      positioning.startX = event.clientX;
      positioning.startY = event.clientY;
      positioning.isResizing = true;
      positioning.direction = direction;

      setStartCursor(direction);
      onResizeStart();

      controlWrapper.classList.add('image-control-wrapper--resizing');
      image.style.height = `${height}px`;
      image.style.width = `${width}px`;

      document.addEventListener('pointermove', handlePointerMove);
      document.addEventListener('pointerup', handlePointerUp);
    }
  };

  const handlePointerMove = (event: PointerEvent) => {
    const image = imageRef;
    const positioning = positioningRef;

    const isHorizontal =
      positioning.direction & (Direction.east | Direction.west);
    const isVertical =
      positioning.direction & (Direction.south | Direction.north);

    if (image !== null && positioning.isResizing) {
      // Corner cursor
      if (isHorizontal && isVertical) {
        let diff = Math.floor(positioning.startX - event.clientX);
        diff = positioning.direction & Direction.east ? -diff : diff;

        const width = clamp(
          positioning.startWidth + diff,
          minWidth,
          maxWidthContainer,
        );

        const height = width / positioning.ratio;
        image.style.width = `${width}px`;
        image.style.height = `${height}px`;
        positioning.currentHeight = height;
        positioning.currentWidth = width;
      } else if (isVertical) {
        let diff = Math.floor(positioning.startY - event.clientY);
        diff = positioning.direction & Direction.south ? -diff : diff;

        const height = clamp(
          positioning.startHeight + diff,
          minHeight,
          maxHeightContainer,
        );

        image.style.height = `${height}px`;
        positioning.currentHeight = height;
      } else {
        let diff = Math.floor(positioning.startX - event.clientX);
        diff = positioning.direction & Direction.east ? -diff : diff;

        const width = clamp(
          positioning.startWidth + diff,
          minWidth,
          maxWidthContainer,
        );

        image.style.width = `${width}px`;
        positioning.currentWidth = width;
      }
    }
  };

  const handlePointerUp = () => {
    const image = imageRef;
    const positioning = positioningRef;
    const controlWrapper = controlWrapperRef;
    if (image !== null && controlWrapper !== null && positioning.isResizing) {
      const width = positioning.currentWidth;
      const height = positioning.currentHeight;
      positioning.startWidth = 0;
      positioning.startHeight = 0;
      positioning.ratio = 0;
      positioning.startX = 0;
      positioning.startY = 0;
      positioning.currentWidth = 0;
      positioning.currentHeight = 0;
      positioning.isResizing = false;

      controlWrapper.classList.remove('image-control-wrapper--resizing');

      setEndCursor();
      onResizeEnd(width, height);

      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
    }
  };
</script>

<div bind:this={controlWrapperRef}>
  {#if !showCaption && captionsEnabled}
    <button
      class="image-caption-button"
      bind:this={buttonRef}
      on:click={() => {
        setShowCaption(!showCaption);
      }}>
      Add Caption
    </button>
  {/if}
  <div
    class="image-resizer image-resizer-n"
    on:pointerdown={(event) => {
      handlePointerDown(event, Direction.north);
    }} />
  <div
    class="image-resizer image-resizer-ne"
    on:pointerdown={(event) => {
      handlePointerDown(event, Direction.north | Direction.east);
    }} />
  <div
    class="image-resizer image-resizer-e"
    on:pointerdown={(event) => {
      handlePointerDown(event, Direction.east);
    }} />
  <div
    class="image-resizer image-resizer-se"
    on:pointerdown={(event) => {
      handlePointerDown(event, Direction.south | Direction.east);
    }} />
  <div
    class="image-resizer image-resizer-s"
    on:pointerdown={(event) => {
      handlePointerDown(event, Direction.south);
    }} />
  <div
    class="image-resizer image-resizer-sw"
    on:pointerdown={(event) => {
      handlePointerDown(event, Direction.south | Direction.west);
    }} />
  <div
    class="image-resizer image-resizer-w"
    on:pointerdown={(event) => {
      handlePointerDown(event, Direction.west);
    }} />
  <div
    class="image-resizer image-resizer-nw"
    on:pointerdown={(event) => {
      handlePointerDown(event, Direction.north | Direction.west);
    }} />
</div>
