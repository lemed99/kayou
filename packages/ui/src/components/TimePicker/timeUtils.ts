/**
 * Time value object representing a time in 24-hour format.
 */
export interface TimeValue {
  /** Hour in 24h format (0-23). */
  hour: number | undefined;
  /** Minute (0-59). */
  minute: number | undefined;
  /** Second (0-59). */
  second: number | undefined;
}

/** Zero-pads a number to 2 digits. */
export const zeroPad = (n: number | undefined): string =>
  n !== undefined ? n.toString().padStart(2, '0') : '';

/** Converts a 24h hour to 12h display hour (1-12). */
export const to12Hour = (hour24: number): number => hour24 % 12 || 12;

/** Gets the period (AM/PM) for a 24h hour. */
export const getPeriod = (hour24: number | undefined): 'AM' | 'PM' =>
  hour24 !== undefined ? (hour24 >= 12 ? 'PM' : 'AM') : 'AM';

/** Converts a 12h display hour + period to 24h hour. */
export const to24Hour = (hour12: number, period: 'AM' | 'PM'): number => {
  const clamped = Math.max(1, Math.min(12, hour12));
  if (clamped === 12) return period === 'PM' ? 12 : 0;
  return period === 'PM' ? clamped + 12 : clamped;
};

/** Returns display string for hour based on format. */
export const displayHour = (hour24: number | undefined, format: '12h' | '24h'): string =>
  hour24 !== undefined ? zeroPad(format === '12h' ? to12Hour(hour24) : hour24) : '';

/** Formats a complete time for display. */
export const formatTime = (
  h: number,
  m: number,
  s: number,
  format: '12h' | '24h',
  showSeconds: boolean,
): string => {
  const minStr = zeroPad(m);
  const secPart = showSeconds ? `:${zeroPad(s)}` : '';
  if (format === '12h') {
    const period = getPeriod(h);
    return `${to12Hour(h)}:${minStr}${secPart} ${period}`;
  }
  return `${zeroPad(h)}:${minStr}${secPart}`;
};
