import { onCleanup } from 'solid-js';

export function preventBackgroundScroll(el: HTMLElement) {
  const preventScroll = (e: Event) => {
    if (!el.contains(e.target as Node)) {
      e.preventDefault();
    }
  };

  const originalBodyOverflow = document.body.style.overflow;
  const originalHtmlOverflow = document.documentElement.style.overflow;
  const originalTouchAction = document.body.style.touchAction;

  // Hide scrollbars & block touch scroll
  document.body.style.overflow = 'hidden';
  document.documentElement.style.overflow = 'hidden';
  document.body.style.touchAction = 'none';

  window.addEventListener('wheel', preventScroll, { passive: false });
  window.addEventListener('touchmove', preventScroll, { passive: false });
  window.addEventListener('scroll', preventScroll, { passive: false });

  onCleanup(() => {
    document.body.style.overflow = originalBodyOverflow;
    document.documentElement.style.overflow = originalHtmlOverflow;
    document.body.style.touchAction = originalTouchAction;

    window.removeEventListener('wheel', preventScroll);
    window.removeEventListener('touchmove', preventScroll);
    window.removeEventListener('scroll', preventScroll);
  });
}
