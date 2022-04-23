<script>
  export let options;
  let className;
  export { className as class };
  export let value;
</script>

<select class={className} on:change bind:value>
  <option hidden={true} value="" />
  {#each options as option}
    <option key={option} value={option}>
      {option}
    </option>
  {/each}}
</select>
