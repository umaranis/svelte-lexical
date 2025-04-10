<script lang="ts">
  import type {NodeKey, ElementFormatType} from 'lexical';
  import BlockWithAlignableContents from '../BlockWithAlignableContents.svelte';

  type YouTubeComponentProps = {
    className: Readonly<{
      base: string;
      focus: string;
    }>;
    format: ElementFormatType | null;
    nodeKey: NodeKey;
    videoID: string;
  };

  let {className, format, nodeKey, videoID}: YouTubeComponentProps = $props();
</script>

<BlockWithAlignableContents {className} {format} {nodeKey}>
  <iframe
    width="560"
    height="315"
    src={`https://www.youtube-nocookie.com/embed/${videoID}`}
    frameBorder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen={true}
    title="YouTube video">
  </iframe>
</BlockWithAlignableContents>
