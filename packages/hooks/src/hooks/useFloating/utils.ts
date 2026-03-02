import {
  Alignment,
  ArrowPosition,
  Dimensions,
  FloatingPosition,
  Placement,
  Rect,
  Side,
} from './types';

export function parsePlacement(placement: Placement): {
  side: Side;
  alignment: Alignment;
} {
  const [side, alignment = 'center'] = placement.split('-') as [Side, Alignment?];
  return { side, alignment: alignment || 'center' };
}

export function getOppositeSide(side: Side): Side {
  const opposites: Record<Side, Side> = {
    top: 'bottom',
    bottom: 'top',
    left: 'right',
    right: 'left',
  };
  return opposites[side];
}

export function getRotationAngle(finalSide: Side): number {
  const sideToAngle: Record<Side, number> = {
    top: 0,
    right: 90,
    bottom: 180,
    left: 270,
  };
  return sideToAngle[finalSide];
}

export function getElementRect(element: HTMLElement, container: HTMLElement): Rect {
  const rect = element.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  const scrollTop = container.scrollTop;
  const scrollLeft = container.scrollLeft;

  return {
    top: rect.top - containerRect.top + scrollTop,
    left: rect.left - containerRect.left + scrollLeft,
    bottom: rect.bottom - containerRect.top + scrollTop,
    right: rect.right - containerRect.left + scrollLeft,
    width: rect.width,
    height: rect.height,
  };
}

export function getViewportRect(container: HTMLElement): Rect {
  const containerRect = container.getBoundingClientRect();
  const scrollTop = container.scrollTop;
  const scrollLeft = container.scrollLeft;

  let visibleTop = scrollTop;
  let visibleLeft = scrollLeft;
  let visibleBottom = scrollTop + container.clientHeight;
  let visibleRight = scrollLeft + container.clientWidth;

  if (containerRect.top < 0) {
    visibleTop += Math.abs(containerRect.top);
  }
  if (containerRect.left < 0) {
    visibleLeft += Math.abs(containerRect.left);
  }
  if (containerRect.bottom > window.innerHeight) {
    visibleBottom -= containerRect.bottom - window.innerHeight;
  }
  if (containerRect.right > window.innerWidth) {
    visibleRight -= containerRect.right - window.innerWidth;
  }

  return {
    top: visibleTop,
    left: visibleLeft,
    bottom: visibleBottom,
    right: visibleRight,
    width: visibleRight - visibleLeft,
    height: visibleBottom - visibleTop,
  };
}

export function calculatePositionForSide(
  referenceRect: Rect,
  floatingDimensions: Dimensions,
  side: Side,
  alignment: Alignment,
  offset: number,
): FloatingPosition {
  let top = 0;
  let left = 0;

  switch (side) {
    case 'top':
      top = referenceRect.top - floatingDimensions.height - offset;
      break;
    case 'bottom':
      top = referenceRect.bottom + offset;
      break;
    case 'left':
      left = referenceRect.left - floatingDimensions.width - offset;
      break;
    case 'right':
      left = referenceRect.right + offset;
      break;
  }

  if (side === 'top' || side === 'bottom') {
    switch (alignment) {
      case 'start':
        left = referenceRect.left;
        break;
      case 'end':
        left = referenceRect.right - floatingDimensions.width;
        break;
      case 'center':
        left = referenceRect.left + (referenceRect.width - floatingDimensions.width) / 2;
        break;
    }
  } else {
    switch (alignment) {
      case 'start':
        top = referenceRect.top;
        break;
      case 'end':
        top = referenceRect.bottom - floatingDimensions.height;
        break;
      case 'center':
        top = referenceRect.top + (referenceRect.height - floatingDimensions.height) / 2;
        break;
    }
  }

  return { top, left };
}

export function checkFit(
  position: FloatingPosition,
  dimensions: Dimensions,
  viewportRect: Rect,
): { horizontal: boolean; vertical: boolean } {
  const left = position.left ?? 0;
  const top = position.top ?? 0;

  const horizontal =
    left >= viewportRect.left && left + dimensions.width <= viewportRect.right;

  const vertical =
    top >= viewportRect.top && top + dimensions.height <= viewportRect.bottom;

  return { horizontal, vertical };
}

function shiftWithinBounds(
  position: FloatingPosition,
  dimensions: Dimensions,
  viewportRect: Rect,
  currentSide: Side,
  currentAlignment: Alignment,
  referenceRect: Rect,
): { position: FloatingPosition; alignment: Alignment } {
  let { top, left } = position;
  let finalAlignment = currentAlignment;

  if (currentSide === 'top' || currentSide === 'bottom') {
    if (left < viewportRect.left) {
      const shiftedLeft = referenceRect.left;
      const currentOverflow = viewportRect.left - left;
      const shiftedOverflow = Math.max(0, shiftedLeft + dimensions.width - viewportRect.right);
      if (shiftedOverflow < currentOverflow) {
        finalAlignment = 'start';
        left = shiftedLeft;
      }
    } else if (left + dimensions.width > viewportRect.right) {
      const shiftedLeft = referenceRect.right - dimensions.width;
      const currentOverflow = left + dimensions.width - viewportRect.right;
      const shiftedOverflow = Math.max(0, viewportRect.left - shiftedLeft);
      if (shiftedOverflow < currentOverflow) {
        finalAlignment = 'end';
        left = shiftedLeft;
      }
    }
  }

  if (currentSide === 'left' || currentSide === 'right') {
    if (top < viewportRect.top) {
      const shiftedTop = referenceRect.top;
      const currentOverflow = viewportRect.top - top;
      const shiftedOverflow = Math.max(0, shiftedTop + dimensions.height - viewportRect.bottom);
      if (shiftedOverflow < currentOverflow) {
        finalAlignment = 'start';
        top = shiftedTop;
      }
    } else if (top + dimensions.height > viewportRect.bottom) {
      const shiftedTop = referenceRect.bottom - dimensions.height;
      const currentOverflow = top + dimensions.height - viewportRect.bottom;
      const shiftedOverflow = Math.max(0, viewportRect.top - shiftedTop);
      if (shiftedOverflow < currentOverflow) {
        finalAlignment = 'end';
        top = shiftedTop;
      }
    }
  }

  return { position: { top, left }, alignment: finalAlignment };
}

export function computePosition(
  referenceRect: Rect,
  floatingDimensions: Dimensions,
  placement: Placement,
  viewportRect: Rect,
  offset: number,
  arrowSize: number = 0,
  renderArrow: boolean = false,
): { position: FloatingPosition; finalPlacement: Placement } {
  const { side, alignment } = parsePlacement(placement);

  const effectiveOffset = renderArrow ? offset + arrowSize : offset;

  let position = calculatePositionForSide(
    referenceRect,
    floatingDimensions,
    side,
    alignment,
    effectiveOffset,
  );

  let finalSide = side;
  let finalAlignment = alignment;

  const fits = checkFit(position, floatingDimensions, viewportRect);

  if ((side === 'top' || side === 'bottom') && !fits.vertical) {
    const flippedSide = getOppositeSide(side);
    const spaceOnCurrentSide =
      side === 'top'
        ? referenceRect.top - viewportRect.top
        : viewportRect.bottom - referenceRect.bottom;
    const spaceOnFlippedSide =
      flippedSide === 'top'
        ? referenceRect.top - viewportRect.top
        : viewportRect.bottom - referenceRect.bottom;

    if (spaceOnFlippedSide > spaceOnCurrentSide) {
      const flippedPosition = calculatePositionForSide(
        referenceRect,
        floatingDimensions,
        flippedSide,
        alignment,
        effectiveOffset,
      );
      position = flippedPosition;
      finalSide = flippedSide;
    }
  }

  if ((side === 'left' || side === 'right') && !fits.horizontal) {
    const flippedSide = getOppositeSide(side);
    const spaceOnCurrentSide =
      side === 'left'
        ? referenceRect.left - viewportRect.left
        : viewportRect.right - referenceRect.right;
    const spaceOnFlippedSide =
      flippedSide === 'left'
        ? referenceRect.left - viewportRect.left
        : viewportRect.right - referenceRect.right;

    if (spaceOnFlippedSide > spaceOnCurrentSide) {
      const flippedPosition = calculatePositionForSide(
        referenceRect,
        floatingDimensions,
        flippedSide,
        alignment,
        effectiveOffset,
      );
      position = flippedPosition;
      finalSide = flippedSide;
    }
  }

  const shifted = shiftWithinBounds(
    position,
    floatingDimensions,
    viewportRect,
    finalSide,
    finalAlignment,
    referenceRect,
  );

  position = shifted.position;
  finalAlignment = shifted.alignment;

  const finalPlacement =
    finalAlignment === 'center'
      ? finalSide
      : (`${finalSide}-${finalAlignment}` as Placement);

  return { position, finalPlacement };
}

export function computeArrowPosition(
  referenceRect: Rect,
  floatingPosition: FloatingPosition,
  floatingDimensions: Dimensions,
  arrowDimensions: Dimensions,
  finalPlacement: Placement,
  arrowAlignment: Alignment,
  arrowOffset: number,
  arrowInset: number,
): ArrowPosition {
  const { side: finalSide, alignment: floatingAlignment } =
    parsePlacement(finalPlacement);

  if (arrowAlignment !== 'center') {
    arrowAlignment = floatingAlignment;
  }

  const arrowPosition: ArrowPosition = {};
  const rotation = getRotationAngle(finalSide);

  switch (finalSide) {
    case 'top':
      arrowPosition.top = floatingDimensions.height - arrowInset;
      arrowPosition.transformOrigin = 'center bottom';
      break;
    case 'bottom':
      arrowPosition.top = -arrowDimensions.height + arrowInset;
      arrowPosition.transformOrigin = 'center top';
      break;
    case 'left':
      arrowPosition.left =
        floatingDimensions.width - arrowDimensions.height * 0.5 - arrowInset;
      arrowPosition.transformOrigin = 'right center';
      break;
    case 'right':
      arrowPosition.left = -arrowDimensions.height * 1.5 + arrowInset;
      arrowPosition.transformOrigin = 'left center';
      break;
  }

  if (finalSide === 'top' || finalSide === 'bottom') {
    const referenceCenter = referenceRect.left + referenceRect.width / 2;
    const referenceStart = referenceRect.left;
    const referenceEnd = referenceRect.right;
    const floatingLeft = floatingPosition.left;

    if (arrowAlignment === 'start') {
      arrowPosition.left = referenceStart - floatingLeft + arrowOffset;
    } else if (arrowAlignment === 'end') {
      arrowPosition.left =
        referenceEnd - floatingLeft - arrowDimensions.width - arrowOffset;
    } else {
      arrowPosition.left = referenceCenter - floatingLeft - arrowDimensions.width / 2;
    }
  } else {
    const referenceCenter = referenceRect.top + referenceRect.height / 2;
    const referenceStart = referenceRect.top;
    const referenceEnd = referenceRect.bottom;
    const floatingTop = floatingPosition.top;

    if (arrowAlignment === 'start') {
      arrowPosition.top = referenceStart - floatingTop + arrowOffset;
    } else if (arrowAlignment === 'end') {
      arrowPosition.top =
        referenceEnd - floatingTop - arrowDimensions.height - arrowOffset;
    } else {
      arrowPosition.top = referenceCenter - floatingTop - arrowDimensions.height / 2;
    }
  }

  arrowPosition.transform = `rotate(${rotation}deg)`;

  return arrowPosition;
}

export function canFitWithinContainer(
  referenceRect: Rect,
  floatingDimensions: Dimensions,
  viewportRect: Rect,
  placement: Placement,
  offset: number,
): boolean {
  const { side } = parsePlacement(placement);

  const spaceTop = referenceRect.top - viewportRect.top;
  const spaceBottom = viewportRect.bottom - referenceRect.bottom;
  const spaceLeft = referenceRect.left - viewportRect.left;
  const spaceRight = viewportRect.right - referenceRect.right;

  if (side === 'top' || side === 'bottom') {
    const fitsTop = floatingDimensions.height + offset <= spaceTop;
    const fitsBottom = floatingDimensions.height + offset <= spaceBottom;
    return fitsTop || fitsBottom;
  }

  const fitsLeft = floatingDimensions.width + offset <= spaceLeft;
  const fitsRight = floatingDimensions.width + offset <= spaceRight;
  return fitsLeft || fitsRight;
}

export function hasFixedAncestor(el: HTMLElement | null): boolean {
  let current: HTMLElement | null = el;

  while (current && current !== document.body) {
    const style = window.getComputedStyle(current);
    const position = style.position;
    const transform = style.transform;
    const willChange = style.willChange;
    const filter = style.filter;

    if (position === 'fixed') {
      return true;
    }

    if (transform !== 'none' || filter !== 'none' || willChange.includes('transform')) {
      return true;
    }

    current = current.parentElement;
  }

  return false;
}

export function getScrollableAncestor(el: HTMLElement | null): HTMLElement | null {
  let current: HTMLElement | null = el?.parentElement || null;

  while (current && current !== document.body) {
    const style = getComputedStyle(current);
    const overflowY = style.overflowY;
    const overflowX = style.overflowX;

    const isScrollableY =
      (overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay') &&
      current.scrollHeight > current.clientHeight;

    const isScrollableX =
      (overflowX === 'auto' || overflowX === 'scroll' || overflowX === 'overlay') &&
      current.scrollWidth > current.clientWidth;

    if (isScrollableY || isScrollableX) {
      return current;
    }

    current = current.parentElement;
  }

  // If no scrollable ancestor found, default to window/document
  return null;
}

/**
 * Get all scrollable ancestors of an element, from nearest to furthest.
 * Includes window as the last element if no other scrollable ancestors prevent it.
 */
export function getAllScrollableAncestors(el: HTMLElement | null): (HTMLElement | Window)[] {
  const ancestors: (HTMLElement | Window)[] = [];
  let current: HTMLElement | null = el?.parentElement || null;

  while (current && current !== document.body) {
    const style = getComputedStyle(current);
    const overflowY = style.overflowY;
    const overflowX = style.overflowX;

    const isScrollableY =
      (overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay') &&
      current.scrollHeight > current.clientHeight;

    const isScrollableX =
      (overflowX === 'auto' || overflowX === 'scroll' || overflowX === 'overlay') &&
      current.scrollWidth > current.clientWidth;

    if (isScrollableY || isScrollableX) {
      ancestors.push(current);
    }

    current = current.parentElement;
  }

  // Always include window for document-level scroll
  ancestors.push(window);

  return ancestors;
}

/**
 * Check if an element is visible within all its scrollable ancestor containers.
 * Returns true if any part of the element is visible.
 */
export function isElementVisibleInAncestors(el: HTMLElement): boolean {
  const rect = el.getBoundingClientRect();

  // Check against viewport first
  const inViewport =
    rect.bottom > 0 &&
    rect.top < window.innerHeight &&
    rect.right > 0 &&
    rect.left < window.innerWidth;

  if (!inViewport) return false;

  // Check against each scrollable ancestor
  let current: HTMLElement | null = el.parentElement;

  while (current && current !== document.body) {
    const style = getComputedStyle(current);
    const overflowY = style.overflowY;
    const overflowX = style.overflowX;

    const isScrollableY =
      (overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay') &&
      current.scrollHeight > current.clientHeight;

    const isScrollableX =
      (overflowX === 'auto' || overflowX === 'scroll' || overflowX === 'overlay') &&
      current.scrollWidth > current.clientWidth;

    if (isScrollableY || isScrollableX) {
      const containerRect = current.getBoundingClientRect();

      // Check if element is visible within this container
      const visibleInContainer =
        rect.bottom > containerRect.top &&
        rect.top < containerRect.bottom &&
        rect.right > containerRect.left &&
        rect.left < containerRect.right;

      if (!visibleInContainer) return false;
    }

    current = current.parentElement;
  }

  return true;
}
