// ToastProvider.tsx
import {
    Component,
    For,
    JSX,
    ParentProps,
    createContext,
    createUniqueId,
    mergeProps,
    onCleanup,
    useContext,
} from "solid-js";
import { createStore } from "solid-js/store";
import { TransitionGroup } from "solid-transition-group";

/////////////////////
// Types
/////////////////////

export type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export interface ToastOptions {
  position?: ToastPosition;
  duration?: number; // milliseconds; 0 = persistent
  pauseOnHover?: boolean;
  gutter?: number;
}

export interface RequiredToastOptions {
  position: ToastPosition;
  duration: number;
  pauseOnHover: boolean;
  gutter: number;
}

export interface MethodComponentProps {
  id: string;
  message: string;
  options: RequiredToastOptions;
  onClose: () => void;
}

export type MethodsRecord = Record<string, Component<MethodComponentProps>>;

interface ToastInstance {
  id: string;
  method: string;
  message: string;
  options: RequiredToastOptions;
  remaining: number; // ms remaining until dismissal
  paused: boolean;
  startTime?: number; // timestamp when the active timer started
  timerId?: number; // return value from window.setTimeout
  createdAt: number;
}

interface ToastContextValue {
  // externally callable API
  createToast: (method: string, message: string, opts?: Partial<ToastOptions>) => string;
  dismiss: (id: string) => void;
  pause: (id: string) => void;
  play: (id: string) => void;
  // internals (for rendering)
  getToasts: () => ToastInstance[];
  methods: MethodsRecord;
  defaults: RequiredToastOptions;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

/////////////////////
// Helper: default merging
/////////////////////

const DEFAULTS: RequiredToastOptions = {
  position: "top-right",
  duration: 4000,
  pauseOnHover: true,
  gutter: 8,
};

/////////////////////
// Provider props
/////////////////////

export type ToastProviderProps<M extends MethodsRecord = MethodsRecord> = ParentProps<{
  methods: M;
} & Partial<ToastOptions>>;

/////////////////////
// Implementation
/////////////////////

/**
 * ToastProvider
 *
 * - methods: record of methodName -> Component
 * - accepts optional default position, duration, pauseOnHover, gutter
 *
 * Example:
 * <ToastProvider methods={{ success: SuccessComp }} duration={3000} >
 *   <App />
 * </ToastProvider>
 */
export function ToastProvider<M extends MethodsRecord>(props: ToastProviderProps<M>) {
  const merged = mergeProps(DEFAULTS, props) as RequiredToastOptions & { methods: M; children?: JSX.Element };

  // store toasts as an array so rendering order is preserved (push new toasts at top or bottom as you prefer)
  const [toasts, setToasts] = createStore<ToastInstance[]>([]);

  // timers are stored inside ToastInstance.timerId, but we keep a map for quick clearing if needed
  // We'll also keep a base id from createUniqueId + counter for each toast id.
  const baseId = createUniqueId();
  let idCounter = 0;

  function makeId(): string {
    idCounter += 1;
    return `${baseId}-${idCounter}`;
  }

  // Helper to schedule auto-dismiss for a toast
  function scheduleTimer(t: ToastInstance) {
    // clear previous timer in case
    if (t.timerId !== undefined) {
      clearTimeout(t.timerId);
    }

    if (t.options.duration <= 0) {
      // persistent, do nothing
      return;
    }

    const timerId = window.setTimeout(() => {
      // dismiss when timeout fires
      // Use setToasts to remove the toast
      setToasts((prev) => prev.filter((x) => x.id !== t.id));
    }, Math.max(0, t.remaining));

    // update the instance's timer and startTime
    setToasts((prev) =>
      prev.map((item) => (item.id === t.id ? { ...item, timerId, startTime: Date.now(), paused: false } : item))
    );
  }

  function clearTimer(id: string) {
    const item = toasts.find((t) => t.id === id);
    if (!item) return;
    if (item.timerId !== undefined) {
      clearTimeout(item.timerId);
      // update store: remove timerId and startTime
      setToasts((prev) => prev.map((it) => (it.id === id ? { ...it, timerId: undefined, startTime: undefined } : it)));
    }
  }

  // Create toast API
  function createToast(method: string, message: string, opts?: Partial<ToastOptions>): string {
    if (!merged.methods || !(method in merged.methods)) {
      // Unknown method: still allow but render nothing. It's better to guard early.
      // We'll still create a toast to keep behavior consistent.
      // You could throw here if you prefer strictness.
      // throw new Error(`Unknown toast method "${method}"`);
    }

    // build final options by merging provider defaults and provided overrides
    const finalOptions: RequiredToastOptions = {
      position: opts?.position ?? merged.position,
      duration: opts?.duration ?? merged.duration,
      pauseOnHover: opts?.pauseOnHover ?? merged.pauseOnHover,
      gutter: opts?.gutter ?? merged.gutter,
    };

    const id = makeId();
    const now = Date.now();
    const toast: ToastInstance = {
      id,
      method,
      message,
      options: finalOptions,
      remaining: finalOptions.duration,
      paused: false,
      startTime: finalOptions.duration > 0 ? now : undefined,
      timerId: undefined,
      createdAt: now,
    };

    // add toast to stack (we'll push to the end so newest are on the bottom - change to unshift for reverse)
    setToasts((prev) => [...prev, toast]);

    // schedule timer if needed
    if (toast.options.duration > 0) {
      // schedule after state flushed
      // Create a local copy to avoid closures on reactive store objects
      scheduleTimer(toast);
    }

    return id;
  }

  function dismiss(id: string) {
    // clear timer and remove from store
    const item = toasts.find((t) => t.id === id);
    if (!item) return;
    if (item.timerId !== undefined) {
      clearTimeout(item.timerId);
    }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  function pause(id: string) {
    const item = toasts.find((t) => t.id === id);
    if (!item) return;
    if (item.options.duration <= 0) {
      // persistent - nothing to do
      return;
    }
    if (item.paused) return;
    // compute remaining
    const now = Date.now();
    const elapsed = item.startTime ? now - item.startTime : 0;
    const remaining = Math.max(0, item.remaining - elapsed);

    // clear timer and set paused and remaining
    if (item.timerId !== undefined) {
      clearTimeout(item.timerId);
    }

    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, paused: true, remaining, timerId: undefined, startTime: undefined } : t))
    );
  }

  function play(id: string) {
    const item = toasts.find((t) => t.id === id);
    if (!item) return;
    if (item.options.duration <= 0) {
      return;
    }
    if (!item.paused && item.timerId !== undefined) return;

    // schedule new timer for remaining
    const timerId = window.setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== id));
    }, Math.max(0, item.remaining));

    // update store with new timer, startTime, paused = false
    setToasts((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, paused: false, timerId, startTime: Date.now() } : t
      )
    );
  }

  // Provide getToasts for renderer
  function getToasts() {
    return toasts.slice();
  }

  // cleanup on unmount: clear all timers
  onCleanup(() => {
    for (const t of toasts) {
      if (t.timerId !== undefined) clearTimeout(t.timerId);
    }
    setToasts([]);
  });

  // Build context value
  const ctxValue: ToastContextValue = {
    createToast,
    dismiss,
    pause,
    play,
    getToasts,
    methods: merged.methods,
    defaults: {
      position: merged.position,
      duration: merged.duration,
      pauseOnHover: merged.pauseOnHover,
      gutter: merged.gutter,
    },
  };

  // Provider render: group toasts by position and render containers
  const positions: ToastPosition[] = [
    "top-left",
    "top-center",
    "top-right",
    "bottom-left",
    "bottom-center",
    "bottom-right",
  ];

  // Helper to compute style for a given position
  const containerStyle = (pos: ToastPosition, gap: number): JSX.CSSProperties => {
    const style: JSX.CSSProperties = {
      position: "fixed",
      display: "flex",
      "flex-direction": "column",
      gap: `${gap}px`,
      "z-index": "9999",
      "pointer-events": "none", // allow clicks through unless overridden by toast element
    };

    // placement
    if (pos.includes("top")) {
      style.top = "12px";
    } else {
      style.bottom = "12px";
    }

    if (pos.includes("left")) {
      style.left = "12px";
      style["align-items"] = "flex-start";
    } else if (pos.includes("right")) {
      style.right = "12px";
      style["align-items"] = "flex-end";
    } else {
      // center
      style.left = "50%";
      style.transform = "translateX(-50%)";
      style["align-items"] = "center";
    }

    return style;
  };

  // Render function for a group of toasts at a position
  function ToastGroup(props: { position: ToastPosition }) {
    const pos = props.position;
    const groupToasts = toasts.filter((t) => t.options.position === pos);

    // nothing to render if empty
    if (groupToasts.length === 0) {
      return null;
    }

    return (
      <div style={containerStyle(pos, merged.gutter)}>
        <TransitionGroup>
          <For each={groupToasts}>{(t) => {
            const Comp = merged.methods[t.method] ?? (() => null);
            // wrapper needs pointer events enabled to allow interaction with toasts
            return (
              <div
                
                style={{ "pointer-events": "auto" }}
                onPointerEnter={() => {
                  if (t.options.pauseOnHover) pause(t.id);
                }}
                onPointerLeave={() => {
                  if (t.options.pauseOnHover) play(t.id);
                }}
              >
                <Comp
                  id={t.id}
                  message={t.message}
                  options={t.options}
                  onClose={() => dismiss(t.id)}
                />
              </div>
            );
          }}</For>
        </TransitionGroup>
      </div>
    );
  }

  // Return provider
  return (
    <ToastContext.Provider value={ctxValue}>
      {props.children}
      {/* Render one container per position */}
      <For each={positions}>{(pos) => <ToastGroup position={pos} />}</For>
    </ToastContext.Provider>
  );
}

/////////////////////
// useToast hook - typed
/////////////////////

/**
 * useToast<M>
 * Returns an API typed to the keys of the provided methods record.
 *
 * Example:
 * const toast = useToast<typeof methods>();
 * toast.success("hi");
 */
export function useToast<M extends MethodsRecord>(): {
  [K in keyof M]: (message: string, opts?: Partial<ToastOptions>) => string;
} & {
  dismiss: (id: string) => void;
  pause: (id: string) => void;
  play: (id: string) => void;
} {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used inside a ToastProvider");
  }

  // Build a typed methods wrapper based on ctx.methods keys
  const api = {} as {
    [k: string]: (message: string, opts?: Partial<ToastOptions>) => string;
  };

  for (const key of Object.keys(ctx.methods)) {
    api[key] = (message: string, opts?: Partial<ToastOptions>) => ctx.createToast(key, message, opts);
  }

  // cast to the fully typed return value
  return {
    ...(api as any),
    dismiss: ctx.dismiss,
    pause: ctx.pause,
    play: ctx.play,
  } as unknown as {
    [K in keyof M]: (message: string, opts?: Partial<ToastOptions>) => string;
  } & {
    dismiss: (id: string) => void;
    pause: (id: string) => void;
    play: (id: string) => void;
  };
}

/////////////////////
// Example default minimal toast component (optional)
// Users will pass their own components to the provider's methods prop.
// This file intentionally doesn't export this example; it's for reference.
/*
const BasicToast: Component<MethodComponentProps> = (props) => {
  return (
    <div style={{
      background: '#333',
      color: '#fff',
      padding: '8px 12px',
      borderRadius: '6px',
      boxShadow: '0 6px 18px rgba(0,0,0,0.1)',
      minWidth: '220px'
    }}>
      <div>{props.message}</div>
      <div style={{ marginTop: '6px', display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={props.onClose}>Close</button>
      </div>
    </div>
  );
};
*/

