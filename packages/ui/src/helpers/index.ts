export { defaultProps } from './defaultProps';

// Date utilities
export {
  addMonths,
  formatDate,
  getDaysShort,
  getMonthsShort,
  isDateValid,
  isInRange,
  isSameDay,
  parseDate,
  toISO,
} from './dates';

// Select utilities
export type { Option } from './selectUtils';
export {
  ChevronDownButton,
  ClearContentButton,
  CTA,
  LazyLoading,
  OptionLabel,
  optionClass,
  optionsContainerClass,
} from './selectUtils';

export function getScrollProgress(el: HTMLElement | null): number {
  if (!el) return 0;
  const { scrollTop, scrollHeight, clientHeight } = el;
  const scrollable = scrollHeight - clientHeight;

  if (scrollable <= 0) return 100;

  const percent = (scrollTop / scrollable) * 100;
  return Math.min(100, Math.max(0, percent));
}
