import { createSignal, onCleanup, onMount } from 'solid-js';

/**
 * Helper to check if we're running in a browser environment
 */
const isBrowser = typeof window !== 'undefined';

/**
 * Custom hook to detect if the screen is mobile/tablet size.
 * Uses 1024px (lg breakpoint) as the threshold by default.
 *
 * @param breakpoint - The max-width in pixels to consider as mobile (default: 1024)
 * @returns A signal that returns true if the screen is mobile/tablet size
 */
export function useIsMobile(breakpoint = 1024) {
  // Initialize with current value if in browser, false for SSR
  const getInitialValue = () => {
    if (isBrowser) {
      return window.matchMedia(`(max-width: ${breakpoint - 1}px)`).matches;
    }
    return false;
  };

  const [isMobile, setIsMobile] = createSignal(getInitialValue());

  onMount(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);

    // Ensure value is correct after mount (in case of hydration mismatch)
    setIsMobile(mediaQuery.matches);

    // Handler for media query changes
    const handleChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    // Add listener
    mediaQuery.addEventListener('change', handleChange);

    // Cleanup
    onCleanup(() => {
      mediaQuery.removeEventListener('change', handleChange);
    });
  });

  return isMobile;
}

/**
 * Custom hook to detect if the screen is tablet size (between 768px and 1024px).
 *
 * @returns A signal that returns true if the screen is tablet size
 */
export function useIsTablet() {
  const getInitialValue = () => {
    if (isBrowser) {
      return window.matchMedia('(min-width: 768px) and (max-width: 1023px)').matches;
    }
    return false;
  };

  const [isTablet, setIsTablet] = createSignal(getInitialValue());

  onMount(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px) and (max-width: 1023px)');

    setIsTablet(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsTablet(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    onCleanup(() => {
      mediaQuery.removeEventListener('change', handleChange);
    });
  });

  return isTablet;
}

/**
 * Custom hook to detect if the screen is small mobile (below 640px - sm breakpoint).
 *
 * @returns A signal that returns true if the screen is small mobile size
 */
export function useIsSmallMobile() {
  const getInitialValue = () => {
    if (isBrowser) {
      return window.matchMedia('(max-width: 639px)').matches;
    }
    return false;
  };

  const [isSmallMobile, setIsSmallMobile] = createSignal(getInitialValue());

  onMount(() => {
    const mediaQuery = window.matchMedia('(max-width: 639px)');

    setIsSmallMobile(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsSmallMobile(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    onCleanup(() => {
      mediaQuery.removeEventListener('change', handleChange);
    });
  });

  return isSmallMobile;
}
