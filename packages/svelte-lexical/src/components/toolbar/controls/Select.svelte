<script lang="ts">
  export let options: string[];
  let className: string;
  export {className as class};
  export let value: string;
</script>

<select class={className} on:change bind:value>
  <option hidden={true} value="" />
  {#each options as option}
    <option value={option}>
      {option}
    </option>
  {/each}}
</select>
