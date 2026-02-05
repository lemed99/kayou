import {
  For,
  JSX,
  Setter,
  Show,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  onMount,
  splitProps,
} from 'solid-js';
import { createStore } from 'solid-js/store';

import {
  ChevronRightIcon,
  type IconProps,
  LayoutLeftIcon,
  Pin02Icon,
} from '@kayou/icons';
import { createPresence } from '@solid-primitives/presence';
import { twMerge } from 'tailwind-merge';

import Popover from './Popover';
import Tooltip from './Tooltip';

export interface SidebarLabels {
  pinned: string;
  unpin: string;
  pin: string;
}

export const DEFAULT_SIDEBAR_LABELS: SidebarLabels = {
  pinned: 'Pinned',
  unpin: 'Unpin',
  pin: 'Pin',
};

export interface SidebarAriaLabels {
  collapse: string;
  expand: string;
  sidebar: string;
}

export const DEFAULT_SIDEBAR_ARIA_LABELS: SidebarAriaLabels = {
  collapse: 'Collapse sidebar',
  expand: 'Expand sidebar',
  sidebar: 'Sidebar',
};

/**
 * Configuration for a sidebar navigation item.
 */
export interface SidebarItem {
  /** Label text or element for the item. */
  label: JSX.Element;
  /** Optional icon component. */
  icon?: (props: IconProps) => JSX.Element;
  /** Navigation path/URL. */
  path?: string;
  /** Additional CSS classes. */
  class?: string;
  /** Whether this item is currently active. */
  isActive?: boolean;
  /** Unique identifier for the item. */
  id: string;
  /** Click handler for the item. */
  onClick?: (event: MouseEvent) => void;
  /** Nested child items for collapsible sections. */
  children?: SidebarItem[] | undefined;
  /** Optional notification badge (number or string like "+8"). Only applies to items without children. */
  badge?: string | number;
  /** Whether this item can be pinned (only applies to items without children). */
  pinnable?: boolean;
}

/**
 * Configuration for a sidebar menu group (used in footer).
 */
export interface SidebarMenuGroup {
  /** Optional title for the group. */
  title?: string;
  /** Array of menu items in this group. */
  items: SidebarItem[];
}

/**
 * Props for the Sidebar component.
 */
export interface SidebarProps extends JSX.HTMLAttributes<HTMLElement> {
  /** Additional CSS classes for the inner container. */
  innerClass?: string;
  /** Array of navigation items. */
  items?: SidebarItem[];
  /** Whether the sidebar is in mobile mode. */
  isMobile: boolean;
  /** Content to render in the sidebar header. */
  children?: JSX.Element;
  /** Whether the sidebar is expanded. */
  isSidebarOpen?: boolean;
  /** Setter function for sidebar open state. */
  setIsSidebarOpen?: Setter<boolean>;
  /** Custom content to render in the header section (below logo, above header menu items). */
  headerContent?: JSX.Element;
  /** Menu items to render in the header section (above pinned items). */
  headerItems?: SidebarItem[];
  /** Custom content to render above the footer menu (e.g., promotional cards). */
  footerContent?: JSX.Element;
  /** Menu items to render in the footer section. */
  footerItems?: SidebarItem[];
  /** Array of pinned item IDs (controlled mode). */
  pinnedItems?: string[];
  /** Callback when pinned items change. */
  onPinnedChange?: (pinnedIds: string[]) => void;
  /** Label for the pinned section. */
  pinnedLabel?: string;
  /** Icon for the pinned section. Defaults to Pin02Icon. */
  pinnedIcon?: (props: IconProps) => JSX.Element;
  /** LocalStorage key for persisting pinned items. When provided, pinned items are saved to and loaded from localStorage. */
  pinnedStorageKey?: string;
  /**
   * Labels for i18n support (visible text).
   */
  labels?: Partial<SidebarLabels>;
  /**
   * Aria labels for i18n support (screen reader text).
   */
  ariaLabels?: Partial<SidebarAriaLabels>;
}

export interface SidebarItemProps {
  /** Optional icon component. */
  icon?: (props: { class: string }) => JSX.Element;
  /** Accessible label for the item. */
  label?: string;
  /** Whether this item is currently active. */
  isActive?: boolean;
  /** Unique identifier for the item. */
  id: string;
  /** Content to render inside the item. */
  children?: JSX.Element;
  /** Whether to show only the icon (collapsed state). */
  showItemIconOnly?: boolean;
  /** Navigation URL - renders as link when provided. */
  href?: string;
  /** Click handler. */
  onClick?: (event: MouseEvent) => void;
  /** Additional CSS classes. */
  class?: string;
  /** Optional notification badge (number or string like "+8"). */
  badge?: string | number;
  /** Whether this item can be pinned. */
  pinnable?: boolean;
  /** Whether this item is currently pinned. */
  isPinned?: boolean;
  /** Callback to toggle pin state. */
  onPinToggle?: () => void;
  /** Label for unpin action. */
  unpinLabel?: string;
  /** Label for pin action. */
  pinLabel?: string;
}

export interface SidebarCollapseProps {
  /** Optional icon component. */
  icon?: (props: { class: string }) => JSX.Element;
  /** Label content for the collapse button. */
  label?: JSX.Element;
  /** Whether the collapse section is expanded. */
  isItemCollapsed?: boolean;
  /** Callback to toggle the collapsed state. */
  setIsItemCollapsed?: (state: boolean) => void;
  /** Whether this item is currently active. */
  isActive?: boolean;
  /** Unique identifier for the collapse section. */
  id: string;
  /** Child items to render when expanded. */
  children?: JSX.Element;
  /** Whether to show only the icon (collapsed sidebar state). */
  showItemIconOnly?: boolean;
  /** ID of the currently hovered item. */
  hoveredItem?: string;
  /** Additional CSS classes. */
  class?: string;
}

const sidebarTheme = {
  root: {
    base: 'h-full max-w-[248px]',
    inner: 'h-full overflow-hidden p-2 dark:bg-neutral-900',
  },
  itemGroup: 'space-y-1 list-none',
};

const sidebarItemTheme = {
  item: {
    active: 'bg-blue-800/10 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    inactive: 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-neutral-800',
    base: 'cursor-pointer text-sm flex items-center justify-center rounded-md px-2.5 py-2 font-normal relative',
    collapsed: {
      noIcon: 'font-bold',
    },
    content: {
      base: 'flex-1 ml-3 whitespace-nowrap overflow-hidden transition-all duration-100',
    },
    icon: {
      base: 'size-5 flex-shrink-0 transition duration-75',
    },
  },
};

const sidebarCollapseTheme = {
  collapse: {
    button:
      'flex w-full text-sm items-center rounded-md px-2.5 py-2 font-normal transition duration-75 cursor-pointer',
    icon: {
      base: 'size-5 transition duration-75 flex shrink-0',
      open: {
        off: '',
        on: 'text-gray-900 dark:text-white',
      },
    },
    label: {
      base: 'flex-1 whitespace-nowrap overflow-hidden text-left',
      icon: 'transition duration-200 size-3',
    },
    list: 'list-none mt-1',
  },
  item: {
    active: 'bg-blue-800/10 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    inactive: 'text-gray-900 dark:text-white',
    collapsed: {
      insideCollapse: 'w-full pl-5',
    },
  },
};

/**
 * Sidebar navigation component with collapsible sections, pinning, and footer support.
 */
const Sidebar = (props: SidebarProps): JSX.Element => {
  const [isItemCollapsed, setIsItemCollapsed] = createStore<Record<string, boolean>>({});
  const [hoveredItem, setHoveredItem] = createSignal('');
  const [local, otherProps] = splitProps(props, [
    'children',
    'class',
    'innerClass',
    'isMobile',
    'items',
    'headerContent',
    'headerItems',
    'footerContent',
    'footerItems',
    'pinnedItems',
    'onPinnedChange',
    'pinnedLabel',
    'pinnedIcon',
    'pinnedStorageKey',
    'labels',
    'ariaLabels',
  ]);
  const l = createMemo(() => ({ ...DEFAULT_SIDEBAR_LABELS, ...local.labels }));
  const a = createMemo(() => ({ ...DEFAULT_SIDEBAR_ARIA_LABELS, ...local.ariaLabels }));

  const [internalPinnedItems, setInternalPinnedItems] = createSignal<string[]>([]);

  // Load pinned items from localStorage after mount to avoid hydration mismatch
  onMount(() => {
    if (local.pinnedStorageKey) {
      try {
        const stored = localStorage.getItem(local.pinnedStorageKey);
        if (stored) {
          const parsed = JSON.parse(stored) as string[];
          if (Array.isArray(parsed)) {
            setInternalPinnedItems(parsed);
          }
        }
      } catch {
        // Ignore localStorage errors
      }
    }
  });

  const items = createMemo(() => local.items ?? []);
  const headerItems = createMemo(() => local.headerItems ?? []);
  const footerItems = createMemo(() => local.footerItems ?? []);

  // Controlled vs uncontrolled pinned state
  const isPinnedControlled = createMemo(
    () => local.pinnedItems !== undefined && local.onPinnedChange !== undefined,
  );

  const pinnedIds = createMemo(() =>
    isPinnedControlled() ? (local.pinnedItems ?? []) : internalPinnedItems(),
  );

  // Save pinned items to localStorage when they change (uncontrolled mode)
  createEffect(() => {
    const storageKey = local.pinnedStorageKey;
    if (storageKey && !isPinnedControlled() && typeof window !== 'undefined') {
      const pinned = internalPinnedItems();
      try {
        localStorage.setItem(storageKey, JSON.stringify(pinned));
      } catch {
        // Ignore localStorage errors (e.g., quota exceeded)
      }
    }
  });

  const togglePin = (itemId: string) => {
    const currentPinned = pinnedIds();
    const isPinned = currentPinned.includes(itemId);
    const newPinned = isPinned
      ? currentPinned.filter((id) => id !== itemId)
      : [...currentPinned, itemId];

    if (isPinnedControlled()) {
      local.onPinnedChange?.(newPinned);
    } else {
      setInternalPinnedItems(newPinned);
    }
  };

  const isItemPinned = (itemId: string) => pinnedIds().includes(itemId);

  // Get pinned items (leaf items without children, including submenu items)
  const pinnedItemsData = createMemo(() => {
    const pinned = pinnedIds();
    if (pinned.length === 0) return [];

    const result: SidebarItem[] = [];

    // Helper to collect all pinnable items
    const collectPinnedItems = (itemList: SidebarItem[]) => {
      for (const item of itemList) {
        // Only items without children can be pinned
        if (!item.children && item.pinnable && pinned.includes(item.id)) {
          result.push(item);
        }
        // Check children (submenu items)
        if (item.children) {
          for (const child of item.children) {
            if (child.pinnable && pinned.includes(child.id)) {
              result.push(child);
            }
          }
        }
      }
    };

    collectPinnedItems(items());
    return result;
  });

  const isPopoverHidden = (mn: SidebarItem) => {
    return local.isMobile ? true : !!isItemCollapsed?.[mn.id];
  };

  const isSidebarOpen = () => props.isSidebarOpen ?? true;

  // Render a menu item (used in main menu, pinned section, and footer)
  const renderMenuItem = (
    mn: SidebarItem,
    options?: { showPinButton?: boolean; hideIcon?: boolean },
  ) => (
    <div>
      <Show when={!mn.children}>
        <Tooltip hidden={isSidebarOpen()} content={mn.label} placement="right">
          <SidebarItemComponent
            icon={options?.hideIcon ? undefined : mn.icon}
            onClick={mn.onClick}
            href={mn.path}
            class={mn.class}
            isActive={mn.isActive}
            id={mn.id}
            showItemIconOnly={!isSidebarOpen()}
            badge={mn.badge}
            pinnable={options?.showPinButton && mn.pinnable}
            isPinned={isItemPinned(mn.id)}
            onPinToggle={() => togglePin(mn.id)}
            unpinLabel={l().unpin}
            pinLabel={l().pin}
          >
            {mn.label}
          </SidebarItemComponent>
        </Tooltip>
      </Show>
      <Show when={mn.children}>
        <Popover
          position="right-start"
          onHover={true}
          offset={0}
          floatingClass="pl-1"
          hidden={isSidebarOpen() ? isPopoverHidden(mn) : false}
          content={
            <div class="min-w-[180px]">
              <Show when={!isSidebarOpen()}>
                <div class="rounded-t border-b border-gray-200 bg-gray-50 py-2.5 pl-7 pr-2.5 text-xs font-semibold dark:border-neutral-800 dark:bg-neutral-800 dark:text-white">
                  {mn.label}
                </div>
              </Show>
              <ul class="list-none space-y-1 px-1.5 py-2" role="menu">
                <For each={mn.children}>
                  {(sb) => (
                    <SidebarItemComponent
                      onClick={sb.onClick}
                      href={sb.path}
                      class={
                        sb.isActive
                          ? ''
                          : 'hover:bg-gray-100/75 dark:hover:bg-neutral-800'
                      }
                      isActive={sb.isActive}
                      id={sb.id}
                      badge={sb.badge}
                      pinnable={options?.showPinButton && sb.pinnable}
                      isPinned={isItemPinned(sb.id)}
                      onPinToggle={() => togglePin(sb.id)}
                      unpinLabel={l().unpin}
                      pinLabel={l().pin}
                    >
                      {sb.label}
                    </SidebarItemComponent>
                  )}
                </For>
              </ul>
            </div>
          }
          onMouseEnter={() => setHoveredItem(mn.id)}
          onMouseLeave={() => setHoveredItem('')}
        >
          <SidebarCollapse
            icon={mn.icon}
            label={mn.label}
            isItemCollapsed={!!isItemCollapsed?.[mn.id]}
            setIsItemCollapsed={(el) =>
              isSidebarOpen() ? setIsItemCollapsed(mn.id, el) : void 0
            }
            id={mn.id}
            isActive={mn.isActive}
            showItemIconOnly={!isSidebarOpen()}
            hoveredItem={hoveredItem()}
          >
            <Show when={isSidebarOpen()}>
              <For each={mn.children}>
                {(sb) => (
                  <SidebarItemComponent
                    onClick={sb.onClick}
                    href={sb.path}
                    class={sb.class}
                    isActive={sb.isActive}
                    id={sb.id}
                    badge={sb.badge}
                    pinnable={options?.showPinButton && sb.pinnable}
                    isPinned={isItemPinned(sb.id)}
                    onPinToggle={() => togglePin(sb.id)}
                  >
                    {sb.label}
                  </SidebarItemComponent>
                )}
              </For>
            </Show>
          </SidebarCollapse>
        </Popover>
      </Show>
    </div>
  );

  // Check if header section should be shown
  // Note: We use 'prop' in props to avoid evaluating JSX props during SSR which causes hydration issues
  const hasHeaderSection = () =>
    'children' in props ||
    'headerContent' in props ||
    headerItems().length > 0 ||
    pinnedItemsData().length > 0;

  return (
    <aside
      aria-label={a().sidebar}
      class={twMerge(sidebarTheme.root.base, local.class)}
      {...otherProps}
    >
      <div class={twMerge(sidebarTheme.root.inner, 'flex flex-col', local.innerClass)}>
        {/* Header section */}
        <Show when={hasHeaderSection()}>
          <div class="shrink-0">
            {/* Logo and toggle button */}
            <Show when={'children' in props}>
              <div class="mb-2 flex h-12 items-center justify-between px-2.5">
                <div class={isSidebarOpen() ? '' : 'hidden'}>{local.children}</div>
                <Show when={props.setIsSidebarOpen}>
                  <button
                    type="button"
                    aria-label={isSidebarOpen() ? a().collapse : a().expand}
                    aria-expanded={isSidebarOpen()}
                    class={twMerge(
                      isSidebarOpen() ? 'cursor-w-resize' : 'cursor-e-resize',
                    )}
                    onClick={() => {
                      props.setIsSidebarOpen?.(!isSidebarOpen());
                    }}
                  >
                    <LayoutLeftIcon class="size-4.5" />
                  </button>
                </Show>
              </div>
            </Show>

            {/* Custom header content */}
            <Show when={'headerContent' in props && isSidebarOpen()}>
              <div class="px-2 pb-2">{local.headerContent}</div>
            </Show>

            {/* Header menu items */}
            <Show when={headerItems().length > 0}>
              <ul class={sidebarTheme.itemGroup} role="menu">
                <For each={headerItems()}>{(mn) => renderMenuItem(mn)}</For>
              </ul>
            </Show>

            {/* Pinned section */}
            <Show when={pinnedItemsData().length > 0}>
              <ul class={sidebarTheme.itemGroup} role="menu">
                {renderMenuItem(
                  {
                    id: '__pinned__',
                    label: local.pinnedLabel ?? l().pinned,
                    icon: local.pinnedIcon ?? Pin02Icon,
                    children: pinnedItemsData(),
                  },
                  { showPinButton: true },
                )}
              </ul>
            </Show>

            {/* Border separator between header and body */}
            <Show when={headerItems().length > 0 || pinnedItemsData().length > 0}>
              <div class="mt-2 border-b border-gray-200 dark:border-neutral-800" />
            </Show>
          </div>
        </Show>

        {/* Body section - scrollable main menu */}
        <div class="flex-1 overflow-y-auto overflow-x-hidden pt-2">
          <ul class={sidebarTheme.itemGroup} role="menu">
            <For each={items()}>
              {(mn) => renderMenuItem(mn, { showPinButton: true })}
            </For>
          </ul>
        </div>

        {/* Footer section */}
        <Show when={'footerContent' in props || footerItems().length > 0}>
          <div class="mt-auto shrink-0">
            {/* Custom footer content (e.g., promo cards) */}
            <Show when={'footerContent' in props && isSidebarOpen()}>
              <div class="p-2">{local.footerContent}</div>
            </Show>

            {/* Footer menu items */}
            <Show when={footerItems().length > 0}>
              <div class="pt-2">
                <ul class={sidebarTheme.itemGroup} role="menu">
                  <For each={footerItems()}>{(mn) => renderMenuItem(mn)}</For>
                </ul>
              </div>
            </Show>
          </div>
        </Show>
      </div>
    </aside>
  );
};

const SidebarItemComponent = (props: SidebarItemProps) => {
  const [showPinIcon, setShowPinIcon] = createSignal(false);
  const [mounted, setMounted] = createSignal(false);
  let hoverTimeoutId: ReturnType<typeof setTimeout> | undefined;

  onMount(() => setMounted(true));

  const handleMouseEnter = () => {
    // Show pin icon after 1 second delay
    hoverTimeoutId = setTimeout(() => {
      setShowPinIcon(true);
    }, 600);
  };

  const handleMouseLeave = () => {
    // Clear the timeout and hide pin icon
    if (hoverTimeoutId) {
      clearTimeout(hoverTimeoutId);
      hoverTimeoutId = undefined;
    }
    setShowPinIcon(false);
  };

  onCleanup(() => {
    if (hoverTimeoutId) {
      clearTimeout(hoverTimeoutId);
    }
  });

  const handlePinClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    props.onPinToggle?.();
  };

  const itemContent = () => (
    <>
      <Show when={props.isActive && !props.showItemIconOnly}>
        <div class="absolute left-1 mr-0.5 h-5 w-[3px] rounded-full bg-blue-800 dark:bg-blue-300" />
      </Show>
      <Show when={props.icon}>
        {props.icon?.({
          class: twMerge(
            sidebarItemTheme.item.icon.base,
            props.isActive
              ? 'text-blue-800 dark:text-blue-300'
              : 'text-gray-900 dark:text-white',
          ),
        })}
      </Show>
      <span
        id={`sidebar-item-${props.id}`}
        class={twMerge(
          sidebarItemTheme.item.content.base,
          props.showItemIconOnly ? 'ml-0 w-0' : 'ml-3 w-[180px]',
          'flex items-center justify-between',
        )}
      >
        <span class="truncate">{props.children}</span>
        <span class="flex shrink-0 items-center gap-1">
          <Show
            when={props.badge !== undefined && !props.showItemIconOnly && !showPinIcon()}
          >
            <span class="inline-flex items-center justify-center rounded-md bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
              {props.badge}
            </span>
          </Show>
          {/* Pin button - shown after 1s hover delay, only client-side to avoid hydration mismatch */}
          <Show
            when={mounted() && props.pinnable && !props.showItemIconOnly && showPinIcon()}
          >
            <Tooltip
              content={
                props.isPinned ? (props.unpinLabel ?? 'Unpin') : (props.pinLabel ?? 'Pin')
              }
              placement="right"
            >
              <div
                tabIndex={0}
                onClick={handlePinClick}
                class={twMerge(
                  'cursor-pointer',
                  props.isPinned
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-400 dark:text-neutral-500',
                )}
                aria-label={
                  props.isPinned
                    ? (props.unpinLabel ?? 'Unpin')
                    : (props.pinLabel ?? 'Pin')
                }
              >
                <Pin02Icon class={twMerge('size-4')} />
              </div>
            </Tooltip>
          </Show>
        </span>
      </span>
    </>
  );

  const commonClass = () =>
    twMerge(
      props.class,
      sidebarItemTheme.item.base,
      props.isActive ? sidebarItemTheme.item.active : sidebarItemTheme.item.inactive,
    );

  const title = () => (typeof props.children === 'string' ? props.children : undefined);

  return (
    <li
      id={props.id}
      class="list-none"
      role="none"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Show
        when={props.href}
        fallback={
          <button
            type="button"
            title={title()}
            class={twMerge(commonClass(), 'w-full text-left')}
            onClick={(e) => props.onClick?.(e)}
            role="menuitem"
          >
            {itemContent()}
          </button>
        }
      >
        <a
          href={props.href}
          title={title()}
          class={commonClass()}
          onClick={(e) => props.onClick?.(e)}
          role="menuitem"
        >
          {itemContent()}
        </a>
      </Show>
    </li>
  );
};

const SidebarCollapse = (props: SidebarCollapseProps) => {
  const [collapsedContentElement, setCollapsedContentElement] =
    createSignal<HTMLDivElement>();
  const [collapsedElementHeight, setCollapsedElementHeight] = createSignal(0);

  const collapseListId = () => `sidebar-collapse-list-${props.id}`;

  const { isVisible, isMounted } = createPresence(() => props.isItemCollapsed, {
    transitionDuration: 200,
  });

  createEffect(() => {
    if (collapsedContentElement()) {
      requestAnimationFrame(() => {
        setCollapsedElementHeight(collapsedContentElement()?.offsetHeight || 0);
      });

      const resizeObserver = new ResizeObserver(() => {
        requestAnimationFrame(() =>
          setCollapsedElementHeight(collapsedContentElement()?.offsetHeight || 0),
        );
      });
      resizeObserver.observe(collapsedContentElement() as Element);

      onCleanup(() => resizeObserver?.disconnect());
    }
  });

  return (
    <li id={`sidebar-collapse-${props.id}`} class="list-none" role="none">
      <button
        onClick={() => props.setIsItemCollapsed?.(!props.isItemCollapsed)}
        type="button"
        aria-expanded={props.isItemCollapsed}
        aria-controls={collapseListId()}
        class={twMerge(
          sidebarCollapseTheme.collapse.button,
          props.isActive && !props.isItemCollapsed
            ? sidebarCollapseTheme.item.active
            : sidebarCollapseTheme.item.inactive,
          props.hoveredItem === props.id ? 'bg-gray-100 dark:bg-neutral-800' : '',
          props.class,
        )}
      >
        <Show when={props.isActive && !props.isItemCollapsed && !props.showItemIconOnly}>
          <div class="absolute left-1 mr-0.5 h-5 w-[3px] rounded-full bg-blue-800 dark:bg-blue-300" />
        </Show>
        <Show when={props.icon}>
          {props.icon?.({
            class: twMerge(
              sidebarCollapseTheme.collapse.icon.base,
              sidebarCollapseTheme.collapse.icon.open[
                props.isItemCollapsed ? 'on' : 'off'
              ],
              props.isActive && !props.isItemCollapsed
                ? 'text-blue-800 dark:text-blue-300'
                : 'text-gray-900 dark:text-white',
            ),
          })}
        </Show>
        <div
          class={twMerge(
            'flex items-center overflow-hidden transition-all duration-100',
            props.showItemIconOnly ? 'ml-0 w-0' : 'ml-3 w-[180px]',
          )}
        >
          <span
            class={twMerge(
              sidebarCollapseTheme.collapse.label.base,
              'flex min-w-[168px] items-center justify-between',
            )}
          >
            <span class="truncate">{props.label}</span>
          </span>
          <ChevronRightIcon
            aria-hidden="true"
            class={twMerge(
              sidebarCollapseTheme.collapse.label.icon,
              props.isItemCollapsed ? 'rotate-90' : '',
            )}
          />
        </div>
      </button>
      <Show when={isMounted()}>
        <ul
          id={collapseListId()}
          role="menu"
          class={twMerge(
            sidebarCollapseTheme.collapse.list,
            sidebarCollapseTheme.item.collapsed.insideCollapse,
            'overflow-hidden',
          )}
          style={{
            height: isVisible() ? `${collapsedElementHeight()}px` : 0,
            transition: 'height .2s ease-in-out',
          }}
        >
          <div ref={setCollapsedContentElement} class="space-y-1">
            {props.children}
          </div>
        </ul>
      </Show>
    </li>
  );
};

export default Sidebar;
