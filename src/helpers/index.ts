export { defaultProps } from './defaultProps';
export { cache, getCacheRow, insertOrUpdateCacheRow } from './indexedDB';

export function getScrollProgress(el: HTMLElement | null): number {
  if (!el) return 0;
  const { scrollTop, scrollHeight, clientHeight } = el;
  const scrollable = scrollHeight - clientHeight;

  if (scrollable <= 0) return 100;

  const percent = (scrollTop / scrollable) * 100;
  return Math.min(100, Math.max(0, percent));
}
