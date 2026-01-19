import { createContext, useContext } from 'solid-js';

import { LineChartContextType } from '../types';

/**
 * Context for sharing state between LineChart and its child components.
 * @internal
 */
export const ChartContext = createContext<LineChartContextType | null>(null);

/**
 * Hook to access the LineChart context.
 * Must be used within a LineChart component.
 *
 * @throws Error if used outside of a LineChart
 * @returns The LineChart context value
 */
export function useChart(): LineChartContextType {
  const ctx = useContext(ChartContext);
  if (!ctx) throw new Error('Chart components must be used inside <LineChart>');
  return ctx;
}
