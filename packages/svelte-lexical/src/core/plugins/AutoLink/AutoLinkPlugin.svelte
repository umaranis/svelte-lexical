<script lang="ts">
  import AutoLinkPluginCore from './AutoLinkPluginCore.svelte';

  export function createLinkMatcherWithRegExp(
    regExp: RegExp,
    urlTransformer: (text: string) => string = (text) => text,
  ) {
    return (text: string) => {
      const match = regExp.exec(text);
      if (match === null) return null;
      return {
        index: match.index,
        length: match[0].length,
        text: match[0],
        url: urlTransformer(text),
      };
    };
  }

  const URL_REGEX =
    /(https?:\/\/)?((\w+:\w+@)?(([a-zA-Z\d]([a-zA-Z\d-]*[a-zA-Z\d])*)\.)+[a-zA-Z]{2,}|localhost|(\d{1,3}\.){3}\d{1,3})(:\d+)?(\/[-a-zA-Z\d%_.~+]*)*(\?[;&a-zA-Z\d%_.~+=-]*)?(#[-a-zA-Z\d_]*)?/;

  const EMAIL_REGEX =
    /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;

  const MATCHERS = [
    createLinkMatcherWithRegExp(URL_REGEX, (text) => {
      return text.startsWith('http') ? text : `https://${text}`;
    }),
    createLinkMatcherWithRegExp(EMAIL_REGEX, (text) => {
      return `mailto:${text}`;
    }),
  ];
</script>

<AutoLinkPluginCore matchers={MATCHERS} />
