<script lang="ts">
  export let dataTestId: string | undefined = undefined;
  export let label: string;
  export let placeholder = '';
  export let value: string;
  export let id = '';
  export let onChange: ((value: string) => void) | undefined = undefined;
  export let width: string | undefined = undefined;
</script>

<div class="Input__wrapper">
  <label class="Input__label" for={id}>{label}</label>
  <input
    type="text"
    class="Input__input"
    style="width: {width};"
    {placeholder}
    bind:value
    data-test-id={dataTestId}
    {id}
    on:change={(e) => {
      if (onChange) {
        /* @ts-ignore TS not supported in Svelte Html */
        onChange(e.target.value);
      }
    }} />
</div>
