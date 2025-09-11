import { createContext, useContext } from 'solid-js';

import { PieChartContextType } from '../types';

export const ChartContext = createContext<PieChartContextType | null>(null);

export function useChartContext() {
  const ctx = useContext(ChartContext);
  if (!ctx) throw new Error('useChartContext must be used within a ChartProvider');
  return ctx;
}
