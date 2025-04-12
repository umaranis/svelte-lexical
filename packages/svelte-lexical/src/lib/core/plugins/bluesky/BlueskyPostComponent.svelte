<script lang="ts">
  import {renderPost, fetchPost} from 'bluesky-post-embed/core';
  import BlockWithAlignableContents from '../BlockWithAlignableContents.svelte';
  import type {ElementFormatType, NodeKey} from 'lexical';

  interface Props {
    className: Readonly<{
      base: string;
      focus: string;
    }>;
    format: ElementFormatType | null;
    nodeKey: NodeKey;
    profile: string;
    postKey: string;
  }

  const {className, format, nodeKey, profile, postKey}: Props = $props();
  const uri = `at://${profile}/app.bsky.feed.post/${postKey}`;
  const data = $derived.by(() => fetchPost({uri}));
</script>

<BlockWithAlignableContents {className} {format} {nodeKey}>
  <div style="display: inline-block; width: 550px">
    {#await data}
      <p>...loading</p>
    {:then data}
      {@const render = renderPost(data)}
      {#await render}
        <p>...rendering</p>
      {:then render}
        <bluesky-post src={data.thread?.post.uri}>
          <!-- eslint-disable-next-line svelte/no-at-html-tags -->
          {@html render}
        </bluesky-post>
      {/await}
    {/await}
  </div>
</BlockWithAlignableContents>

<style>
  :global {
    @import 'bluesky-post-embed/style.css';
    @import 'bluesky-post-embed/themes/light.css' (prefers-color-scheme: light);
    @import 'bluesky-post-embed/themes/dim.css' (prefers-color-scheme: dark);
  }
</style>
