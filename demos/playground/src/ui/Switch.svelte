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

<style>
  .switch {
    display: block;
    color: #444;
    margin: 5px 0;
    background-color: rgba(238, 238, 238, 0.7);
    padding: 5px 10px;
    border-radius: 10px;
  }

  .switch label {
    margin-right: 5px;
    line-height: 24px;
    width: 100px;
    font-size: 14px;
    display: inline-block;
    vertical-align: middle;
  }

  .switch button {
    background-color: rgb(206, 208, 212);
    height: 24px;
    box-sizing: border-box;
    border-radius: 12px;
    width: 44px;
    display: inline-block;
    vertical-align: middle;
    position: relative;
    outline: none;
    cursor: pointer;
    transition: background-color 0.1s;
    border: 2px solid transparent;
  }

  .switch button:focus-visible {
    border-color: blue;
  }

  .switch button span {
    top: 0px;
    left: 0px;
    display: block;
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 12px;
    background-color: white;
    transition: transform 0.2s;
  }

  .switch button[aria-checked='true'] {
    background-color: rgb(24, 119, 242);
  }

  .switch button[aria-checked='true'] span {
    transform: translateX(20px);
  }
</style>
