export const isDateValid = (dateString: string): boolean => {
  const date = new Date(dateString);
  return date.toString() !== 'Invalid Date';
};

export const getDaysShort = (locale: string): string[] => {
  const days: string[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(2024, 0, i + 1);
    days.push(date.toLocaleDateString(locale, { weekday: 'short' }).replace('.', ''));
  }
  return days;
};

export const getMonthsShort = (locale: string): string[] => {
  const months: string[] = [];
  for (let i = 0; i < 12; i++) {
    const date = new Date(2024, i, 1);
    months.push(date.toLocaleDateString(locale, { month: 'short' }).replace('.', ''));
  }
  return months;
};

export const formatDate = (date: Date | string, format: string): string => {
  const parsedDate = typeof date === 'string' ? parseDate(date) : date;
  const day = parsedDate.getDate().toString().padStart(2, '0');
  const month = (parsedDate.getMonth() + 1).toString().padStart(2, '0');
  const year = parsedDate.getFullYear().toString();

  return format.replace('DD', day).replace('MM', month).replace('YYYY', year);
};

export const parseDate = (dateString: string): Date => {
  const date = new Date(dateString);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

export const isInRange = (
  date: Date,
  start: Date | string,
  end: Date | string,
): boolean => {
  const startDate = typeof start === 'string' ? parseDate(start) : start;
  const endDate = typeof end === 'string' ? parseDate(end) : end;
  const result = date > startDate && date < endDate;
  return result;
};

export const addMonths = (date: Date, months: number): Date => {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + months);
  return newDate;
};

export const toISO = (date: Date): string => date.toLocaleDateString('fr-CA');
