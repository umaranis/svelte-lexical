export function getThemeSelector(selector?: string): string {
  if (!selector) {
    return '';
  }
  // invariant(
  //   typeof className === 'string',
  //   'getThemeClass: required theme property %s not defined',
  //   String(name),
  // );
  return selector
    .split(/\s+/g)
    .map((cls) => `.${cls}`)
    .join();
}
