import { JSX, createEffect, createSignal, onCleanup } from 'solid-js';

import { preventBackgroundScroll } from '../../helpers/preventBackgroundScroll';
import {
  ArrowPosition,
  Dimensions,
  FloatingPosition,
  Placement,
  Rect,
  UseFloatingOptions,
  UseFloatingReturn,
} from './types';
import {
  canFitWithinContainer,
  computeArrowPosition,
  computePosition,
  getElementRect,
  getScrollableAncestor,
  getViewportRect,
  hasFixedAncestor,
  parsePlacement,
} from './utils';

export function useFloating(options: UseFloatingOptions): UseFloatingReturn {
  const [arrow, setArrow] = createSignal<HTMLElement | null>(null);
  const [reference, setReference] = createSignal<HTMLElement | null>(null);
  const [floating, setFloating] = createSignal<HTMLElement | null>(null);
  const [renderContainer, setRenderContainer] = createSignal<HTMLElement>(document.body);
  const [position, setPosition] = createSignal<FloatingPosition>({ top: 0, left: 0 });
  const [arrowPosition, setArrowPosition] = createSignal<ArrowPosition | null>(null);
  const [isFixed, setIsFixed] = createSignal(false);
  const [containerPositionChanged, setContainerPositionChanged] = createSignal(false);

  const {
    placement: initialPlacement = 'bottom',
    offset = 8,
    renderArrow = false,
    arrowAlignment = 'center',
    arrowOffset = 0,
  } = options;

  const [currentPlacement, setCurrentPlacement] =
    createSignal<Placement>(initialPlacement);

  const update = () => {
    if (!options.isOpen()) return;

    const referenceEl = reference();
    const floatingEl = floating();
    if (!referenceEl || !floatingEl) return;

    let refRect: Rect;
    let viewportRect: Rect;

    const floatDimensions: Dimensions = {
      width: floatingEl.offsetWidth,
      height: floatingEl.offsetHeight,
    };

    if (hasFixedAncestor(referenceEl)) {
      setIsFixed(true);
      refRect = getElementRect(referenceEl, document.body);
      viewportRect = getViewportRect(document.body);
    } else {
      const container = getScrollableAncestor(referenceEl);
      if (container) {
        refRect = getElementRect(referenceEl, container);
        viewportRect = getViewportRect(container);
        if (
          !canFitWithinContainer(
            refRect,
            floatDimensions,
            viewportRect,
            initialPlacement,
            offset,
          )
        ) {
          setIsFixed(true);
          refRect = getElementRect(referenceEl, document.body);
          viewportRect = getViewportRect(document.body);
        } else {
          setRenderContainer(container);
          const style = window.getComputedStyle(container);
          if (style.position === 'static') {
            container.style.position = 'relative';
            setContainerPositionChanged(true);
          }
        }
      } else {
        refRect = getElementRect(referenceEl, renderContainer());
        viewportRect = getViewportRect(renderContainer());
      }
    }

    let arrowSize = 0;
    if (renderArrow) {
      if (arrow()) {
        arrowSize = ['top', 'bottom'].includes(parsePlacement(initialPlacement).side)
          ? arrow()!.offsetHeight
          : arrow()!.offsetWidth;
      }
    }

    const { position: newPosition, finalPlacement } = computePosition(
      refRect,
      floatDimensions,
      initialPlacement,
      viewportRect,
      offset,
      arrowSize,
      renderArrow,
    );

    setPosition(newPosition);
    setCurrentPlacement(finalPlacement);

    if (renderArrow) {
      const arrowEl = arrow();
      if (arrowEl) {
        const arrowDimensions: Dimensions = {
          width: arrowEl.offsetWidth,
          height: arrowEl.offsetHeight,
        };
        const newArrowPosition = computeArrowPosition(
          refRect,
          newPosition,
          floatDimensions,
          arrowDimensions,
          initialPlacement,
          finalPlacement,
          arrowAlignment,
          arrowOffset,
        );
        setArrowPosition(newArrowPosition);
      } else {
        setArrowPosition(null);
      }
    } else {
      setArrowPosition(null);
    }
  };

  createEffect(() => {
    if (isFixed() && options.isOpen() && floating()) {
      preventBackgroundScroll(floating()!);
    }
  });

  createEffect(() => {
    if (!options.isOpen()) return;

    update();

    const handleUpdate = () => {
      if (!options.isOpen()) return;
      update();
    };

    const referenceEl = reference();
    const floatingEl = floating();
    const arrowEl = arrow();

    const resizeObserver = new ResizeObserver(handleUpdate);
    if (referenceEl) resizeObserver.observe(referenceEl);
    if (floatingEl) resizeObserver.observe(floatingEl);
    if (renderArrow && arrowEl) resizeObserver.observe(arrowEl);

    onCleanup(() => {
      resizeObserver.disconnect();
      if (containerPositionChanged()) {
        renderContainer().style.position = '';
        setContainerPositionChanged(false);
      }
      setRenderContainer(document.body);
      setIsFixed(false);
    });
  });

  const floatingStyles = (): JSX.CSSProperties => {
    const pos = position();
    return {
      position: 'absolute',
      top: `${pos.top}px`,
      left: `${pos.left}px`,
    };
  };

  const arrowStyles = (): JSX.CSSProperties | null => {
    const pos = arrowPosition();
    if (!pos) return null;

    return {
      position: 'absolute',
      ...(pos.top !== undefined && { top: `${pos.top}px` }),
      ...(pos.left !== undefined && { left: `${pos.left}px` }),
      ...(pos.transform && { transform: pos.transform }),
      ...(pos.transformOrigin && { transformOrigin: pos.transformOrigin }),
    };
  };

  return {
    floatingStyles,
    arrowStyles,
    placement: currentPlacement,
    update,
    container: renderContainer,
    refs: {
      setReference,
      setFloating,
      setArrow,
      reference,
      floating,
      arrow,
    },
  };
}
