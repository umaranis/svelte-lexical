<script>
    import { getContext } from 'svelte';
    import DropDown from './controls/DropDown.svelte';
    import { INSERT_HORIZONTAL_RULE_COMMAND } from '../../core/plugins/HorizontalRuleNode';

    const editor = getContext('editor');
</script>

<DropDown
  buttonLabel="Insert"
  buttonIconClassName="icon plus"
  buttonClassName="toolbar-item spaced"
>
  <button
      on:click={() => {
      editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND);
      }}
      class="item">
      <i class="icon horizontal-rule" />
      <span class="text">Horizontal Rule</span>
  </button>
  <!-- <button
      onClick={() => {
      showModal('Insert Image', (onClose) => (
          <InsertImageDialog
          activeEditor={activeEditor}
          onClose={onClose}
          />
      ));
      }}
      className="item">
      <i className="icon image" />
      <span className="text">Image</span>
  </button> -->
</DropDown>