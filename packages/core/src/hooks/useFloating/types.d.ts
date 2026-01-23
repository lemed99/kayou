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
export interface UseFloatingOptions {
  placement?: Placement;
  offset?: number;
  isOpen: Accessor<boolean>;
  renderArrow?: boolean;
  arrowAlignment?: Alignment;
  arrowOffset?: number;
  arrowInset?: number;
}
export interface UseFloatingReturn {
  floatingStyles: Accessor<JSX.CSSProperties>;
  arrowStyles: Accessor<JSX.CSSProperties | null>;
  placement: Accessor<Placement>;
  update: () => void;
  container: Accessor<Node>;
  refs: {
    setReference: (reference: HTMLElement | null) => void;
    setFloating: (floating: HTMLElement | null) => void;
    setArrow: (arrow: HTMLElement | null) => void;
    reference: Accessor<HTMLElement | null>;
    floating: Accessor<HTMLElement | null>;
    arrow: Accessor<HTMLElement | null>;
  };
}
