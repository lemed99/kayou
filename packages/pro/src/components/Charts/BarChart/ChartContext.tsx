import { createContext, useContext } from 'solid-js';

import { BarChartContextType } from '../types';

/**
 * Context for sharing state between BarChart and its child components.
 * @internal
 */
export const BarChartContext = createContext<BarChartContextType | null>(null);

/**
 * Hook to access the BarChart context.
 * Must be used within a BarChart component.
 *
 * @throws Error if used outside of a BarChart
 * @returns The BarChart context value
 */
export function useBarChart(): BarChartContextType {
  const ctx = useContext(BarChartContext);
  if (!ctx) throw new Error('BarChart components must be used inside <BarChart>');
  return ctx;
}
