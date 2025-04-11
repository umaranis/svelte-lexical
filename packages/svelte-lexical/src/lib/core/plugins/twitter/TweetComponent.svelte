<script lang="ts">
  import type {ElementFormatType, NodeKey} from 'lexical';
  import BlockWithAlignableContents from '../BlockWithAlignableContents.svelte';

  let isTwitterScriptLoading = true;

  const WIDGET_SCRIPT_URL = 'https://platform.twitter.com/widgets.js';

  type TweetComponentProps = {
    className: Readonly<{
      base: string;
      focus: string;
    }>;
    format: ElementFormatType | null;
    loadingComponent?: string;
    nodeKey: NodeKey;
    onError?: (error: string) => void;
    onLoad?: () => void;
    tweetID: string;
  };

  let {
    className,
    format,
    loadingComponent,
    nodeKey,
    onError,
    onLoad,
    tweetID,
  }: TweetComponentProps = $props();
  let containerRef: HTMLDivElement | null = null;

  let previousTweetIDRef: string = '';
  let isTweetLoading = $state(false);

  const createTweet = async () => {
    try {
      // @ts-expect-error Twitter is attached to the window.
      await window.twttr.widgets.createTweet(tweetID, containerRef);

      isTweetLoading = false;
      isTwitterScriptLoading = false;

      if (onLoad) {
        onLoad();
      }
    } catch (error) {
      if (onError) {
        onError(String(error));
      }
    }
  };

  $effect(() => {
    if (tweetID !== previousTweetIDRef) {
      isTweetLoading = true;

      if (isTwitterScriptLoading) {
        const script = document.createElement('script');
        script.src = WIDGET_SCRIPT_URL;
        script.async = true;
        document.body?.appendChild(script);
        script.onload = createTweet;
        if (onError) {
          script.onerror = (e) => onError(String(e));
        }
      } else {
        createTweet();
      }

      if (previousTweetIDRef) {
        previousTweetIDRef = tweetID;
      }
    }
  });
</script>

<BlockWithAlignableContents {className} {format} {nodeKey}>
  {#if isTweetLoading}
    {loadingComponent}
  {/if}
  <div style="display: inline-block; width: 550px" bind:this={containerRef}>
  </div>
</BlockWithAlignableContents>
