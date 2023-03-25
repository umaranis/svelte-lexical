import {debounce} from 'lodash-es';

export function useDebounce<T extends (...args: never[]) => void>(
  fn: T,
  ms: number,
  maxWait?: number,
) {
  const funcRef: T | null = fn;

  return debounce(
    (...args: Parameters<T>) => {
      if (funcRef) {
        funcRef(...args);
      }
    },
    ms,
    {maxWait},
  );
}
