<script>
  export let src;
  export let altText;
  export let nodeKey;
  export let width;
  export let height;
  export let maxWidth;
  export let resizable;
  export let showCaption;
  export let caption;
</script>

<img
  {src}
  alt={altText}
  style={{
    height,
    maxWidth,
    width,
  }}
/>
