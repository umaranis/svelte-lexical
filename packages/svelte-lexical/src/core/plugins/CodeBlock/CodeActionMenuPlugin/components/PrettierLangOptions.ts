import * as babelParser from 'prettier/parser-babel';
import * as htmlParser from 'prettier/parser-html';
import * as markdownParser from 'prettier/parser-markdown';
import * as cssParser from 'prettier/parser-postcss';

import type {Options} from 'prettier';

export const PRETTIER_OPTIONS_BY_LANG: Record<string, Options> = {
  css: {
    parser: 'css',
    plugins: [cssParser],
  },
  html: {
    parser: 'html',
    plugins: [htmlParser],
  },
  js: {
    parser: 'babel',
    plugins: [babelParser],
  },
  markdown: {
    parser: 'markdown',
    plugins: [markdownParser],
  },
};

const LANG_CAN_BE_PRETTIER = Object.keys(PRETTIER_OPTIONS_BY_LANG);

export function canBePrettier(lang: string): boolean {
  return LANG_CAN_BE_PRETTIER.includes(lang);
}
