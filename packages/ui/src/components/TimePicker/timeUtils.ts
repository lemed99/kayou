/**
 * Time value object representing a time in 24-hour format.
 */
export interface TimeValue {
  /** Hour in 24h format (0-23). */
  hour: number;
  /** Minute (0-59). */
  minute: number;
  /** Second (0-59). */
  second: number;
}

/** Default time value (midnight). */
export const DEFAULT_TIME_VALUE: TimeValue = { hour: 0, minute: 0, second: 0 };

/** Zero-pads a number to 2 digits. */
export const zeroPad = (n: number): string => n.toString().padStart(2, '0');

/** Converts a 24h hour to 12h display hour (1-12). */
export const to12Hour = (hour24: number): number => hour24 % 12 || 12;

/** Gets the period (AM/PM) for a 24h hour. */
export const getPeriod = (hour24: number): 'AM' | 'PM' =>
  hour24 >= 12 ? 'PM' : 'AM';

/** Converts a 12h display hour + period to 24h hour. */
export const to24Hour = (hour12: number, period: 'AM' | 'PM'): number => {
  const clamped = Math.max(1, Math.min(12, hour12));
  if (clamped === 12) return period === 'PM' ? 12 : 0;
  return period === 'PM' ? clamped + 12 : clamped;
};

/** Returns display string for hour based on format. */
export const displayHour = (hour24: number, format: '12h' | '24h'): string =>
  zeroPad(format === '12h' ? to12Hour(hour24) : hour24);

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
