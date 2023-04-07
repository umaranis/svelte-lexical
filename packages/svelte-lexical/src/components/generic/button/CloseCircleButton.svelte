<!-- svelte-ignore a11y-click-events-have-key-events -->
<svg id="close" on:click viewBox="0 0 12 12">
  <circle cx="6" cy="6" r="6" />
  <line x1="3" y1="3" x2="9" y2="9" />
  <line x1="9" y1="3" x2="3" y2="9" />
</svg>

<style>
  #close {
    position: absolute;
    top: 4px;
    right: 4px;
    width: 16px;
    height: 16px;
    cursor: pointer;
    fill: #f44;
    transition: transform 0.3s;
  }

  #close:hover {
    transform: scale(1.3);
  }

  #close line {
    stroke: #fff;
    stroke-width: 2;
  }
</style>
