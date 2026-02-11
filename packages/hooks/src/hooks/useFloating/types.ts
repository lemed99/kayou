import { Accessor, JSX } from 'solid-js';

export type Placement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end';

export type Side = 'top' | 'bottom' | 'left' | 'right';
export type Alignment = 'start' | 'end' | 'center';

export interface FloatingPosition {
  top: number;
  left: number;
}

export interface ArrowPosition {
  top?: number;
  left?: number;
  transform?: string;
  transformOrigin?: string;
}

export interface Dimensions {
  width: number;
  height: number;
}

export interface Rect {
  top: number;
  left: number;
  bottom: number;
  right: number;
  width: number;
  height: number;
}

export type BackgroundScrollBehavior = 'prevent' | 'close' | 'follow';

export interface UseFloatingOptions {
  placement?: Placement;
  offset?: number;
  isOpen: Accessor<boolean>;
  renderArrow?: boolean;
  arrowAlignment?: Alignment;
  arrowOffset?: number;
  arrowInset?: number;
  /** How to handle background scroll when floating is open. @default 'close' */
  backgroundScrollBehavior?: BackgroundScrollBehavior;
  /** Callback when floating should close (required for 'close' and 'follow' behaviors) */
  onClose?: () => void;
  /** Custom container for portal rendering. When provided, floating elements render inside this container instead of document.body. */
  portalContainer?: Accessor<HTMLElement | null>;
}

export interface UseFloatingReturn {
  floatingStyles: Accessor<JSX.CSSProperties>;
  arrowStyles: Accessor<JSX.CSSProperties | null>;
  placement: Accessor<Placement>;
  /** Whether the anchor is visible in its scrollable container (for 'follow' behavior) */
  isAnchorVisible: Accessor<boolean>;
  update: () => void;
  container: Accessor<HTMLElement | null>;
  refs: {
    setReference: (reference: HTMLElement | null) => void;
    setFloating: (floating: HTMLElement | null) => void;
    setArrow: (arrow: HTMLElement | null) => void;
    reference: Accessor<HTMLElement | null>;
    floating: Accessor<HTMLElement | null>;
    arrow: Accessor<HTMLElement | null>;
  };
}
