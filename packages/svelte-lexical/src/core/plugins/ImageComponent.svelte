<script context="module" lang="ts">
  const imageCache = new Set();
</script>

<script lang="ts">
  export let src;
  export let altText;
  export let nodeKey;
  export let width;
  export let height;
  export let maxWidth;
  export let resizable;
  export let showCaption;
  export let caption;

  let promise = new Promise((resolve) => {
    if (imageCache.has(src)) {
      resolve(null);
    } else {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        imageCache.add(src);
        resolve(null);
      };
    }
  });
</script>

{#await promise}
  <p>...loading image</p>
{:then _}
  <img
    {src}
    alt={altText}
    style={{
      height,
      maxWidth,
      width,
    }}
  />
{/await}
