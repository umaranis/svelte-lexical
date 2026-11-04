import {$isCodeNode} from '@lexical/code';
import {
  AutoLinkExtension,
  type LinkAttributes,
  type LinkMatcher,
} from '@lexical/link';
import {configExtension} from 'lexical';

export const URL_REGEX =
  /((https?:\/\/(www\.)?)|(www\.))[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)(?<![-.+():%])/;

export const EMAIL_REGEX =
  /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;

export function createLinkMatcherWithRegExp(
  regExp: RegExp,
  urlTransformer: (text: string) => string = (text) => text,
  attributes?: LinkAttributes,
): LinkMatcher {
  return (text: string) => {
    const match = regExp.exec(text);
    if (match === null) {
      return null;
    }
    return {
      index: match.index,
      length: match[0].length,
      text: match[0],
      url: urlTransformer(match[0]),
      attributes,
    };
  };
}

/** Matchers for web URLs (https:// is added when missing) and email addresses. */
export function createUrlAndEmailMatchers(
  attributes?: LinkAttributes,
): Array<LinkMatcher> {
  return [
    createLinkMatcherWithRegExp(
      URL_REGEX,
      (text) => (text.startsWith('http') ? text : `https://${text}`),
      attributes,
    ),
    createLinkMatcherWithRegExp(
      EMAIL_REGEX,
      (text) => `mailto:${text}`,
      attributes,
    ),
  ];
}

/** AutoLinkExtension configured like AutoLinkPlugin: URLs and emails, skipped inside code blocks. */
export const UrlAndEmailAutoLinkExtension = configExtension(AutoLinkExtension, {
  excludeParents: [$isCodeNode],
  matchers: createUrlAndEmailMatchers(),
});
