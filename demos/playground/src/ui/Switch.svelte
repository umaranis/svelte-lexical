<script lang="ts">
  export let checked: boolean;
  export let text: string;
  export let id: string | undefined = undefined;

  const buttonId = 'id_' + Math.floor(Math.random() * 10000);
</script>

<div class="switch" {id}>
  <label for={buttonId}>{text}</label>
  <button
    role="switch"
    aria-checked={checked ? 'true' : 'false'}
    id={buttonId}
    on:click>
    <span />
  </button>
</div>
