import {
  For,
  type JSX,
  Show,
  createMemo,
  createSignal,
  createUniqueId,
  splitProps,
} from 'solid-js';

import { twMerge } from 'tailwind-merge';

/**
 * Data structure for a single tab.
 */
export interface TabData {
  /** Unique identifier for the tab. */
  key: string;
  /** Content displayed in the tab button. */
  label: JSX.Element;
  /** Panel content. Use a function for lazy evaluation. */
  content: JSX.Element | (() => JSX.Element);
  /** Whether the tab is disabled. */
  disabled?: boolean;
}

export type TabVariant = 'underline' | 'pills' | 'bordered';
export type TabSize = 'sm' | 'md' | 'lg';

/**
 * Accessibility labels for the Tabs component.
 */
export interface TabsAriaLabels {
  /** aria-label for the tablist element. */
  tabList: string;
}

/** @deprecated Use `TabsAriaLabels` instead. */
export type TabsLabels = TabsAriaLabels;

export const DEFAULT_TABS_ARIA_LABELS: TabsAriaLabels = {
  tabList: 'Tabs',
};

/** @deprecated Use `DEFAULT_TABS_ARIA_LABELS` instead. */
export const DEFAULT_TABS_LABELS = DEFAULT_TABS_ARIA_LABELS;

/**
 * Props for the Tabs component.
 */
export interface TabsProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /** Array of tab objects with key, label, content, and optional disabled flag. */
  tabs: TabData[];
  /** Controlled: currently active tab key. */
  activeTab?: string;
  /** Callback when active tab changes. Works in both controlled and uncontrolled modes. */
  onTabChange?: (key: string) => void;
  /** Visual style variant. @default 'underline' */
  variant?: TabVariant;
  /** Size of tab buttons. @default 'md' */
  size?: TabSize;
  /** When true, only the active panel is rendered in the DOM. @default false */
  lazy?: boolean;
  /** Custom CSS class for the tab list container. */
  tabListClass?: string;
  /** Custom CSS class applied to each tab button. */
  tabClass?: string;
  /** Custom CSS class applied to each tab panel. */
  panelClass?: string;
  /** Accessibility labels for the component. */
  ariaLabels?: Partial<TabsAriaLabels>;
  /** @deprecated Use `ariaLabels` instead. */
  labels?: Partial<TabsAriaLabels>;
}

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
    base: 'inline-flex items-center justify-center font-medium transition-colors cursor-pointer aria-disabled:opacity-50 aria-disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 whitespace-nowrap',
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
  },
};

/**
 * Accessible tabbed interface with WAI-ARIA compliance, keyboard navigation,
 * and multiple visual variants.
 *
 * @example
 * ```tsx
 * <Tabs
 *   tabs={[
 *     { key: 'general', label: 'General', content: <p>General content</p> },
 *     { key: 'settings', label: 'Settings', content: <p>Settings content</p> },
 *   ]}
 * />
 * ```
 */
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
    'ariaLabels',
    'labels',
  ]);

  const instanceId = createUniqueId();
  const variant = createMemo(() => local.variant ?? 'underline');
  const size = createMemo(() => local.size ?? 'md');
  const mergedAriaLabels = createMemo(() => ({
    ...DEFAULT_TABS_ARIA_LABELS,
    ...local.labels,
    ...local.ariaLabels,
  }));

  const isControlled = createMemo(() => local.activeTab !== undefined);

  const firstEnabledKey = createMemo(() => {
    const tab = local.tabs.find((t) => !t.disabled);
    return tab?.key;
  });

  const [internalActiveTab, setInternalActiveTab] = createSignal<string | undefined>(
    undefined,
  );

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
    if (!isControlled()) {
      setInternalActiveTab(key);
    }
    local.onTabChange?.(key);
  };

  const tabRefs = new Map<string, HTMLButtonElement>();

  const enabledTabs = createMemo(() => local.tabs.filter((t) => !t.disabled));

  const focusedKey = createMemo(() => {
    const current = activeKey();
    if (current && enabledTabs().some((t) => t.key === current)) return current;
    return firstEnabledKey();
  });

  const findNextEnabled = (currentKey: string, direction: 1 | -1): string | undefined => {
    const enabled = enabledTabs();
    if (enabled.length === 0) return undefined;
    const currentIndex = enabled.findIndex((t) => t.key === currentKey);
    if (currentIndex === -1) return enabled[0]?.key;
    const nextIndex = (currentIndex + direction + enabled.length) % enabled.length;
    return enabled[nextIndex]?.key;
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    const current = focusedKey();
    if (!current) return;

    let targetKey: string | undefined;

    switch (e.key) {
      case 'ArrowRight': {
        e.preventDefault();
        targetKey = findNextEnabled(current, 1);
        break;
      }
      case 'ArrowLeft': {
        e.preventDefault();
        targetKey = findNextEnabled(current, -1);
        break;
      }
      case 'Home': {
        e.preventDefault();
        const enabled = enabledTabs();
        targetKey = enabled[0]?.key;
        break;
      }
      case 'End': {
        e.preventDefault();
        const enabled = enabledTabs();
        targetKey = enabled[enabled.length - 1]?.key;
        break;
      }
    }

    if (targetKey) {
      selectTab(targetKey);
      tabRefs.get(targetKey)?.focus();
    }
  };

  const resolveContent = (content: JSX.Element | (() => JSX.Element)): JSX.Element => {
    return typeof content === 'function' ? content() : content;
  };

  const tabId = (key: string) => `${instanceId}-tab-${key}`;
  const panelId = (key: string) => `${instanceId}-panel-${key}`;

  return (
    <div {...divProps} class={twMerge(theme.root, local.class)}>
      <div
        role="tablist"
        aria-label={mergedAriaLabels().tabList}
        aria-orientation="horizontal"
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
                aria-disabled={tab.disabled || undefined}
                tabindex={isActive() ? 0 : -1}
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

      <Show
        when={local.lazy}
        fallback={
          <For each={local.tabs}>
            {(tab) => {
              const isActive = () => tab.key === activeKey();
              return (
                <div
                  id={panelId(tab.key)}
                  role="tabpanel"
                  aria-labelledby={tabId(tab.key)}
                  tabindex={isActive() ? 0 : undefined}
                  class={twMerge(theme.panel.base, local.panelClass)}
                  hidden={!isActive()}
                >
                  <Show when={isActive()} fallback={null}>
                    {resolveContent(tab.content)}
                  </Show>
                </div>
              );
            }}
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
                  tabindex={0}
                  class={twMerge(theme.panel.base, local.panelClass)}
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
