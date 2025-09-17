import {
  Component,
  For,
  ParentProps,
  createContext,
  createEffect,
  createSignal,
  createUniqueId,
  onCleanup,
  useContext,
} from 'solid-js';
import { createStore, produce } from 'solid-js/store';
import { Portal } from 'solid-js/web';
import { TransitionGroup } from 'solid-transition-group';

import { twMerge } from 'tailwind-merge';

type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

interface Toast {
  id: string;
  message: string;
  method: string;
  options: Required<ToastOptions>;
  createdAt: number;
  pausedAt?: number;
  remainingTime: number;
}

interface ToastOptions {
  position?: ToastPosition;
  duration?: number;
  pauseOnHover?: boolean;
}

export interface ToastMethodProps {
  message: string;
  paused: () => boolean;
  duration: number;
  dismiss: () => void;
  pause: () => void;
  play: () => void;
}

export type ToastMethods = Record<string, Component<ToastMethodProps>>;

export type ToastAPIMethods = Record<
  string,
  (message: string, options?: ToastOptions) => string
>;

interface ToastProviderProps extends ParentProps {
  position?: ToastPosition;
  duration?: number;
  pauseOnHover?: boolean;
  gutter?: number;
  methods: ToastMethods;
}

interface ToastContextValue {
  position: ToastPosition;
  duration: number;
  pauseOnHover: boolean;
  gutter: number;
  methods: ToastMethods;
  toasts: Toast[];
  api: ToastAPI;
  setHoveredToastId: (id: string | null) => void;
}

interface ToastAPIBase {
  dismiss: (id: string) => void;
  pause: (id: string) => void;
  play: (id: string) => void;
}

export type ToastAPI = ToastAPIBase & ToastAPIMethods;

const positionsClass = {
  'top-left': 'top-4 left-4 items-start',
  'top-center': 'top-4 left-1/2 transform -translate-x-1/2 items-center',
  'top-right': 'top-4 right-4 items-end',
  'bottom-left': 'bottom-4 left-4 items-start',
  'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2 items-center',
  'bottom-right': 'bottom-4 right-4 items-end',
};

export const ToastContext = createContext<ToastContextValue>();

const ToastContainer = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }

  const { toasts, position, gutter, methods, setHoveredToastId } = context;

  const getToastYDirection = () => {
    return position.includes('top') ? -1 : 1;
  };

  return (
    <>
      <style>
        {`
        .group-item {
          transition: all 0.3s;
        }
        .group-item-enter,
        .group-item-exit-to {
          opacity: 0;
          transform: translateY(${getToastYDirection() * 10}px);
        }
        `}
      </style>
      <Portal>
        <div
          style={{ gap: `${gutter}px` }}
          class={twMerge('fixed z-50 flex flex-col', positionsClass[position])}
        >
          <TransitionGroup name="group-item">
            <For each={toasts}>
              {(toast) => {
                const Component = methods[toast.method];
                if (!Component) return null;

                return (
                  <div
                    onMouseEnter={() => setHoveredToastId(toast.id)}
                    onMouseLeave={() => setHoveredToastId(null)}
                    class="group-item"
                  >
                    <Component
                      message={toast.message}
                      paused={() => !!toast.pausedAt}
                      duration={toast.options.duration}
                      dismiss={() => context.api.dismiss(toast.id)}
                      pause={() => context.api.pause(toast.id)}
                      play={() => context.api.play(toast.id)}
                    />
                  </div>
                );
              }}
            </For>
          </TransitionGroup>
        </div>
      </Portal>
    </>
  );
};

export const ToastProvider = (props: ToastProviderProps) => {
  const defaultOptions = {
    get position() {
      return props.position ?? 'top-right';
    },
    get duration() {
      return props.duration ?? 3000;
    },
    get pauseOnHover() {
      return props.pauseOnHover ?? true;
    },
    get gutter() {
      return props.gutter ?? 16;
    },
    get methods() {
      return props.methods;
    },
  };

  const [toasts, setToasts] = createStore<Toast[]>([]);
  const [hoveredToastId, setHoveredToastId] = createSignal<string | null>(null);
  const timers = new Map<string, NodeJS.Timeout>();

  onCleanup(() => {
    timers.forEach((timer) => clearTimeout(timer));
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
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const pause = (id: string): void => {
    const toast = toasts.find((t) => t.id === id);
    const toastIndex = toasts.findIndex((t) => t.id === id);
    if (toast && !toast.pausedAt) {
      stopTimer(id);
      setToasts(
        toastIndex,
        produce((t) => {
          t.pausedAt = Date.now();
          t.remainingTime = t.remainingTime - (Date.now() - toast.createdAt);
        }),
      );
    }
  };

  const play = (id: string): void => {
    const toast = toasts.find((t) => t.id === id);
    const toastIndex = toasts.findIndex((t) => t.id === id);
    if (toast && toast.pausedAt) {
      setToasts(
        toastIndex,
        produce((t) => {
          t.pausedAt = undefined;
        }),
      );
      startTimer(toast);
    }
  };

  const createToast = (
    method: string,
    message: string,
    options: ToastOptions = {},
  ): string => {
    const id = `toast-${createUniqueId()}`;
    const mergedOptions: Required<ToastOptions> = {
      position: options.position ?? defaultOptions.position,
      duration: options.duration ?? defaultOptions.duration,
      pauseOnHover: options.pauseOnHover ?? defaultOptions.pauseOnHover,
    };

    if (!Object.keys(defaultOptions.methods).includes(method)) {
      console.warn(`Toast method "${method}" is not defined.`);
      return '';
    }

    const toast: Toast = {
      id,
      message,
      method,
      options: mergedOptions,
      createdAt: Date.now(),
      remainingTime: mergedOptions.duration,
    };

    setToasts(toasts.length, toast);

    if (mergedOptions.duration > 0) {
      startTimer(toast);
    }

    return id;
  };

  const api = new Proxy(
    {
      dismiss,
      pause,
      play,
    } as ToastAPIBase,
    {
      get(target, prop) {
        if (prop in target) {
          return target[prop as keyof ToastAPIBase];
        }
        if (prop in defaultOptions.methods) {
          return (message: string, options?: ToastOptions) =>
            createToast(prop as string, message, options);
        }
        return undefined;
      },
    },
  ) as ToastAPI;

  createEffect(() => {
    const hovered = hoveredToastId();
    if (hovered) {
      const toast = toasts.find((t) => t.id === hovered);
      if (toast && toast.options.pauseOnHover && !toast.pausedAt) {
        pause(hovered);
      }
    } else {
      toasts.forEach((toast) => {
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
    setHoveredToastId,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {props.children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};
