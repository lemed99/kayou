import {
  Accessor,
  JSX,
  ParentProps,
  createContext,
  createEffect,
  createSignal,
  onCleanup,
  onMount,
  useContext,
} from 'solid-js';

/**
 * Context for providing a custom portal mount container.
 * When provided, floating elements (tooltips, popovers, modals, etc.)
 * will render inside this container instead of document.body.
 *
 * This is useful for:
 * - Documentation preview areas with isolated dark/light mode
 * - Scoped portal rendering for nested contexts
 * - Testing environments
 */
export interface PortalContainerContextValue {
  container: Accessor<HTMLElement | null>;
}

export const PortalContainerContext = createContext<PortalContainerContextValue | null>(null);

/**
 * Hook to access the portal container context.
 * Returns null if no PortalContainerProvider is present (default behavior).
 */
export function usePortalContainer(): PortalContainerContextValue | null {
  return useContext(PortalContainerContext);
}

export interface PortalContainerProviderProps {
  /**
   * Whether to apply dark mode styling to the portal container.
   * When true, adds 'dark' class to the container.
   * @default false
   */
  dark?: boolean;
}

// Singleton container management
let globalContainer: HTMLElement | null = null;
let refCount = 0;
const [containerSignal, setContainerSignal] = createSignal<HTMLElement | null>(null);

function getOrCreateContainer(): HTMLElement {
  if (!globalContainer) {
    globalContainer = document.createElement('div');
    globalContainer.setAttribute('data-portal-container', '');
    document.body.appendChild(globalContainer);
    setContainerSignal(globalContainer);
  }
  refCount++;
  return globalContainer;
}

function releaseContainer(): void {
  refCount--;
  if (refCount <= 0 && globalContainer) {
    globalContainer.parentNode?.removeChild(globalContainer);
    globalContainer = null;
    refCount = 0;
    setContainerSignal(null);
  }
}

/**
 * Provider component for custom portal container.
 * Creates a single shared container in document.body for portal rendering
 * with proper dark/light mode support.
 *
 * @example
 * ```tsx
 * const [isDark, setIsDark] = createSignal(false);
 *
 * <PortalContainerProvider dark={isDark()}>
 *   <Tooltip content="Hello">Hover me</Tooltip>
 *   <Modal isOpen={isOpen()}>Modal content</Modal>
 * </PortalContainerProvider>
 * ```
 */
export function PortalContainerProvider(
  props: ParentProps<PortalContainerProviderProps>,
): JSX.Element {
  // Get or create the singleton container on mount
  onMount(() => {
    getOrCreateContainer();
  });

  // Sync dark class with props.dark
  createEffect(() => {
    if (!globalContainer) return;

    if (props.dark) {
      globalContainer.classList.add('dark');
      globalContainer.classList.remove('light');
    } else {
      globalContainer.classList.remove('dark');
      globalContainer.classList.add('light');
    }
  });

  // Release reference on unmount
  onCleanup(() => {
    releaseContainer();
  });

  const value: PortalContainerContextValue = {
    container: containerSignal,
  };

  return (
    <PortalContainerContext.Provider value={value}>
      {props.children}
    </PortalContainerContext.Provider>
  );
}
