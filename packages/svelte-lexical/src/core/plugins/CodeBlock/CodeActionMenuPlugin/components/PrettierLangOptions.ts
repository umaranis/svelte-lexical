import type {Options} from 'prettier';

const PRETTIER_PARSER_MODULES = {
  css: () => import('prettier/parser-postcss'),
  html: () => import('prettier/parser-html'),
  js: () => import('prettier/parser-babel'),
  markdown: () => import('prettier/parser-markdown'),
} as const;

type LanguagesType = keyof typeof PRETTIER_PARSER_MODULES;

export async function loadPrettierParserByLang(lang: string) {
  const dynamicImport = PRETTIER_PARSER_MODULES[lang as LanguagesType];
  return await dynamicImport();
}

export async function loadPrettierFormat() {
  const {format} = await import('prettier/standalone');
  return format;
}

export const PRETTIER_OPTIONS_BY_LANG: Record<string, Options> = {
  css: {
    parser: 'css',
  },
  html: {
    parser: 'html',
  },
  js: {
    parser: 'babel',
  },
  markdown: {
    parser: 'markdown',
  },
};

const LANG_CAN_BE_PRETTIER = Object.keys(PRETTIER_OPTIONS_BY_LANG);

export function canBePrettier(lang: string): boolean {
  return LANG_CAN_BE_PRETTIER.includes(lang);
}
