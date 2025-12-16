import { For, JSX, Show, createEffect, createSignal, onCleanup } from 'solid-js';
import { createStore } from 'solid-js/store';

import { createPresence } from '@solid-primitives/presence';
import { twMerge } from 'tailwind-merge';

import { ChevronRightIcon } from '../icons';

export interface PanelData {
  itemKey: string;
  title: JSX.Element;
  content: JSX.Element;
  class?: string;
  titleClass?: string;
  contentClass?: string;
}

export interface AccordionProps {
  children?: JSX.Element;
  panels?: PanelData[];
  searched?: string;
  searchedClass?: string;
  simple?: boolean;
  itemDetails?: Record<string, boolean>;
  setItemDetails?: (state: Record<string, boolean>) => void;
  class?: string;
}

const Accordion = (props: AccordionProps) => {
  const [internalItemDetails, setInternalItemDetails] = createStore<
    Record<string, boolean>
  >({});

  const isControlled = () =>
    props.itemDetails !== undefined && props.setItemDetails !== undefined;

  const getOpenState = (itemKey: string) => {
    if (isControlled()) {
      return props.itemDetails?.[itemKey] || false;
    }
    return internalItemDetails[itemKey] || false;
  };

  const togglePanel = (itemKey: string) => {
    if (isControlled() && props.setItemDetails) {
      const newState = { ...props.itemDetails };
      newState[itemKey] = !getOpenState(itemKey);
      props.setItemDetails(newState);
    } else {
      setInternalItemDetails(itemKey, (prev) => !prev);
    }
  };

  const getPanels = () => {
    if (props.panels && props.panels.length > 0) {
      return props.panels;
    }

    return [];
  };

  return (
    <div class={twMerge('w-full', props.class)}>
      <For each={getPanels()}>
        {(panel) => (
          <Panel
            panel={panel}
            isOpen={getOpenState(panel.itemKey)}
            toggle={() => togglePanel(panel.itemKey)}
            simple={props.simple ?? true}
            searched={props.searched}
            searchedClass={props.searchedClass}
          />
        )}
      </For>
    </div>
  );
};

interface PanelProps {
  panel: PanelData;
  isOpen: boolean;
  toggle: () => void;
  simple: boolean;
  searched?: string;
  searchedClass?: string;
}

const Panel = (props: PanelProps) => {
  const isSearched = () => props.searched === props.panel.itemKey;
  const [panelContentElement, setPanelContentElement] = createSignal<HTMLDivElement>();
  const [panelElementHeight, setPanelElementHeight] = createSignal(0);

  createEffect(() => {
    if (isSearched()) {
      const elementId = `item_title${props.panel.itemKey}`;
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => element.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    }
  });

  const { isVisible, isMounted } = createPresence(
    () => props.panel.content && props.isOpen,
    {
      transitionDuration: 200,
    },
  );

  createEffect(() => {
    if (panelContentElement()) {
      requestAnimationFrame(() => {
        setPanelElementHeight(panelContentElement()?.offsetHeight || 0);
      });

      const resizeObserver = new ResizeObserver(() => {
        requestAnimationFrame(() =>
          setPanelElementHeight(panelContentElement()?.offsetHeight || 0),
        );
      });
      resizeObserver.observe(panelContentElement()!);

      onCleanup(() => resizeObserver?.disconnect());
    }
  });

  return (
    <div
      class={twMerge(
        'border-b border-gray-200 dark:border-gray-700',
        !props.simple && 'border-x first:rounded-t-lg first:border-t last:rounded-b-lg',
        props.panel.class,
      )}
      id={`item${props.panel.itemKey}`}
    >
      {!props.simple && (
        <style>
          {`
            #item${props.panel.itemKey}:first-child > div#item_title${
              props.panel.itemKey
            } {
              border-top-right-radius: 7px;
              border-top-left-radius: 7px;
            }
            #item${props.panel.itemKey}:last-child > div#item_content${
              props.panel.itemKey
            } {
              border-bottom-right-radius: 7px;
              border-bottom-left-radius: 7px;
            }
            ${
              !props.isOpen
                ? `#item${props.panel.itemKey}:last-child > div#item_title${props.panel.itemKey} {
              border-bottom-right-radius: 7px;
              border-bottom-left-radius: 7px;
            }`
                : ''
            }
          `}
        </style>
      )}

      <div
        id={`item_title${props.panel.itemKey}`}
        onClick={() => props.toggle()}
        class={twMerge(
          'flex w-full cursor-pointer items-center justify-between p-3 transition-all duration-200',
          props.isOpen && !props.simple && 'bg-gray-100/60 dark:bg-gray-700',
          isSearched() &&
            (props.searchedClass ? props.searchedClass : 'bg-teal-200 dark:bg-teal-800'),
          props.panel.titleClass,
        )}
      >
        <div class="flex w-full items-center">{props.panel.title}</div>
        <Show when={props.panel.content}>
          <div>
            <ChevronRightIcon
              class={twMerge(
                'size-3 transition-all duration-200',
                props.isOpen ? 'rotate-90' : '',
              )}
            />
          </div>
        </Show>
      </div>

      <Show when={isMounted()}>
        <div
          id={`item_content${props.panel.itemKey}`}
          class={twMerge(
            'overflow-hidden border-t border-gray-200 dark:border-gray-700',
            !props.simple && 'dark:bg-gray-900/50',
            props.panel.contentClass,
          )}
          style={{
            height: isVisible() ? `${panelElementHeight()}px` : 0,
            transition: 'height .242s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <div ref={setPanelContentElement} class="p-3">
            {props.panel.content}
          </div>
        </div>
      </Show>
    </div>
  );
};

export default Accordion;
