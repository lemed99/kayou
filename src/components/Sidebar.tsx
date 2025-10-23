import { For, JSX, Show, createMemo, splitProps } from 'solid-js';
import { createStore } from 'solid-js/store';

import { twMerge } from 'tailwind-merge';

import { ChevronRightIcon } from '../icons';
import Popover from './Popover';

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
}

export interface SidebarItemProps extends JSX.AnchorHTMLAttributes<HTMLAnchorElement> {
  icon?: (props: { class: string }) => JSX.Element;
  label?: string;
  isActive?: boolean;
  id: string;
  children?: JSX.Element;
}

export interface SidebarCollapseProps extends JSX.HTMLAttributes<HTMLButtonElement> {
  icon?: (props: { class: string }) => JSX.Element;
  label?: JSX.Element;
  isItemCollapsed?: boolean;
  setIsItemCollapsed?: (state: boolean) => void;
  isActive?: boolean;
  id: string;
  children?: JSX.Element;
}

const sidebarTheme = {
  root: {
    base: 'h-full',
    collapsed: {
      on: 'w-56',
    },
    inner:
      'h-full overflow-y-auto overflow-x-hidden bg-blue-800/[.01] py-4 px-2 dark:bg-gray-800 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-500 dark:scrollbar-track-gray-800',
  },
  itemGroup:
    'mt-4 border-t border-gray-200 pt-4 first:mt-0 first:border-t-0 first:pt-0 dark:border-gray-700',
};

const sidebarItemTheme = {
  item: {
    active: 'bg-blue-800/10 text-blue-800 dark:bg-gray-700 dark:text-blue-300',
    inactive: 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700',
    base: 'cursor-pointer text-sm flex mb-1 items-center justify-center rounded-md px-2.5 py-2 font-normal relative',
    collapsed: {
      noIcon: 'font-bold',
    },
    content: {
      base: 'px-3 flex-1 truncate',
    },
    icon: {
      base: 'size-5 flex-shrink-0 transition duration-75',
    },
  },
};

const sidebarCollapseTheme = {
  collapse: {
    button:
      'group mb-1 flex w-full text-sm items-center rounded-md px-2.5 py-2 font-normal transition duration-75 cursor-pointer',
    icon: {
      base: 'size-5 transition duration-75',
      open: {
        off: '',
        on: 'text-gray-900',
      },
    },
    label: {
      base: 'ml-3 flex-1 whitespace-nowrap text-left',
      icon: 'transition h-3 w-3',
    },
    list: 'space-y-1 mt-1',
  },
  item: {
    active: 'bg-blue-800/10 text-blue-800 dark:bg-gray-700 dark:text-blue-300',
    inactive: 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700',
    collapsed: {
      insideCollapse: 'group w-full pl-5 transition duration-75',
    },
  },
};

const Sidebar = (props: SidebarProps) => {
  const [isItemCollapsed, setIsItemCollapsed] = createStore<Record<string, boolean>>({});
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

  return (
    <aside
      aria-label="sidebar"
      class={twMerge(sidebarTheme.root.base, sidebarTheme.root.collapsed.on, local.class)}
      {...otherProps}
    >
      <div class={twMerge(sidebarTheme.root.inner, local.innerClass)}>
        <div>
          <ul class={sidebarTheme.itemGroup}>
            {local.children}
            <For each={items()}>
              {(mn) => (
                <div>
                  <Show when={!mn.children}>
                    <SidebarItem
                      icon={mn.icon}
                      onClick={mn.onClick}
                      class={mn.class}
                      isActive={mn.isActive}
                      id={mn.id}
                    >
                      {mn.label}
                    </SidebarItem>
                  </Show>
                  <Show when={mn.children}>
                    <Popover
                      position="right-start"
                      onHover={true}
                      menu={true}
                      hidden={isPopoverHidden(mn)}
                      content={
                        <div class="min-w-[180px] px-1.5 py-2">
                          <For each={mn.children}>
                            {(sb) => (
                              <SidebarItem
                                onClick={sb.onClick}
                                class={
                                  sb.isActive
                                    ? ''
                                    : 'hover:!bg-gray-100/75 dark:hover:!bg-gray-700'
                                }
                                isActive={sb.isActive}
                                id={sb.id}
                              >
                                {sb.label}
                              </SidebarItem>
                            )}
                          </For>
                        </div>
                      }
                    >
                      <SidebarCollapse
                        icon={mn.icon}
                        label={mn.label}
                        isItemCollapsed={!!isItemCollapsed?.[mn.id]}
                        setIsItemCollapsed={(el) => setIsItemCollapsed(mn.id, el)}
                        id={mn.id}
                        isActive={mn.isActive}
                      >
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
  ]);

  return (
    <li id={local.id}>
      <a
        class={twMerge(
          local.class,
          sidebarItemTheme.item.base,
          local.isActive ? sidebarItemTheme.item.active : sidebarItemTheme.item.inactive,
        )}
        {...otherProps}
      >
        <Show when={local.isActive}>
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
          title={typeof local.children === 'string' ? local.children : undefined}
          id={`sidebar-item-${local.id}`}
          class={sidebarItemTheme.item.content.base}
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
  ]);

  return (
    <li id={`sidebar-collapse-${local.id}`}>
      <button
        onClick={() => local.setIsItemCollapsed?.(!local.isItemCollapsed)}
        type="button"
        class={twMerge(
          sidebarCollapseTheme.collapse.button,
          local.isActive && !local.isItemCollapsed
            ? sidebarCollapseTheme.item.active
            : sidebarCollapseTheme.item.inactive,
          local.class,
        )}
        {...otherProps}
      >
        <Show when={local.isActive && !local.isItemCollapsed}>
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
        <span class={sidebarCollapseTheme.collapse.label.base}>{local.label}</span>
        <ChevronRightIcon
          class={twMerge(
            sidebarCollapseTheme.collapse.label.icon,
            local.isItemCollapsed ? 'rotate-90' : '',
          )}
        />
      </button>
      <ul
        hidden={!local.isItemCollapsed}
        class={twMerge(
          sidebarCollapseTheme.collapse.list,
          '*:' + sidebarCollapseTheme.item.collapsed.insideCollapse,
        )}
      >
        {local.children}
      </ul>
    </li>
  );
};

export default Sidebar;
