import { createContext, useContext } from 'solid-js';

import { AreaChartContextType } from '../types';

/**
 * Context for sharing state between AreaChart and its child components.
 * @internal
 */
export const AreaChartContext = createContext<AreaChartContextType | null>(null);

/**
 * Hook to access the AreaChart context.
 * Must be used within an AreaChart component.
 *
 * @throws Error if used outside of an AreaChart
 * @returns The AreaChart context value
 */
export function useAreaChart(): AreaChartContextType {
  const ctx = useContext(AreaChartContext);
  if (!ctx) throw new Error('AreaChart components must be used inside <AreaChart>');
  return ctx;
}
