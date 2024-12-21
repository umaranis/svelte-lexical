<script lang="ts">
  import {run} from 'svelte/legacy';

  import {
    basicColors,
    transformColor,
    type Position,
    skipAddingToHistoryStack,
  } from './helpers.js';
  import MoveWrapper from './MoveWrapper.svelte';
  import TextInput from '../input/TextInput.svelte';

  const WIDTH = 214;
  const HEIGHT = 150;

  interface Props {
    color: string;
    onChange: ((value: string, skipHistoryStack: boolean) => void) | undefined;
  }

  let {color, onChange}: Props = $props();

  let selfColor = $state(transformColor('hex', color));
  let inputColor = $state(color);
  let innerDivRef: HTMLDivElement | null = $state(null);

  let saturationPosition = $derived({
    x: (selfColor.hsv.s / 100) * WIDTH,
    y: ((100 - selfColor.hsv.v) / 100) * HEIGHT,
  });

  let huePosition = $derived({
    x: (selfColor.hsv.h / 360) * WIDTH,
  });

  const onSetHex = (hex: string) => {
    inputColor = hex;
    if (/^#[0-9A-Fa-f]{6}$/i.test(hex)) {
      const newColor = transformColor('hex', hex);
      selfColor = newColor;
    }
  };

  const onMoveSaturation = ({x, y}: Position) => {
    const newHsv = {
      ...selfColor.hsv,
      s: (x / WIDTH) * 100,
      v: 100 - (y / HEIGHT) * 100,
    };
    const newColor = transformColor('hsv', newHsv);
    selfColor = newColor;
    inputColor = newColor.hex;
  };

  const onMoveHue = ({x}: Position) => {
    const newHsv = {...selfColor.hsv, h: (x / WIDTH) * 360};
    const newColor = transformColor('hsv', newHsv);

    selfColor = newColor;
    inputColor = newColor.hex;
  };

  // Check if the dropdown is actually active
  run(() => {
    if (innerDivRef !== null && onChange) {
      onChange(selfColor.hex, $skipAddingToHistoryStack);
      inputColor = selfColor.hex;
    }
  });

  run(() => {
    if (color) {
      const newColor = transformColor('hex', color);
      selfColor = newColor;
      inputColor = newColor.hex;
    }
  });
</script>

<div
  class="color-picker-wrapper"
  style="width: {WIDTH}px"
  bind:this={innerDivRef}>
  <TextInput label="Hex" onChange={onSetHex} value={inputColor} width="120px" />
  <div class="color-picker-basic-color">
    {#each basicColors as basicColor}
      <!-- svelte-ignore a11y_consider_explicit_label -->
      <button
        class={basicColor === selfColor.hex ? ' active' : ''}
        style="background-color: {basicColor}"
        onclick={() => {
          inputColor = basicColor;
          selfColor = transformColor('hex', basicColor);
        }}>
      </button>
    {/each}
  </div>
  <MoveWrapper
    className="color-picker-saturation"
    style="background-color: hsl({selfColor.hsv.h}, 100%, 50%)"
    onChange={onMoveSaturation}>
    <div
      class="color-picker-saturation_cursor"
      style="background-color: {selfColor.hex}; left: {saturationPosition.x}px; top: {saturationPosition.y}px">
    </div>
  </MoveWrapper>
  <MoveWrapper className="color-picker-hue" onChange={onMoveHue}>
    <div
      class="color-picker-hue_cursor"
      style="background-color: hsl({selfColor.hsv
        .h}, 100%, 50%); left: {huePosition.x}px">
    </div>
  </MoveWrapper>
  <div class="color-picker-color" style="background-color: {selfColor.hex}">
  </div>
</div>

<style>
  .color-picker-wrapper {
    padding: 20px;
  }

  .color-picker-basic-color {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin: 0;
    padding: 0;
  }

  .color-picker-basic-color button {
    border: 1px solid #ccc;
    border-radius: 4px;
    height: 16px;
    width: 16px;
    cursor: pointer;
    list-style-type: none;
  }

  .color-picker-basic-color button.active {
    box-shadow: 0px 0px 2px 2px rgba(0, 0, 0, 0.3);
  }

  .color-picker-saturation_cursor {
    position: absolute;
    width: 20px;
    height: 20px;
    border: 2px solid #ffffff;
    border-radius: 50%;
    box-shadow: 0 0 15px #00000026;
    box-sizing: border-box;
    transform: translate(-10px, -10px);
  }
  .color-picker-hue_cursor {
    position: absolute;
    width: 20px;
    height: 20px;
    border: 2px solid #ffffff;
    border-radius: 50%;
    box-shadow: #0003 0 0 0 0.5px;
    box-sizing: border-box;
    transform: translate(-10px, -4px);
  }

  .color-picker-color {
    border: 1px solid #ccc;
    margin-top: 15px;
    width: 100%;
    height: 20px;
  }
</style>
