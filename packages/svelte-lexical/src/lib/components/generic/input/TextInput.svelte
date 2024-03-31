<script lang="ts">
  export let dataTestId: string;
  export let label: string;
  export let placeholder = '';
  export let value: string;
  export let id = '';
</script>

<div class="Input__wrapper">
  <label class="Input__label" for={id}>{label}</label>
  <input
    type="text"
    class="Input__input"
    {placeholder}
    bind:value
    data-test-id={dataTestId}
    {id} />
</div>
