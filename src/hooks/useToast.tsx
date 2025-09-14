// toast.tsx
import {
  Component,
  createContext,
  createEffect,
  createSignal,
  For,
  onCleanup,
  ParentProps,
  useContext
} from 'solid-js';
import { TransitionGroup } from 'solid-transition-group';

// Types
type ToastPosition = 
  | 'top-left' 
  | 'top-center' 
  | 'top-right' 
  | 'bottom-left' 
  | 'bottom-center' 
  | 'bottom-right';

interface ToastOptions {
  position?: ToastPosition;
  duration?: number;
  pauseOnHover?: boolean;
}

interface Toast {
  id: string;
  message: string;
  method: string;
  options: Required<ToastOptions>;
  createdAt: number;
  pausedAt?: number;
  remainingTime: number;
}

interface ToastMethodProps {
  message: string;
  toastId: string;
  options: Required<ToastOptions>;
}

type ToastMethods = Record<string, Component<ToastMethodProps>>;

interface ToastProviderProps extends ParentProps {
  position?: ToastPosition;
  duration?: number;
  pauseOnHover?: boolean;
  gutter?: number;
  methods: ToastMethods;
}

interface ToastAPI {
  dismiss: (id: string) => void;
  pause: (id: string) => void;
  play: (id: string) => void;
  [key: string]: ((message: string, options?: ToastOptions) => string) | ((id: string) => void);
}

interface ToastContextValue {
  position: ToastPosition;
  duration: number;
  pauseOnHover: boolean;
  gutter: number;
  methods: ToastMethods;
  toasts: () => Toast[];
  api: ToastAPI;
  setHoveredToastId: (id: string | null) => void;
}

// Create Context
const ToastContext = createContext<ToastContextValue>();

// Toast Provider
export const ToastProvider: Component<ToastProviderProps> = (props) => {
  const defaultOptions = {
    get position() { return props.position ?? 'top-right'; },
    get duration() { return props.duration ?? 3000; },
    get pauseOnHover() { return props.pauseOnHover ?? true; },
    get gutter() { return props.gutter ?? 8; },
    get methods() { return props.methods; }
  };

  const [toasts, setToasts] = createSignal<Toast[]>([]);
  const [hoveredToastId, setHoveredToastId] = createSignal<string | null>(null);
  const timers = new Map<string, NodeJS.Timeout>();

  onCleanup(() => {
    timers.forEach(timer => clearTimeout(timer));
    timers.clear();
  });

  const startTimer = (toast: Toast): void => {
    if (timers.has(toast.id)) {
      clearTimeout(timers.get(toast.id));
    }

    const timer = setTimeout(() => {
      dismiss(toast.id);
    }, toast.remainingTime);

    timers.set(toast.id, timer);
  };

  const stopTimer = (toastId: string): void => {
    if (timers.has(toastId)) {
      clearTimeout(timers.get(toastId));
      timers.delete(toastId);
    }
  };

  const dismiss = (id: string): void => {
    stopTimer(id);
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const pause = (id: string): void => {
    const toast = toasts().find(t => t.id === id);
    if (toast && !toast.pausedAt) {
      stopTimer(id);
      const elapsed = Date.now() - toast.createdAt;
      setToasts(prev => prev.map(t =>
        t.id === id
          ? { ...t, pausedAt: Date.now(), remainingTime: t.remainingTime - elapsed }
          : t
      ));
    }
  };

  const play = (id: string): void => {
    const toast = toasts().find(t => t.id === id);
    if (toast && toast.pausedAt) {
      setToasts(prev => prev.map(t =>
        t.id === id
          ? { ...t, pausedAt: undefined, createdAt: Date.now() }
          : t
      ));
      startTimer({ ...toast, createdAt: Date.now() });
    }
  };

  const createToast = (method: string, message: string, options: ToastOptions = {}): string => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const mergedOptions: Required<ToastOptions> = {
      position: options.position ?? defaultOptions.position,
      duration: options.duration ?? defaultOptions.duration,
      pauseOnHover: options.pauseOnHover ?? defaultOptions.pauseOnHover
    };

    const toast: Toast = {
      id,
      message,
      method,
      options: mergedOptions,
      createdAt: Date.now(),
      remainingTime: mergedOptions.duration
    };

    setToasts(prev => [toast, ...prev]);

    if (mergedOptions.duration > 0) {
      startTimer(toast);
    }

    return id;
  };

  // Create API with dynamic methods
  const api = new Proxy({
    dismiss,
    pause,
    play
  } as ToastAPI, {
    get(target, prop: string) {
      if (prop in target) {
        return target[prop];
      }
      if (prop in defaultOptions.methods) {
        return (message: string, options?: ToastOptions) => createToast(prop, message, options);
      }
      return undefined;
    }
  });

  // Handle pause on hover
  createEffect(() => {
    const hovered = hoveredToastId();
    if (hovered) {
      const toast = toasts().find(t => t.id === hovered);
      if (toast && toast.options.pauseOnHover && !toast.pausedAt) {
        pause(hovered);
      }
    } else {
      toasts().forEach(toast => {
        if (toast.pausedAt && toast.options.pauseOnHover) {
          play(toast.id);
        }
      });
    }
  });

  const contextValue: ToastContextValue = {
    ...defaultOptions,
    toasts,
    api,
    setHoveredToastId
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {props.children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

// Toast Container
const ToastContainer: Component = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }

  const { toasts, position, gutter, methods, setHoveredToastId } = context;

  const containerClass = (): string => {
    const baseClass = 'toast-container';
    return `${baseClass} ${position}`;
  };

  return (
    <div class={containerClass()}>
      <TransitionGroup name="toast">
        <For each={toasts()}>
          {(toast, index) => {
            const Component = methods[toast.method];
            if (!Component) return null;

            return (
              <div
                style={{
                  'margin-bottom': index() < toasts().length - 1 ? `${gutter}px` : '0'
                }}
                onMouseEnter={() => setHoveredToastId(toast.id)}
                onMouseLeave={() => setHoveredToastId(null)}
              >
                <Component
                  message={toast.message}
                  toastId={toast.id}
                  options={toast.options}
                />
              </div>
            );
          }}
        </For>
      </TransitionGroup>
    </div>
  );
};

// Hook to use toast
export const useToast = (): ToastAPI => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context.api;
};

// Export types
export type { ToastAPI, ToastMethodProps, ToastMethods, ToastOptions, ToastPosition };
