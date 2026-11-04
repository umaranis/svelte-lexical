<script lang="ts">
  import type {LinkAttributes} from '@lexical/link';
  import {$isCodeNode as isCodeNode} from '@lexical/code';
  import AutoLinkPluginCore from './AutoLinkPluginCore.svelte';
  import {
    createLinkMatcherWithRegExp as createMatcher,
    createUrlAndEmailMatchers,
  } from './AutoLinkExtension.js';

  const {attributes}: {attributes?: LinkAttributes} = $props();

  export function createLinkMatcherWithRegExp(
    regExp: RegExp,
    urlTransformer: (text: string) => string = (text) => text,
  ) {
    return createMatcher(regExp, urlTransformer, attributes);
  }

  // svelte-ignore state_referenced_locally
  const MATCHERS = createUrlAndEmailMatchers(attributes);

  const EXCLUDE_PARENTS = [isCodeNode];
</script>

<AutoLinkPluginCore matchers={MATCHERS} excludeParents={EXCLUDE_PARENTS} />
