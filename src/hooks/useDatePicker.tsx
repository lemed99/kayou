import { useContext } from 'solid-js';

import { DatePickerContext } from '../context/DatePickerContext';

export const useDatePicker = () => {
  const ctx = useContext(DatePickerContext);
  if (!ctx) throw new Error('useDatePicker must be used within DatePickerProvider');
  return ctx;
};
