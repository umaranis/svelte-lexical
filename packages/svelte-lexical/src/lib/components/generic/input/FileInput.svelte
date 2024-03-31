<script lang="ts">
  export let dataTestId: string;
  export let accept: string | undefined = undefined;
  export let label: string;
  export let onChange: (files: FileList | null) => void;
  export let id = '';
</script>

<div class="Input__wrapper">
  <label class="Input__label" for={id}>{label}</label>
  <input
    type="file"
    {accept}
    class="Input__input"
    on:change={(e) =>
      /* @ts-ignore TS not supported in Svelte Html */
      onChange(e.target.files)}
    data-test-id={dataTestId}
    {id} />
</div>
