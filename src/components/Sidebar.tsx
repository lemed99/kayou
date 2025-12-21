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

export interface SideBarItems {
  label: JSX.Element;
  icon?: (props: { class: string }) => JSX.Element;
  path?: string;
  class?: string;
  isActive?: boolean;
  id: string;
  onClick?: (event: MouseEvent) => void;
  children?: SideBarItems[] | undefined;
}

export interface SidebarProps extends JSX.HTMLAttributes<HTMLElement> {
  innerClass?: string;
  items?: SideBarItems[];
  isMobile: boolean;
  children?: JSX.Element;
  isSidebarOpen?: boolean;
  setIsSidebarOpen?: Setter<boolean>;
}

export interface SidebarItemProps extends JSX.AnchorHTMLAttributes<HTMLAnchorElement> {
  icon?: (props: { class: string }) => JSX.Element;
  label?: string;
  isActive?: boolean;
  id: string;
  children?: JSX.Element;
  showItemIconOnly?: boolean;
}

export interface SidebarCollapseProps extends JSX.HTMLAttributes<HTMLButtonElement> {
  icon?: (props: { class: string }) => JSX.Element;
  label?: JSX.Element;
  isItemCollapsed?: boolean;
  setIsItemCollapsed?: (state: boolean) => void;
  isActive?: boolean;
  id: string;
  children?: JSX.Element;
  showItemIconOnly?: boolean;
  hoveredItem?: string;
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

const Sidebar = (props: SidebarProps) => {
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

  const isPopoverHidden = (mn: SideBarItems) => {
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
                <div
                  class={twMerge(
                    'text-gray-500',
                    isSidebarOpen() ? 'cursor-w-resize' : 'cursor-e-resize',
                  )}
                  onClick={() => {
                    props.setIsSidebarOpen?.(!isSidebarOpen());
                  }}
                >
                  <LayoutLeftIcon class="size-4.5" />
                </div>
              </Show>
            </div>
          </Show>
          <ul class={sidebarTheme.itemGroup}>
            <For each={items()}>
              {(mn) => (
                <div>
                  <Show when={!mn.children}>
                    <Tooltip
                      hidden={isSidebarOpen()}
                      content={mn.label}
                      placement="right"
                    >
                      <SidebarItem
                        icon={mn.icon}
                        onClick={mn.onClick}
                        class={mn.class}
                        isActive={mn.isActive}
                        id={mn.id}
                        showItemIconOnly={!isSidebarOpen()}
                      >
                        {mn.label}
                      </SidebarItem>
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
                          <div class="space-y-1 px-1.5 py-2">
                            <For each={mn.children}>
                              {(sb) => (
                                <SidebarItem
                                  onClick={sb.onClick}
                                  class={
                                    sb.isActive
                                      ? ''
                                      : 'hover:bg-gray-100/75 dark:hover:bg-gray-700'
                                  }
                                  isActive={sb.isActive}
                                  id={sb.id}
                                >
                                  {sb.label}
                                </SidebarItem>
                              )}
                            </For>
                          </div>
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
                              <SidebarItem
                                onClick={sb.onClick}
                                class={sb.class}
                                isActive={sb.isActive}
                                id={sb.id}
                              >
                                {sb.label}
                              </SidebarItem>
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

const SidebarItem = (props: SidebarItemProps) => {
  const [local, otherProps] = splitProps(props, [
    'children',
    'class',
    'isActive',
    'icon',
    'id',
    'showItemIconOnly',
  ]);

  return (
    <li id={local.id} class="list-none">
      <a
        title={typeof local.children === 'string' ? local.children : undefined}
        class={twMerge(
          local.class,
          sidebarItemTheme.item.base,
          local.isActive ? sidebarItemTheme.item.active : sidebarItemTheme.item.inactive,
        )}
        {...otherProps}
      >
        <Show when={local.isActive && !local.showItemIconOnly}>
          <div class="absolute left-1 mr-0.5 h-5 w-[3px] rounded-full bg-blue-800 dark:bg-blue-300" />
        </Show>
        <Show when={local.icon}>
          {local.icon?.({
            class: twMerge(
              sidebarItemTheme.item.icon.base,
              local.isActive
                ? 'text-blue-800 dark:text-blue-300'
                : 'text-gray-900 dark:text-white',
            ),
          })}
        </Show>
        <span
          id={`sidebar-item-${local.id}`}
          class={twMerge(
            sidebarItemTheme.item.content.base,
            local.showItemIconOnly ? 'ml-0 w-0' : 'ml-3 w-[180px]',
          )}
        >
          {local.children}
        </span>
      </a>
    </li>
  );
};

const SidebarCollapse = (props: SidebarCollapseProps) => {
  const [local, otherProps] = splitProps(props, [
    'children',
    'class',
    'isItemCollapsed',
    'setIsItemCollapsed',
    'id',
    'isActive',
    'icon',
    'label',
    'showItemIconOnly',
    'hoveredItem',
  ]);
  const [collapsedContentElement, setCollapsedContentElement] =
    createSignal<HTMLDivElement>();
  const [collapsedElementHeight, setCollapsedElementHeight] = createSignal(0);

  const { isVisible, isMounted } = createPresence(() => local.isItemCollapsed, {
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
    <li id={`sidebar-collapse-${local.id}`} class="list-none">
      <button
        onClick={() => local.setIsItemCollapsed?.(!local.isItemCollapsed)}
        type="button"
        class={twMerge(
          sidebarCollapseTheme.collapse.button,
          local.isActive && !local.isItemCollapsed
            ? sidebarCollapseTheme.item.active
            : sidebarCollapseTheme.item.inactive,
          local.hoveredItem === local.id ? 'bg-gray-100' : '',
          local.class,
        )}
        {...otherProps}
      >
        <Show when={local.isActive && !local.isItemCollapsed && !local.showItemIconOnly}>
          <div class="absolute left-1 mr-0.5 h-5 w-[3px] rounded-full bg-blue-800 dark:bg-blue-300" />
        </Show>
        <Show when={local.icon}>
          {local.icon?.({
            class: twMerge(
              sidebarCollapseTheme.collapse.icon.base,
              sidebarCollapseTheme.collapse.icon.open[
                local.isItemCollapsed ? 'on' : 'off'
              ],
              local.isActive && !local.isItemCollapsed
                ? 'text-blue-800 dark:text-blue-300'
                : 'text-gray-900 dark:text-white',
            ),
          })}
        </Show>
        <div
          class={twMerge(
            'flex items-center overflow-hidden transition-all duration-100',
            local.showItemIconOnly ? 'ml-0 w-0' : 'ml-3 w-[180px]',
          )}
        >
          <span
            class={twMerge(sidebarCollapseTheme.collapse.label.base, 'min-w-[168px]')}
          >
            {local.label}
          </span>
          <div>
            <ChevronRightIcon
              class={twMerge(
                sidebarCollapseTheme.collapse.label.icon,
                local.isItemCollapsed ? 'rotate-90' : '',
              )}
            />
          </div>
        </div>
      </button>
      <Show when={isMounted()}>
        <ul
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
            {local.children}
          </div>
        </ul>
      </Show>
    </li>
  );
};

export default Sidebar;
