import {
  For,
  JSX,
  Setter,
  Show,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  splitProps,
} from 'solid-js';
import { createStore } from 'solid-js/store';

import { createPresence } from '@solid-primitives/presence';
import { twMerge } from 'tailwind-merge';

import { ChevronRightIcon, LayoutLeftIcon } from '../icons';
import Popover from './Popover';
import Tooltip from './Tooltip';

/**
 * Configuration for a sidebar navigation item.
 */
export interface SidebarItem {
  /** Label text or element for the item. */
  label: JSX.Element;
  /** Optional icon component. */
  icon?: (props: { class: string }) => JSX.Element;
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
}

/**
 * @deprecated Use SidebarItem instead. This alias exists for backwards compatibility.
 */
export type SideBarItems = SidebarItem;

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
    base: 'h-full',
    inner: 'h-full overflow-y-auto overflow-x-hidden p-2 dark:bg-gray-800',
  },
  itemGroup: 'space-y-1 list-none',
};

const sidebarItemTheme = {
  item: {
    active: 'bg-blue-800/10 text-blue-800 dark:bg-gray-700 dark:text-blue-300',
    inactive: 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700',
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
      'mb-1 flex w-full text-sm items-center rounded-md px-2.5 py-2 font-normal transition duration-75 cursor-pointer',
    icon: {
      base: 'size-5 transition duration-75 flex shrink-0',
      open: {
        off: '',
        on: 'text-gray-900',
      },
    },
    label: {
      base: 'flex-1 whitespace-nowrap overflow-hidden text-left',
      icon: 'transition duration-200 size-3',
    },
    list: 'list-none',
  },
  item: {
    active: 'bg-blue-800/10 text-blue-800 dark:bg-gray-700 dark:text-blue-300',
    inactive: 'text-gray-900 dark:text-white',
    collapsed: {
      insideCollapse: 'w-full pl-5',
    },
  },
};

/**
 * Sidebar navigation component with collapsible sections.
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
  ]);

  const items = createMemo(() => local.items ?? []);

  const isPopoverHidden = (mn: SidebarItem) => {
    return local.isMobile ? true : !!isItemCollapsed?.[mn.id];
  };

  const isSidebarOpen = () => props.isSidebarOpen ?? true;

  return (
    <aside
      aria-label="sidebar"
      class={twMerge(sidebarTheme.root.base, local.class)}
      {...otherProps}
    >
      <div class={twMerge(sidebarTheme.root.inner, local.innerClass)}>
        <div>
          <Show when={local.children}>
            <div class="mb-2 flex h-12 items-center justify-between px-2.5">
              <Show when={isSidebarOpen()}>{local.children}</Show>
              <Show when={props.setIsSidebarOpen}>
                <button
                  type="button"
                  aria-label={isSidebarOpen() ? 'Collapse sidebar' : 'Expand sidebar'}
                  aria-expanded={isSidebarOpen()}
                  class={twMerge(isSidebarOpen() ? 'cursor-w-resize' : 'cursor-e-resize')}
                  onClick={() => {
                    props.setIsSidebarOpen?.(!isSidebarOpen());
                  }}
                >
                  <LayoutLeftIcon class="size-4.5" />
                </button>
              </Show>
            </div>
          </Show>
          <ul class={sidebarTheme.itemGroup} role="menu">
            <For each={items()}>
              {(mn) => (
                <div>
                  <Show when={!mn.children}>
                    <Tooltip
                      hidden={isSidebarOpen()}
                      content={mn.label}
                      placement="right"
                    >
                      <SidebarItemComponent
                        icon={mn.icon}
                        onClick={mn.onClick}
                        href={mn.path}
                        class={mn.class}
                        isActive={mn.isActive}
                        id={mn.id}
                        showItemIconOnly={!isSidebarOpen()}
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
                            <div class="rounded-t border-b border-gray-200 bg-gray-50 py-2.5 pr-2.5 pl-7 text-xs font-semibold">
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
                                      : 'hover:bg-gray-100/75 dark:hover:bg-gray-700'
                                  }
                                  isActive={sb.isActive}
                                  id={sb.id}
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
              )}
            </For>
          </ul>
        </div>
      </div>
    </aside>
  );
};

const SidebarItemComponent = (props: SidebarItemProps) => {
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
        )}
      >
        {props.children}
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
    <li id={props.id} class="list-none" role="none">
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
          props.hoveredItem === props.id ? 'bg-gray-100' : '',
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
            class={twMerge(sidebarCollapseTheme.collapse.label.base, 'min-w-[168px]')}
          >
            {props.label}
          </span>
          <div>
            <ChevronRightIcon
              aria-hidden="true"
              class={twMerge(
                sidebarCollapseTheme.collapse.label.icon,
                props.isItemCollapsed ? 'rotate-90' : '',
              )}
            />
          </div>
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
