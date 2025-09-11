import { createContext, useContext } from 'solid-js';

import { LineChartContextType } from '../types';

export const ChartContext = createContext<LineChartContextType | null>(null);
export function useChart() {
  const ctx = useContext(ChartContext);
  if (!ctx) throw new Error('Chart components must be used inside <LineChart>');
  return ctx;
}
