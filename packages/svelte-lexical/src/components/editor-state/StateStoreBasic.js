import { writable } from 'svelte/store';

export const isBold = writable(false);
export const isItalic = writable(false);
export const isUnderline = writable(false);
export const isStrikethrough = writable(false);
export const blockType = writable('paragraph');

export const selectedElementKey = writable(null); // TODO: why is this in store?
