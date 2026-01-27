import { JSX, createEffect, createMemo, createSignal, onCleanup } from 'solid-js';

import { usePortalContainer } from '../../context/PortalContainerContext';
import { preventBackgroundScroll } from '../../helpers/preventBackgroundScroll';
import {
  ArrowPosition,
  Dimensions,
  FloatingPosition,
  Placement,
  UseFloatingOptions,
  UseFloatingReturn,
} from './types';
import {
  canFitWithinContainer,
  computeArrowPosition,
  computePosition,
  getAllScrollableAncestors,
  getElementRect,
  getScrollableAncestor,
  getViewportRect,
  hasFixedAncestor,
  isElementVisibleInAncestors,
} from './utils';

export function useFloating(options: UseFloatingOptions): UseFloatingReturn {
  const [arrow, setArrow] = createSignal<HTMLElement | null>(null);
  const [reference, setReference] = createSignal<HTMLElement | null>(null);
  const [floating, setFloating] = createSignal<HTMLElement | null>(null);
  const [renderContainer, setRenderContainer] = createSignal<HTMLElement | null>(null);
  const [position, setPosition] = createSignal<FloatingPosition>({ top: 0, left: 0 });
  const [arrowPosition, setArrowPosition] = createSignal<ArrowPosition | null>(null);
  const [isAnchorVisible, setIsAnchorVisible] = createSignal(true);

  // Check for custom portal container from context (used for docs preview, testing, etc.)
  const portalContainerContext = usePortalContainer();

  // Prefer context-provided container, then internal renderContainer
  const effectiveContainer = createMemo(() => {
    const contextContainer = portalContainerContext?.container();
    if (contextContainer) return contextContainer;
    return renderContainer();
  });

  const {
    placement: initialPlacement = 'bottom',
    offset = 8,
    renderArrow = false,
    arrowAlignment = 'center',
    arrowOffset = 0,
    arrowInset = 0,
    backgroundScrollBehavior = 'close',
    onClose,
  } = options;

  const [currentPlacement, setCurrentPlacement] =
    createSignal<Placement>(initialPlacement);

  const update = () => {
    if (!options.isOpen()) return;

    const referenceEl = reference();
    const floatingEl = floating();
    if (!referenceEl || !floatingEl) return;

    // Check anchor visibility for 'follow' behavior
    if (backgroundScrollBehavior === 'follow') {
      const visible = isElementVisibleInAncestors(referenceEl);
      setIsAnchorVisible(visible);
      if (!visible) {
        // Close the floating element when anchor exits viewport
        onClose?.();
        return;
      }
    }

    let refRect = getElementRect(referenceEl, document.body);
    let viewportRect = getViewportRect(document.body);

    const floatDimensions: Dimensions = {
      width: floatingEl.offsetWidth,
      height: floatingEl.offsetHeight,
    };

    const fixedLogic = () => {
      refRect = getElementRect(referenceEl, document.body);
      viewportRect = getViewportRect(document.body);
    };

    if (hasFixedAncestor(referenceEl)) {
      fixedLogic();
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
          fixedLogic();
        } else {
          const style = window.getComputedStyle(container);
          if (style.position === 'static') {
            fixedLogic();
          } else {
            setRenderContainer(container);
          }
        }
      } else {
        const container = renderContainer() ?? document.body;
        refRect = getElementRect(referenceEl, container);
        viewportRect = getViewportRect(container);
      }
    }

    let arrowSize = 0;
    if (renderArrow) {
      if (arrow()) {
        arrowSize = arrow()!.offsetHeight;
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
          finalPlacement,
          arrowAlignment,
          arrowOffset,
          arrowInset,
        );
        setArrowPosition(newArrowPosition);
      } else {
        setArrowPosition(null);
      }
    } else {
      setArrowPosition(null);
    }
  };

  // Handle 'prevent' scroll behavior
  createEffect(() => {
    if (backgroundScrollBehavior === 'prevent' && options.isOpen() && floating()) {
      preventBackgroundScroll(floating()!);
    }
  });

  // Handle 'close' and 'follow' scroll behaviors
  createEffect(() => {
    if (!options.isOpen()) return;
    if (backgroundScrollBehavior === 'prevent') return;

    const referenceEl = reference();
    if (!referenceEl) return;

    const scrollableAncestors = getAllScrollableAncestors(referenceEl);
    let rafId: number | null = null;
    let isScrolling = false;

    const handleScroll = () => {
      if (backgroundScrollBehavior === 'close') {
        onClose?.();
        return;
      }

      // 'follow' behavior: update position with RAF throttling
      if (!isScrolling) {
        isScrolling = true;
        rafId = requestAnimationFrame(() => {
          update();
          isScrolling = false;
        });
      }
    };

    // Add scroll listeners to all scrollable ancestors
    for (const ancestor of scrollableAncestors) {
      ancestor.addEventListener('scroll', handleScroll, { passive: true });
    }

    onCleanup(() => {
      for (const ancestor of scrollableAncestors) {
        ancestor.removeEventListener('scroll', handleScroll);
      }
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    });
  });

  createEffect(() => {
    if (!options.isOpen()) return;

    // Reset anchor visibility when opening
    setIsAnchorVisible(true);

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
      if (typeof document !== 'undefined') {
        setRenderContainer(document.body);
      }
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
    isAnchorVisible,
    update,
    container: effectiveContainer,
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
