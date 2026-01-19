import { onCleanup } from 'solid-js';

export function preventBackgroundScroll(el: HTMLElement) {
  // SSR check
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  // Find the nearest scrollable ancestor within the modal
  const getScrollableAncestor = (target: HTMLElement): HTMLElement | null => {
    let current: HTMLElement | null = target;
    while (current && current !== el) {
      const { overflowY } = getComputedStyle(current);
      const isScrollable = overflowY === 'auto' || overflowY === 'scroll';
      const hasOverflow = current.scrollHeight > current.clientHeight;
      if (isScrollable && hasOverflow) {
        return current;
      }
      current = current.parentElement;
    }
    // Check if el itself is scrollable
    const { overflowY } = getComputedStyle(el);
    const isScrollable = overflowY === 'auto' || overflowY === 'scroll';
    const hasOverflow = el.scrollHeight > el.clientHeight;
    if (isScrollable && hasOverflow) {
      return el;
    }
    return null;
  };

  const preventScroll = (e: WheelEvent | TouchEvent) => {
    const target = e.target as HTMLElement;

    // If target is outside the modal, always prevent
    if (!el.contains(target)) {
      e.preventDefault();
      return;
    }

    // Find scrollable element inside modal
    const scrollable = getScrollableAncestor(target);

    // No scrollable content inside modal - prevent scroll
    if (!scrollable) {
      e.preventDefault();
      return;
    }

    // Check scroll boundaries for wheel events
    if (e instanceof WheelEvent) {
      const { scrollTop, scrollHeight, clientHeight } = scrollable;
      const atTop = scrollTop <= 0;
      const atBottom = scrollTop + clientHeight >= scrollHeight;

      // Scrolling up at top or down at bottom - prevent to avoid background scroll
      if ((e.deltaY < 0 && atTop) || (e.deltaY > 0 && atBottom)) {
        e.preventDefault();
      }
    }
  };

  // Only use event listeners to prevent scroll
  // Avoid overflow:hidden on html/body as it breaks position:sticky elements
  window.addEventListener('wheel', preventScroll, { passive: false });
  window.addEventListener('touchmove', preventScroll, { passive: false });

  onCleanup(() => {
    window.removeEventListener('wheel', preventScroll);
    window.removeEventListener('touchmove', preventScroll);
  });
}
