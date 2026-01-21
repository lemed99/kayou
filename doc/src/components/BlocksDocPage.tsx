/* eslint-disable solid/no-innerhtml */
import {
  createEffect,
  createMemo,
  createSignal,
  For,
  type JSX,
  onCleanup,
  onMount,
  type ParentProps,
  Show,
} from 'solid-js';

import { A, useLocation } from '@solidjs/router';

import { formatCodeToHTML } from '../helpers/formatCodeToHTML';

// Block categories
type BlockCategory = 'Authentication' | 'Dashboard' | 'Settings' | 'Data Management' | 'Messaging';

interface BlockVariant {
  id: string;
  title: string;
  description?: string;
  component: () => JSX.Element;
  code: string;
}

interface UsedComponentDefinition {
  name: string;
  path: string;
  isPro?: boolean;
}

interface RelatedBlockDefinition {
  name: string;
  path: string;
  description: string;
}

interface BlocksDocPageProps {
  title: string;
  description: string;
  category: BlockCategory;
  variants: BlockVariant[];
  usedComponents?: UsedComponentDefinition[];
  relatedBlocks?: RelatedBlockDefinition[];
  isPro?: boolean;
}

type ViewportSize = 'desktop' | 'tablet' | 'mobile';

const VIEWPORT_DIMENSIONS: Record<ViewportSize, { width: string; height: string }> = {
  desktop: { width: '100%', height: '700px' },
  tablet: { width: '768px', height: '700px' },
  mobile: { width: '375px', height: '700px' },
};

// Viewport icons
const DesktopIcon = () => (
  <svg
    class="size-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
  >
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);

const TabletIcon = () => (
  <svg
    class="size-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
  >
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
    <line x1="12" y1="18" x2="12.01" y2="18" />
  </svg>
);

const MobileIcon = () => (
  <svg
    class="size-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
  >
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
    <line x1="12" y1="18" x2="12.01" y2="18" />
  </svg>
);

const CodeIcon = () => (
  <svg
    class="size-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
  >
    <polyline points="16,18 22,12 16,6" />
    <polyline points="8,6 2,12 8,18" />
  </svg>
);

const PreviewIcon = () => (
  <svg
    class="size-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export default function BlocksDocPage(
  props: ParentProps<BlocksDocPageProps>,
): JSX.Element {
  const location = useLocation();
  const [activeVariantIndex, setActiveVariantIndex] = createSignal(0);
  const [viewport, setViewport] = createSignal<ViewportSize>('desktop');
  const [previewOverride, setPreviewOverride] = createSignal<'light' | 'dark' | null>(
    null,
  );
  const [showCode, setShowCode] = createSignal(false);
  const [copied, setCopied] = createSignal(false);
  const [globalIsDark, setGlobalIsDark] = createSignal(false);
  const [iframeReady, setIframeReady] = createSignal(false);

  let iframeRef: HTMLIFrameElement | undefined;

  // Derive block path from current URL (e.g., /blocks/authentication/login -> authentication/login)
  const blockPath = createMemo(() => {
    const path = location.pathname;
    const match = path.match(/^\/blocks\/(.+)$/);
    return match ? match[1] : '';
  });

  // Track global theme changes
  onMount(() => {
    const updateGlobalTheme = () => {
      setGlobalIsDark(document.documentElement.classList.contains('dark'));
    };

    updateGlobalTheme();

    const observer = new MutationObserver(updateGlobalTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    // Listen for iframe ready message
    const handleMessage = (event: MessageEvent<{ type?: string }>) => {
      if (event.data?.type === 'previewReady') {
        setIframeReady(true);
        // Send initial theme
        sendThemeToIframe();
      }
    };

    window.addEventListener('message', handleMessage);

    onCleanup(() => {
      observer.disconnect();
      window.removeEventListener('message', handleMessage);
    });
  });

  const variantsArray = createMemo(() => props.variants ?? []);
  const usedComponentsArray = createMemo(() => props.usedComponents ?? []);
  const relatedBlocksArray = createMemo(() => props.relatedBlocks ?? []);

  const currentVariant = createMemo(() => {
    const variants = variantsArray();
    return variants[activeVariantIndex()] ?? variants[0];
  });

  const isPreviewDark = () => {
    if (previewOverride() !== null) {
      return previewOverride() === 'dark';
    }
    return globalIsDark();
  };

  // Send theme to iframe
  const sendThemeToIframe = () => {
    if (iframeRef?.contentWindow) {
      iframeRef.contentWindow.postMessage(
        { type: 'setTheme', theme: isPreviewDark() ? 'dark' : 'light' },
        '*'
      );
    }
  };

  // Send variant change to iframe
  const sendVariantToIframe = (index: number) => {
    if (iframeRef?.contentWindow) {
      iframeRef.contentWindow.postMessage(
        { type: 'setVariant', variant: index },
        '*'
      );
    }
  };

  // Update iframe when theme changes
  createEffect(() => {
    const dark = isPreviewDark();
    if (iframeReady()) {
      sendThemeToIframe();
    }
    // Access dark to track it
    void dark;
  });

  const togglePreview = () => {
    const currentlyDark = isPreviewDark();
    setPreviewOverride(currentlyDark ? 'light' : 'dark');
  };

  const resetToGlobal = () => setPreviewOverride(null);

  const handleVariantChange = (index: number) => {
    setActiveVariantIndex(index);
    sendVariantToIframe(index);
  };

  const handleCopy = async () => {
    const variant = currentVariant();
    if (!variant) return;

    try {
      await navigator.clipboard.writeText(variant.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = variant.code;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const dimensions = () => VIEWPORT_DIMENSIONS[viewport()];

  // Generate preview URL
  const previewUrl = createMemo(() => {
    const path = blockPath();
    const variant = activeVariantIndex();
    const theme = isPreviewDark() ? 'dark' : 'light';
    return `/preview/${path}?variant=${variant}&theme=${theme}`;
  });

  return (
    <div class="mx-auto grid w-full max-w-[90rem] grid-cols-1 gap-8 px-4 pt-10 pb-24 sm:px-6">
      {/* Header */}
      <header>
        {/* Breadcrumb */}
        <nav class="mb-4 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <A href="/blocks" class="hover:text-gray-700 dark:hover:text-gray-300">
            Blocks
          </A>
          <span>/</span>
          <span>{props.category}</span>
          <span>/</span>
          <span class="text-gray-900 dark:text-white">{props.title}</span>
        </nav>

        <div class="flex items-center gap-3">
          <h1 class="text-4xl font-medium">{props.title}</h1>
          <Show when={props.isPro}>
            <span class="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 px-3 py-1 text-xs font-semibold text-white shadow-sm">
              <svg class="size-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
              Pro
            </span>
          </Show>
        </div>

        <p class="mt-4 text-base leading-relaxed text-gray-600 dark:text-gray-400">
          {props.description}
        </p>
      </header>

      {/* Variant Tabs */}
      <Show when={variantsArray().length > 1}>
        <div class="flex flex-wrap gap-2">
          <For each={variantsArray()}>
            {(variant, index) => (
              <button
                type="button"
                onClick={() => handleVariantChange(index())}
                class={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  activeVariantIndex() === index()
                    ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {variant.title}
              </button>
            )}
          </For>
        </div>
      </Show>

      {/* Preview Section */}
      <section id="preview" class="scroll-mt-20">
        {/* Toolbar */}
        <div class="flex flex-wrap items-center justify-between gap-4 rounded-t-lg border border-b-0 border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
          <div class="flex items-center gap-2">
            {/* Preview/Code Toggle */}
            <div class="flex items-center rounded-md border border-gray-200 dark:border-gray-600">
              <button
                type="button"
                onClick={() => setShowCode(false)}
                class={`flex items-center gap-1.5 px-3 py-1.5 text-sm transition-colors ${
                  !showCode()
                    ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <PreviewIcon />
                Preview
              </button>
              <button
                type="button"
                onClick={() => setShowCode(true)}
                class={`flex items-center gap-1.5 border-l border-gray-200 px-3 py-1.5 text-sm transition-colors dark:border-gray-600 ${
                  showCode()
                    ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <CodeIcon />
                Code
              </button>
            </div>
          </div>

          <div class="flex items-center gap-2">
            {/* Viewport toggles - only show in preview mode */}
            <Show when={!showCode()}>
              <div class="flex items-center rounded-md border border-gray-200 dark:border-gray-600">
                <button
                  type="button"
                  onClick={() => setViewport('desktop')}
                  class={`p-2 transition-colors ${
                    viewport() === 'desktop'
                      ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300'
                  }`}
                  aria-label="Desktop view"
                  title="Desktop view"
                >
                  <DesktopIcon />
                </button>
                <button
                  type="button"
                  onClick={() => setViewport('tablet')}
                  class={`border-x border-gray-200 p-2 transition-colors dark:border-gray-600 ${
                    viewport() === 'tablet'
                      ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300'
                  }`}
                  aria-label="Tablet view"
                  title="Tablet view (768px)"
                >
                  <TabletIcon />
                </button>
                <button
                  type="button"
                  onClick={() => setViewport('mobile')}
                  class={`p-2 transition-colors ${
                    viewport() === 'mobile'
                      ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300'
                  }`}
                  aria-label="Mobile view"
                  title="Mobile view (375px)"
                >
                  <MobileIcon />
                </button>
              </div>

              {/* Theme toggle */}
              <Show when={previewOverride() !== null}>
                <button
                  type="button"
                  onClick={resetToGlobal}
                  class="rounded-md px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                >
                  Reset
                </button>
              </Show>
              <button
                type="button"
                onClick={togglePreview}
                class="flex cursor-pointer items-center gap-2 rounded-md border border-gray-200 p-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                aria-label={
                  isPreviewDark() ? 'Preview in light mode' : 'Preview in dark mode'
                }
                title={isPreviewDark() ? 'Preview in light mode' : 'Preview in dark mode'}
              >
                <Show
                  when={isPreviewDark()}
                  fallback={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                    </svg>
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                  </svg>
                </Show>
              </button>
            </Show>

            {/* Copy button - always visible */}
            <button
              type="button"
              onClick={() => void handleCopy()}
              class="flex items-center gap-1.5 rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              <Show
                when={copied()}
                fallback={
                  <svg
                    class="size-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                }
              >
                <svg
                  class="size-4 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </Show>
              {copied() ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Preview/Code Content */}
        <div class="overflow-hidden rounded-b-lg border border-gray-200 dark:border-gray-700">
          <Show
            when={!showCode()}
            fallback={
              <div class="max-h-[700px] overflow-auto">
                <div
                  innerHTML={formatCodeToHTML(
                    currentVariant()?.code ?? '',
                    globalIsDark() ? 'dark' : 'light',
                  )}
                />
              </div>
            }
          >
            {/* Block Preview - Now using iframe for true isolation */}
            <div
              class="flex justify-center overflow-auto"
              style={{
                'background-color': isPreviewDark()
                  ? 'rgb(17 24 39)'
                  : 'rgb(243 244 246)',
              }}
            >
              <div
                class="transition-all duration-300"
                style={{
                  width: dimensions().width,
                  height: dimensions().height,
                  'min-width': viewport() !== 'desktop' ? dimensions().width : undefined,
                }}
              >
                <iframe
                  ref={iframeRef}
                  src={previewUrl()}
                  class="h-full w-full border-0"
                  title={`${props.title} preview`}
                  sandbox="allow-scripts allow-same-origin allow-forms"
                />
              </div>
            </div>
          </Show>
        </div>

        {/* Variant description */}
        <Show when={currentVariant()?.description}>
          <p class="mt-4 text-sm text-gray-600 dark:text-gray-400">
            {currentVariant()?.description}
          </p>
        </Show>
      </section>

      {/* Used Components */}
      <Show when={usedComponentsArray().length > 0}>
        <section id="used-components" class="scroll-mt-20">
          <h2 class="mb-4 text-2xl font-medium">Components Used</h2>
          <div class="flex flex-wrap gap-2">
            <For each={usedComponentsArray()}>
              {(component) => (
                <A
                  href={component.path}
                  class="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-blue-300 hover:bg-blue-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-blue-600 dark:hover:bg-blue-900/20"
                >
                  {component.name}
                  <Show when={component.isPro}>
                    <span class="rounded bg-violet-100 px-1.5 py-0.5 text-xs text-violet-700 dark:bg-violet-900/30 dark:text-violet-400">
                      Pro
                    </span>
                  </Show>
                </A>
              )}
            </For>
          </div>
        </section>
      </Show>

      {/* Related Blocks */}
      <Show when={relatedBlocksArray().length > 0}>
        <section id="related-blocks" class="scroll-mt-20">
          <h2 class="mb-4 text-2xl font-medium">Related Blocks</h2>
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <For each={relatedBlocksArray()}>
              {(block) => (
                <A
                  href={block.path}
                  class="group rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:border-blue-300 hover:bg-blue-50/50 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-blue-600 dark:hover:bg-blue-900/20"
                >
                  <h3 class="font-medium text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                    {block.name}
                  </h3>
                  <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {block.description}
                  </p>
                </A>
              )}
            </For>
          </div>
        </section>
      </Show>

      {props.children}
    </div>
  );
}
