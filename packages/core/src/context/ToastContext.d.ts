import { Component, ParentProps } from 'solid-js';
type ToastPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
interface Toast {
    id: string;
    message: string;
    method: string;
    options: Required<ToastOptions>;
    createdAt: number;
    pausedAt?: number;
    dismissedAt?: number;
    remainingTime: number;
    top: number | string;
    bottom: number | string;
    height: number;
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
export type ToastAPIMethods = Record<string, (message: string, options?: ToastOptions) => string>;
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
    remove: (id: string) => void;
    setHoveredToastId: (id: string | null) => void;
    setToastHeight: (id: string, height: number) => void;
    setToasts: (toasts: Toast[]) => void;
}
interface ToastAPIBase {
    dismiss: (id: string) => void;
    pause: (id: string) => void;
    play: (id: string) => void;
}
export type ToastAPI = ToastAPIBase & ToastAPIMethods;
export declare const ToastContext: import("solid-js").Context<ToastContextValue | undefined>;
export declare const ToastProvider: (props: ToastProviderProps) => import("solid-js").JSX.Element;
export {};
