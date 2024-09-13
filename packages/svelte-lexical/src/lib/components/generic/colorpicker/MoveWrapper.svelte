<script lang="ts">
  import {calculateZoomLevel} from '@lexical/utils';
  import {skipAddingToHistoryStack} from './helpers.js';

  export let className: string | undefined = undefined;
  export let style: string | undefined = undefined;
  export let onChange;

  let divRef: HTMLDivElement;
  let draggedRef = false;

  function clamp(value: number, max: number, min: number) {
    return value > max ? max : value < min ? min : value;
  }

  const move = (e: MouseEvent): void => {
    if (divRef) {
      //const {current: div} = divRef;
      const {width, height, left, top} = divRef.getBoundingClientRect();
      const zoom = calculateZoomLevel(divRef);
      const x = clamp(e.clientX / zoom - left, width, 0);
      const y = clamp(e.clientY / zoom - top, height, 0);

      onChange({x, y});
    }
  };

  const onMouseDown = (e: MouseEvent): void => {
    if (e.button !== 0) {
      return;
    }

    move(e);

    const onMouseMove = (_e: MouseEvent): void => {
      draggedRef = true;
      $skipAddingToHistoryStack = true;
      move(_e);
    };

    const onMouseUp = (_e: MouseEvent): void => {
      if (draggedRef) {
        $skipAddingToHistoryStack = false;
      }

      document.removeEventListener('mousemove', onMouseMove, false);
      document.removeEventListener('mouseup', onMouseUp, false);

      move(_e);
      draggedRef = false;
    };

    document.addEventListener('mousemove', onMouseMove, false);
    document.addEventListener('mouseup', onMouseUp, false);
  };
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div bind:this={divRef} class={className} {style} on:mousedown={onMouseDown}>
  <slot />
</div>

<style>
  .color-picker-hue {
    width: 100%;
    position: relative;
    margin-top: 15px;
    height: 12px;
    background-image: linear-gradient(
      to right,
      rgb(255, 0, 0),
      rgb(255, 255, 0),
      rgb(0, 255, 0),
      rgb(0, 255, 255),
      rgb(0, 0, 255),
      rgb(255, 0, 255),
      rgb(255, 0, 0)
    );
    user-select: none;
    border-radius: 12px;
  }

  .color-picker-saturation {
    width: 100%;
    position: relative;
    margin-top: 15px;
    height: 150px;
    background-image: linear-gradient(transparent, black),
      linear-gradient(to right, white, transparent);
    user-select: none;
  }
</style>
