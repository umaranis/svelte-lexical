<script lang="ts">
  interface Props {
    dataTestId: string;
    accept?: string | undefined;
    label: string;
    onChange: (files: FileList | null) => void;
    id?: string;
  }

  let {
    dataTestId,
    accept = undefined,
    label,
    onChange,
    id = '',
  }: Props = $props();
</script>

<div class="Input__wrapper">
  <label class="Input__label" for={id}>{label}</label>
  <input
    type="file"
    {accept}
    class="Input__input"
    onchange={(e) =>
      /* @ts-ignore TS not supported in Svelte Html */
      onChange(e.target.files)}
    data-test-id={dataTestId}
    {id} />
</div>
