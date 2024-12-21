<script lang="ts">
  interface Props {
    dataTestId?: string | undefined;
    label: string;
    placeholder?: string;
    value: string;
    id?: string;
    onChange?: ((value: string) => void) | undefined;
    width?: string | undefined;
  }

  let {
    dataTestId = undefined,
    label,
    placeholder = '',
    value = $bindable(),
    id = '',
    onChange = undefined,
    width = undefined,
  }: Props = $props();
</script>

<div class="Input__wrapper">
  <label class="Input__label" for={id}>{label}</label>
  <input
    type="number"
    class="Input__input"
    style="width: {width};"
    {placeholder}
    bind:value
    data-test-id={dataTestId}
    {id}
    onchange={(e) => {
      if (onChange) {
        /* @ts-ignore TS not supported in Svelte Html */
        onChange(e.target.value);
      }
    }} />
</div>
