// lib/toast.tsx
import {
  Accessor,
  For,
  JSX,
  ParentComponent,
  Show,
  createContext,
  createSignal,
  onCleanup,
  useContext,
} from 'solid-js';

type ToastType = 'success' | 'error' | 'info' | 'warning' | 'default';

type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

interface Toast {
  id: string;
  message: string | JSX.Element;
  type: ToastType;
  duration?: number;
  position?: ToastPosition;
  dismissible?: boolean;
  createdAt: number;
  hideProgressBar?: boolean;
}

interface ToastOptions {
  type?: ToastType;
  duration?: number;
  position?: ToastPosition;
  dismissible?: boolean;
  hideProgressBar?: boolean;
}

interface ToastContextType {
  toasts: Accessor<Toast[]>;
  toast: {
    (message: string | JSX.Element, options?: ToastOptions): string;
    success: (message: string, options?: Omit<ToastOptions, 'type'>) => string;
    error: (message: string, options?: Omit<ToastOptions, 'type'>) => string;
    info: (message: string, options?: Omit<ToastOptions, 'type'>) => string;
    warning: (message: string, options?: Omit<ToastOptions, 'type'>) => string;
    dismiss: (id: string) => void;
  };
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

const ToastContext = createContext<ToastContextType>();

export const ToastProvider: ParentComponent = (props) => {
  const [toasts, setToasts] = createSignal<Toast[]>([]);
  const timers = new Map<string, number>();

  const dismiss = (id: string) => {
    // Clear timer if exists
    const timer = timers.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.delete(id);
    }

    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const dismissAll = () => {
    // Clear all timers
    timers.forEach((timer) => clearTimeout(timer));
    timers.clear();
    setToasts([]);
  };

  const toast = (message: string | JSX.Element, options: ToastOptions = {}): string => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const newToast: Toast = {
      id,
      message,
      type: options.type || 'default',
      duration: options.duration ?? 4000,
      position: options.position || 'top-right',
      dismissible: options.dismissible ?? true,
      createdAt: Date.now(),
      hideProgressBar: options.hideProgressBar ?? false,
    };

    setToasts((prev) => [...prev, newToast]);

    // Set up auto-dismiss timer
    if (newToast.duration !== Infinity && newToast.duration > 0) {
      const timer = setTimeout(() => {
        dismiss(id);
      }, newToast.duration);

      timers.set(id, timer);
    }

    return id;
  };

  // Add specific toast methods with proper typing
  const toastWithMethods = Object.assign(toast, {
    success: (message: string, options: Omit<ToastOptions, 'type'> = {}) =>
      toast(message, { ...options, type: 'success' }),

    error: (message: string, options: Omit<ToastOptions, 'type'> = {}) =>
      toast(message, { ...options, type: 'error' }),

    info: (message: string, options: Omit<ToastOptions, 'type'> = {}) =>
      toast(message, { ...options, type: 'info' }),

    warning: (message: string, options: Omit<ToastOptions, 'type'> = {}) =>
      toast(message, { ...options, type: 'warning' }),

    custom: (component: JSX.Element, options: Omit<ToastOptions, 'type'> = {}) =>
      toast(component, { ...options }),

    dismiss,
  });

  // Set global toast reference
  setGlobalToast(toastWithMethods);

  // Cleanup on unmount
  onCleanup(() => {
    timers.forEach((timer) => clearTimeout(timer));
    timers.clear();
  });

  return (
    <ToastContext.Provider
      value={{
        toasts,
        toast: toastWithMethods,
        dismiss,
        dismissAll,
      }}
    >
      {props.children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Icon components pour les différents types
const ToastIcon = (props: { type: ToastType }) => {
  const iconClass = 'w-5 h-5 mr-2 flex-shrink-0';

  switch (props.type) {
    case 'success':
      return (
        <svg
          class={`${iconClass} text-green-600`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clip-rule="evenodd"
          />
        </svg>
      );
    case 'error':
      return (
        <svg class={`${iconClass} text-red-600`} fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clip-rule="evenodd"
          />
        </svg>
      );
    case 'warning':
      return (
        <svg
          class={`${iconClass} text-yellow-600`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clip-rule="evenodd"
          />
        </svg>
      );
    case 'info':
      return (
        <svg class={`${iconClass} text-blue-600`} fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clip-rule="evenodd"
          />
        </svg>
      );
    default:
      return (
        <svg class={`${iconClass} text-gray-600`} fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clip-rule="evenodd"
          />
        </svg>
      );
  }
};

// Progress bar component - Version avec synchronisation correcte
const ToastProgressBar = (props: {
  duration: number;
  toastId: string;
  createdAt: number;
}) => {
  const getAnimationDelay = () => {
    const now = Date.now();
    const elapsed = now - props.createdAt;
    const remaining = Math.max(0, props.duration - elapsed);
    const progress = elapsed / props.duration;

    // Si le toast est déjà en cours, on ajuste l'animation
    if (elapsed > 0) {
      return {
        duration: remaining,
        initialScale: 1 - progress,
      };
    }

    return {
      duration: props.duration,
      initialScale: 1,
    };
  };

  const { duration, initialScale } = getAnimationDelay();

  return (
    <div
      class="absolute bottom-0 left-0 h-1 w-full origin-left bg-current opacity-20"
      style={{
        animation: `toast-progress-${props.toastId} ${duration}ms linear forwards`,
        transform: `scaleX(${initialScale})`,
      }}
    />
  );
};

// Toast Container Component
const ToastContainer = () => {
  const { toasts, dismiss } = useToast();

  const getToastClasses = (type: ToastType) => {
    const base =
      'relative rounded-lg shadow-lg max-w-sm w-full border transition-all duration-300 ease-in-out transform overflow-hidden';

    switch (type) {
      case 'success':
        return `${base} bg-green-50 text-green-800 border-green-200`;
      case 'error':
        return `${base} bg-red-50 text-red-800 border-red-200`;
      case 'warning':
        return `${base} bg-yellow-50 text-yellow-800 border-yellow-200`;
      case 'info':
        return `${base} bg-blue-50 text-blue-800 border-blue-200`;
      default:
        return `${base} bg-white text-gray-800 border-gray-200`;
    }
  };

  const getPositionClasses = (position: ToastPosition = 'bottom-right') => {
    const positions = {
      'top-left': 'top-4 left-4',
      'top-center': 'top-4 left-1/2 -translate-x-1/2',
      'top-right': 'top-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
      'bottom-right': 'bottom-4 right-4',
    };
    return positions[position];
  };

  // Group toasts by position
  const groupedToasts = () => {
    const groups = {} as Record<ToastPosition, Toast[]>;
    toasts().forEach((toast) => {
      const position = toast.position || 'bottom-right';
      if (!groups[position]) {
        groups[position] = [];
      }
      groups[position].push(toast);
    });
    return groups;
  };

  return (
    <>
      {/* CSS Global pour les animations d'entrée */}
      <style>
        {`
          @keyframes toast-slide-in-right {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          
          @keyframes toast-slide-in-left {
            from { transform: translateX(-100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          
          @keyframes toast-slide-in-top {
            from { transform: translateY(-100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          
          @keyframes toast-slide-in-bottom {
            from { transform: translateY(100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          
          .toast-enter-right { animation: toast-slide-in-right 0.3s ease-out; }
          .toast-enter-left { animation: toast-slide-in-left 0.3s ease-out; }
          .toast-enter-top { animation: toast-slide-in-top 0.3s ease-out; }
          .toast-enter-bottom { animation: toast-slide-in-bottom 0.3s ease-out; }
        `}
      </style>

      <For each={Object.entries(groupedToasts())}>
        {([position, positionToasts]) => (
          <div
            class={`pointer-events-none fixed z-50 flex flex-col space-y-3 ${getPositionClasses(
              position as ToastPosition,
            )}`}
          >
            <For each={positionToasts}>
              {(toast) => {
                const getEnterAnimation = () => {
                  if (position.includes('right')) return 'toast-enter-right';
                  if (position.includes('left')) return 'toast-enter-left';
                  if (position.includes('top')) return 'toast-enter-top';
                  return 'toast-enter-bottom';
                };

                const isCustomContent = typeof toast.message !== 'string';

                return (
                  <div
                    class={`${getToastClasses(
                      toast.type,
                    )} ${getEnterAnimation()} pointer-events-auto cursor-pointer hover:shadow-xl ${isCustomContent ? 'p-0' : 'p-4'}`}
                    onClick={() => toast.dismissible && dismiss(toast.id)}
                    role="alert"
                    aria-live={toast.type === 'error' ? 'assertive' : 'polite'}
                  >
                    {isCustomContent ? (
                      toast.message
                    ) : (
                      <div class="flex items-start">
                        <ToastIcon type={toast.type} />
                        <div class="min-w-0 flex-1">
                          <p class="text-sm leading-5 font-medium">{toast.message}</p>
                        </div>
                        <Show when={toast.dismissible}>
                          <button
                            class="ml-4 flex-shrink-0 p-1 text-current transition-opacity hover:opacity-70"
                            onClick={(e) => {
                              e.stopPropagation();
                              dismiss(toast.id);
                            }}
                            aria-label="Fermer la notification"
                          >
                            <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fill-rule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clip-rule="evenodd"
                              />
                            </svg>
                          </button>
                        </Show>
                      </div>
                    )}

                    <Show
                      when={
                        toast.duration !== Infinity &&
                        toast.duration > 0 &&
                        !toast.hideProgressBar
                      }
                    >
                      <ToastProgressBar
                        duration={toast.duration}
                        toastId={toast.id}
                        createdAt={toast.createdAt}
                      />
                      <style>
                        {`
                          @keyframes toast-progress-${toast.id} {
                            to { transform: scaleX(0); }
                          }
                        `}
                      </style>
                    </Show>
                  </div>
                );
              }}
            </For>
          </div>
        )}
      </For>
    </>
  );
};

// Global toast utilities
let globalToast: ToastContextType['toast'] | null = null;

export const setGlobalToast = (toast: ToastContextType['toast']) => {
  globalToast = toast;
};

export const showToast = (
  message: string | JSX.Element,
  options?: ToastOptions,
): string | null => {
  if (globalToast) {
    return globalToast(message, options);
  }
  console.warn(
    'ToastProvider not initialized. Make sure to wrap your app with ToastProvider.',
  );
  return null;
};

// Convenience functions for global usage
export const toast = {
  show: showToast,
  success: (message: string, options?: Omit<ToastOptions, 'type'>) =>
    showToast(message, { ...options, type: 'success' }),
  error: (message: string, options?: Omit<ToastOptions, 'type'>) =>
    showToast(message, { ...options, type: 'error' }),
  info: (message: string, options?: Omit<ToastOptions, 'type'>) =>
    showToast(message, { ...options, type: 'info' }),
  warning: (message: string, options?: Omit<ToastOptions, 'type'>) =>
    showToast(message, { ...options, type: 'warning' }),
  custom: (component: JSX.Element, options?: Omit<ToastOptions, 'type'>) =>
    showToast(component, { ...options }),
};

export default ToastProvider;
