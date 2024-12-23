<script lang="ts">
  interface Props {
    checked: boolean;
    text: string;
    onclick: () => void;
    id?: string | undefined;
  }

  let {checked, text, onclick, id = undefined}: Props = $props();

  const buttonId = 'id_' + Math.floor(Math.random() * 10000);
</script>

<div class="switch" {id}>
  <label for={buttonId}>{text}</label>
  <button
    role="switch"
    aria-checked={checked ? 'true' : 'false'}
    aria-label={text}
    id={buttonId}
    {onclick}>
    <span></span>
  </button>
</div>
