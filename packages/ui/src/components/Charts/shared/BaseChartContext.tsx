import { createContext, useContext } from 'solid-js';

import { BaseChartContextType } from '../types';

export const BaseChartContext = createContext<BaseChartContextType | null>(null);

export function useBaseChart(): BaseChartContextType {
  const ctx = useContext(BaseChartContext);
  if (!ctx) throw new Error('Chart components must be used inside a chart provider');
  return ctx;
}
