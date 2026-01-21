import { createSignal, onMount, onCleanup, Suspense, Show, createEffect } from 'solid-js';
import { useParams, useSearchParams, useLocation } from '@solidjs/router';
import { Dynamic } from 'solid-js/web';
import { ToastProvider } from '@exowpee/solidly/context';
import { getBlockVariant } from '../../../registry/blockRegistry';

/**
 * Isolated preview page for block components.
 * Renders components in a clean environment without the main app chrome.
 *
 * URL format: /preview/{category}/{block}?variant=0&theme=light
 *
 * Query params:
 * - variant: Index of the variant to display (default: 0)
 * - theme: 'light' or 'dark' (default: 'light')
 *
 * PostMessage API:
 * - { type: 'setTheme', theme: 'light' | 'dark' }
 * - { type: 'setVariant', variant: number }
 */

interface PreviewMessage {
  type: 'setTheme' | 'setVariant';
  theme?: 'light' | 'dark';
  variant?: number;
}

export default function PreviewPage() {
  const params = useParams<{ category: string; block: string }>();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  // Debug logging
  console.warn('[Preview] params:', JSON.stringify(params));
  console.warn('[Preview] pathname:', location.pathname);

  const [theme, setTheme] = createSignal<'light' | 'dark'>(
    (searchParams.theme as 'light' | 'dark') || 'light'
  );
  const [variantIndex, setVariantIndex] = createSignal(
    parseInt(searchParams.variant || '0', 10)
  );

  // Build the block path from URL params or extract from pathname as fallback
  const blockPath = () => {
    // Try params first
    if (params.category && params.block) {
      const path = `${params.category}/${params.block}`;
      console.warn('[Preview] blockPath from params:', path);
      return path;
    }
    // Fallback: extract from pathname (e.g., /preview/authentication/login -> authentication/login)
    const match = location.pathname.match(/^\/preview\/(.+)$/);
    const path = match ? match[1] : '';
    console.warn('[Preview] blockPath from pathname:', path);
    return path;
  };

  // Get the variant component
  const variant = () => {
    const path = blockPath();
    const v = getBlockVariant(path, variantIndex());
    console.warn('[Preview] variant for', path, ':', !!v);
    return v;
  };

  // Listen for postMessage from parent
  onMount(() => {
    const handleMessage = (event: MessageEvent<PreviewMessage>) => {
      const data = event.data;

      if (data?.type === 'setTheme' && (data.theme === 'light' || data.theme === 'dark')) {
        setTheme(data.theme);
      }

      if (data?.type === 'setVariant' && typeof data.variant === 'number') {
        setVariantIndex(data.variant);
      }
    };

    window.addEventListener('message', handleMessage);

    // Notify parent that preview is ready
    window.parent.postMessage({ type: 'previewReady' }, '*');

    onCleanup(() => {
      window.removeEventListener('message', handleMessage);
    });
  });

  // Apply theme class to html element
  createEffect(() => {
    if (theme() === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  });

  return (
    <ToastProvider methods={{}}>
      <div
        class={`min-h-screen ${theme() === 'dark' ? 'dark bg-gray-900' : 'bg-white'}`}
        style={{ 'color-scheme': theme() }}
      >
        <Suspense
          fallback={
            <div class="flex h-screen items-center justify-center">
              <div class="size-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
            </div>
          }
        >
          <Show
            when={variant()}
            fallback={
              <div class="flex h-screen flex-col items-center justify-center gap-4 text-gray-500">
                <svg class="size-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p class="text-lg">Block not found</p>
                <p class="text-sm text-gray-400">Path: "{blockPath()}"</p>
                <p class="text-sm text-gray-400">Variant: {variantIndex()}</p>
              </div>
            }
          >
            {(v) => <Dynamic component={v().component} />}
          </Show>
        </Suspense>
      </div>
    </ToastProvider>
  );
}
