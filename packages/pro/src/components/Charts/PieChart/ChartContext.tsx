import { createContext, useContext } from 'solid-js';

import { PieChartContextType } from '../types';

/**
 * Context for sharing state between PieChart and its child components.
 * @internal
 */
export const ChartContext = createContext<PieChartContextType | null>(null);

/**
 * Hook to access the PieChart context.
 * Must be used within a PieChart component.
 *
 * @throws Error if used outside of a PieChart
 * @returns The PieChart context value
 */
export function useChartContext(): PieChartContextType {
  const ctx = useContext(ChartContext);
  if (!ctx) throw new Error('useChartContext must be used within a PieChart');
  return ctx;
}
