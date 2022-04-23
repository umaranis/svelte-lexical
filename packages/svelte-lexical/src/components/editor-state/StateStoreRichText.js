import { writable } from 'svelte/store';

export const fontSize = writable('15px');
export const fontFamily = writable('Arial');
export const isRTL = writable(false);
export const isLink = writable(false);
