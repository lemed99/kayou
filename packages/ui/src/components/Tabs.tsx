import { For, type JSX, Show, createMemo, createSignal, splitProps } from 'solid-js';

import { twMerge } from 'tailwind-merge';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TabData {
  key: string;
  label: JSX.Element;
  content: JSX.Element | (() => JSX.Element);
  disabled?: boolean;
}

export type TabVariant = 'underline' | 'pills' | 'bordered';
export type TabSize = 'sm' | 'md' | 'lg';

export interface TabsLabels {
  tabList: string;
}

export const DEFAULT_TABS_LABELS: TabsLabels = {
  tabList: 'Tabs',
};

export interface TabsProps extends JSX.HTMLAttributes<HTMLDivElement> {
  tabs: TabData[];
  activeTab?: string;
  onTabChange?: (key: string) => void;
  variant?: TabVariant;
  size?: TabSize;
  lazy?: boolean;
  tabListClass?: string;
  tabClass?: string;
  panelClass?: string;
  labels?: Partial<TabsLabels>;
}

// ---------------------------------------------------------------------------
// Theme
// ---------------------------------------------------------------------------

const theme = {
  root: 'w-full',
  tabList: {
    base: 'flex',
    variant: {
      underline: 'border-b border-neutral-200 dark:border-neutral-700',
      pills: 'gap-1',
      bordered: '',
    },
  },
  tab: {
    base: 'inline-flex items-center justify-center font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 whitespace-nowrap',
    variant: {
      underline: {
        base: 'border-b-2 border-transparent -mb-px',
        active: 'border-blue-600 dark:border-blue-500 text-blue-600 dark:text-white',
        inactive:
          'text-neutral-500 hover:text-neutral-700 hover:border-neutral-300 dark:text-neutral-400 dark:hover:text-neutral-200 dark:hover:border-neutral-600',
      },
      pills: {
        base: 'rounded-lg',
        active: 'bg-blue-600 text-white hover:bg-blue-700',
        inactive:
          'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200',
      },
      bordered: {
        base: 'border-neutral-200 dark:border-neutral-700',
        active: 'border rounded-t-lg border-b-0 text-neutral-900 dark:text-neutral-100',
        inactive:
          'border-b text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200',
      },
    },
    size: {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-5 py-2.5 text-base',
    },
  },
  panel: {
    base: 'py-4 focus-visible:outline-none',
    variant: {
      underline: '',
      pills: '',
      bordered: '',
    },
  },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const Tabs = (props: TabsProps): JSX.Element => {
  const [local, divProps] = splitProps(props, [
    'tabs',
    'activeTab',
    'onTabChange',
    'variant',
    'size',
    'lazy',
    'class',
    'tabListClass',
    'tabClass',
    'panelClass',
    'labels',
  ]);

  const variant = () => local.variant ?? 'underline';
  const size = () => local.size ?? 'md';
  const mergedLabels = createMemo(() => ({
    ...DEFAULT_TABS_LABELS,
    ...local.labels,
  }));

  // ---- Controlled / uncontrolled ----

  const isControlled = createMemo(
    () => local.activeTab !== undefined && local.onTabChange !== undefined,
  );

  const firstEnabledKey = createMemo(() => {
    const tab = local.tabs.find((t) => !t.disabled);
    return tab?.key;
  });

  const [internalActiveTab, setInternalActiveTab] = createSignal<string | undefined>(
    undefined,
  );

  // Ensure internal default is set once
  const activeKey = createMemo(() => {
    if (isControlled()) {
      const key = local.activeTab!;
      const exists = local.tabs.some((t) => t.key === key);
      return exists ? key : firstEnabledKey();
    }
    const internal = internalActiveTab();
    if (internal && local.tabs.some((t) => t.key === internal)) {
      return internal;
    }
    return firstEnabledKey();
  });

  const selectTab = (key: string) => {
    const tab = local.tabs.find((t) => t.key === key);
    if (!tab || tab.disabled) return;
    if (isControlled()) {
      local.onTabChange!(key);
    } else {
      setInternalActiveTab(key);
    }
  };

  // ---- Focus management ----

  const tabRefs = new Map<string, HTMLButtonElement>();

  const enabledTabs = createMemo(() => local.tabs.filter((t) => !t.disabled));

  const findNextEnabled = (currentKey: string, direction: 1 | -1): string | undefined => {
    const enabled = enabledTabs();
    if (enabled.length === 0) return undefined;
    const currentIndex = enabled.findIndex((t) => t.key === currentKey);
    if (currentIndex === -1) return enabled[0]?.key;
    const nextIndex = (currentIndex + direction + enabled.length) % enabled.length;
    return enabled[nextIndex]?.key;
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    const current = activeKey();
    if (!current) return;

    let targetKey: string | undefined;

    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        targetKey = findNextEnabled(current, 1);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        targetKey = findNextEnabled(current, -1);
        break;
      case 'Home':
        e.preventDefault();
        targetKey = enabledTabs()[0]?.key;
        break;
      case 'End':
        e.preventDefault();
        targetKey = enabledTabs()[enabledTabs().length - 1]?.key;
        break;
    }

    if (targetKey) {
      selectTab(targetKey);
      tabRefs.get(targetKey)?.focus();
    }
  };

  // ---- Content resolver ----

  const resolveContent = (content: JSX.Element | (() => JSX.Element)): JSX.Element => {
    return typeof content === 'function' ? (content as () => JSX.Element)() : content;
  };

  // ---- ARIA IDs ----

  const tabId = (key: string) => `tab-${key}`;
  const panelId = (key: string) => `panel-${key}`;

  // ---- Render ----

  return (
    <div {...divProps} class={twMerge(theme.root, local.class)}>
      {/* Tab list */}
      <div
        role="tablist"
        aria-label={mergedLabels().tabList}
        class={twMerge(
          theme.tabList.base,
          theme.tabList.variant[variant()],
          local.tabListClass,
        )}
        onKeyDown={handleKeyDown}
      >
        <For each={local.tabs}>
          {(tab) => {
            const isActive = () => tab.key === activeKey();
            const variantTheme = () => theme.tab.variant[variant()];
            return (
              <button
                ref={(el) => tabRefs.set(tab.key, el)}
                id={tabId(tab.key)}
                role="tab"
                type="button"
                aria-selected={isActive()}
                aria-controls={panelId(tab.key)}
                tabindex={isActive() ? 0 : -1}
                disabled={tab.disabled}
                class={twMerge(
                  theme.tab.base,
                  variantTheme().base,
                  isActive() ? variantTheme().active : variantTheme().inactive,
                  theme.tab.size[size()],
                  local.tabClass,
                )}
                onClick={() => selectTab(tab.key)}
              >
                {tab.label}
              </button>
            );
          }}
        </For>
        <Show when={variant() === 'bordered'}>
          <div
            role="presentation"
            class="flex-1 border-b border-neutral-200 dark:border-neutral-700"
          />
        </Show>
      </div>

      {/* Tab panels */}
      <Show
        when={local.lazy}
        fallback={
          <For each={local.tabs}>
            {(tab) => (
              <div
                id={panelId(tab.key)}
                role="tabpanel"
                aria-labelledby={tabId(tab.key)}
                tabindex="0"
                class={twMerge(
                  theme.panel.base,
                  theme.panel.variant[variant()],
                  local.panelClass,
                )}
                hidden={tab.key !== activeKey()}
              >
                {resolveContent(tab.content)}
              </div>
            )}
          </For>
        }
      >
        {(() => {
          const tab = createMemo(() => local.tabs.find((t) => t.key === activeKey()));
          return (
            <Show when={tab()}>
              {(activeTab) => (
                <div
                  id={panelId(activeTab().key)}
                  role="tabpanel"
                  aria-labelledby={tabId(activeTab().key)}
                  tabindex="0"
                  class={twMerge(
                    theme.panel.base,
                    theme.panel.variant[variant()],
                    local.panelClass,
                  )}
                >
                  {resolveContent(activeTab().content)}
                </div>
              )}
            </Show>
          );
        })()}
      </Show>
    </div>
  );
};

export default Tabs;
