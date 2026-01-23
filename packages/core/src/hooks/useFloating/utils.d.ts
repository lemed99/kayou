import {
  Alignment,
  ArrowPosition,
  Dimensions,
  FloatingPosition,
  Placement,
  Rect,
  Side,
} from './types';

export declare function parsePlacement(placement: Placement): {
  side: Side;
  alignment: Alignment;
};
export declare function getOppositeSide(side: Side): Side;
export declare function getRotationAngle(finalSide: Side): number;
export declare function getElementRect(
  element: HTMLElement,
  container: HTMLElement,
): Rect;
export declare function getViewportRect(container: HTMLElement): Rect;
export declare function calculatePositionForSide(
  referenceRect: Rect,
  floatingDimensions: Dimensions,
  side: Side,
  alignment: Alignment,
  offset: number,
): FloatingPosition;
export declare function checkFit(
  position: FloatingPosition,
  dimensions: Dimensions,
  viewportRect: Rect,
): {
  horizontal: boolean;
  vertical: boolean;
};
export declare function computePosition(
  referenceRect: Rect,
  floatingDimensions: Dimensions,
  placement: Placement,
  viewportRect: Rect,
  offset: number,
  arrowSize?: number,
  renderArrow?: boolean,
): {
  position: FloatingPosition;
  finalPlacement: Placement;
};
export declare function computeArrowPosition(
  referenceRect: Rect,
  floatingPosition: FloatingPosition,
  floatingDimensions: Dimensions,
  arrowDimensions: Dimensions,
  finalPlacement: Placement,
  arrowAlignment: Alignment,
  arrowOffset: number,
  arrowInset: number,
): ArrowPosition;
export declare function canFitWithinContainer(
  referenceRect: Rect,
  floatingDimensions: Dimensions,
  viewportRect: Rect,
  placement: Placement,
  offset: number,
): boolean;
export declare function hasFixedAncestor(el: HTMLElement | null): boolean;
export declare function getScrollableAncestor(el: HTMLElement | null): HTMLElement | null;
