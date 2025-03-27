import type {CSSProperties} from '$lib/types.js';

export function cssStylesToString(styles: CSSProperties): string {
  return Object.entries(styles)
    .map(([k, v]) => `${k}:${v}`)
    .join(';');
}
