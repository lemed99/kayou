import { JSX, Show, createEffect, createSignal, onCleanup } from 'solid-js';
import { Portal } from 'solid-js/web';

import { createPresence } from '@solid-primitives/presence';

import { useDataTableInternal } from './DataTableInternalContext';

export function DataTableContextMenu<T extends Record<string, unknown>>(): JSX.Element {
  const ctx = useDataTableInternal<T>();

  const isOpen = () => !!ctx.contextMenuState();
  const { isVisible, isMounted } = createPresence(isOpen, {
    transitionDuration: 200,
  });

  const [menuRef, setMenuRef] = createSignal<HTMLDivElement | undefined>();

  // Cached position — only updates when context menu opens, retained during exit animation
  const [cachedPosition, setCachedPosition] = createSignal<JSX.CSSProperties>({
    display: 'none',
  });
  // Cache menu content so it renders during exit animation
  const [lastContent, setLastContent] = createSignal<{
    row: T;
    index: number;
  } | null>(null);

  createEffect(() => {
    const state = ctx.contextMenuState();
    if (!state) return; // keep last position/content during exit animation

    setLastContent({ row: state.row, index: state.index });

    let { x, y } = state;
    const el = menuRef();
    const menuWidth = el?.offsetWidth ?? 180;
    const menuHeight = el?.offsetHeight ?? 200;

    if (x + menuWidth > window.innerWidth) {
      x = window.innerWidth - menuWidth - 8;
    }
    if (y + menuHeight > window.innerHeight) {
      y = window.innerHeight - menuHeight - 8;
    }

    setCachedPosition({
      position: 'fixed',
      left: `${x}px`,
      top: `${y}px`,
      'z-index': 50,
    });
  });

  // Close on pointerdown outside, Escape, scroll
  createEffect(() => {
    if (!isMounted()) return;

    const handlePointerDown = (e: PointerEvent) => {
      const el = menuRef();
      if (el && !el.contains(e.target as Node)) {
        ctx.closeContextMenu();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        ctx.closeContextMenu();
      }
    };

    const handleScroll = () => {
      ctx.closeContextMenu();
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('scroll', handleScroll, true);

    onCleanup(() => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('scroll', handleScroll, true);
    });
  });

  return (
    <Show when={isMounted()}>
      <Portal>
        <div
          ref={setMenuRef}
          role="menu"
          style={{
            ...cachedPosition(),
            opacity: isVisible() ? '1' : '0',
            transform: isVisible() ? 'scale(1)' : 'scale(0.8)',
            'transition-property': 'opacity, transform',
            'transition-duration': '.2s',
            'transition-timing-function': 'cubic-bezier(.32, .72, 0, 1)',
          }}
          class="rounded-md border border-neutral-200 bg-white py-1 shadow-lg dark:border-neutral-700 dark:bg-neutral-900"
        >
          <Show when={lastContent()}>
            {(content) =>
              ctx.rowContextMenu!(content().row, content().index, ctx.closeContextMenu)
            }
          </Show>
        </div>
      </Portal>
    </Show>
  );
}
