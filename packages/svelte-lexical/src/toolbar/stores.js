import { writable } from 'svelte/store';

export const isBold = writable(false);
export const isItalic = writable(false);
export const isUnderline = writable(false);
export const isStrikethrough = writable(false);
export const isCode = writable(false);
export const isRTL = writable(false);

export const isLink = writable(false);

export const blockType = writable('paragraph');

export const selectedElementKey = writable(null)

//export const showBlockOptionsDropDown = writable(false);