import {
  For,
  JSX,
  Show,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
} from 'solid-js';
import { createStore } from 'solid-js/store';

import { ChevronRightIcon } from '@kayou/icons';
import { createPresence } from '@solid-primitives/presence';
import { twMerge } from 'tailwind-merge';

/**
 * Data structure for each accordion panel.
 */
export interface PanelData {
  /** Unique identifier for the panel */
  itemKey: string;
  /** Content displayed in the panel header */
  title: JSX.Element;
  /** Content displayed when the panel is expanded */
  content: JSX.Element;
  /** Additional CSS classes for the panel container */
  class?: string;
  /** Additional CSS classes for the panel header */
  titleClass?: string;
  /** Additional CSS classes for the panel content */
  contentClass?: string;
}

export interface AccordionProps {
  /**
   * Array of panel data to render.
   */
  panels?: PanelData[];
  /**
   * Key of the panel to highlight/scroll to.
   */
  highlightedKey?: string;
  /**
   * CSS class applied to highlighted panel header.
   * @default 'bg-teal-200 dark:bg-teal-800'
   */
  highlightedClass?: string;
  /**
   * When true, renders a simpler style without borders and backgrounds.
   * @default true
   */
  isSimple?: boolean;
  /**
   * Gap between panels. When set, each panel is displayed as a separate card.
   * Can be a Tailwind spacing class (e.g., '2', '4', '6') or custom value.
   */
  gap?: string;
  /**
   * When true, only one panel can be open at a time.
   * Opening a panel will close any other open panel.
   * @default false
   */
  exclusive?: boolean;
  /**
   * Controlled state: map of panel keys to open state.
   */
  openPanels?: Record<string, boolean>;
  /**
   * Callback when panel open state changes (controlled mode).
   */
  onOpenChange?: (state: Record<string, boolean>) => void;
  /**
   * Additional CSS classes for the accordion container.
   */
  class?: string;

  // Legacy prop names (deprecated, use new names above)
  /** @deprecated Use `highlightedKey` instead */
  searched?: string;
  /** @deprecated Use `highlightedClass` instead */
  searchedClass?: string;
  /** @deprecated Use `isSimple` instead */
  simple?: boolean;
  /** @deprecated Use `openPanels` instead */
  itemDetails?: Record<string, boolean>;
  /** @deprecated Use `onOpenChange` instead */
  setItemDetails?: (state: Record<string, boolean>) => void;
}

const Accordion = (props: AccordionProps): JSX.Element => {
  const [internalOpenPanels, setInternalOpenPanels] = createStore<
    Record<string, boolean>
  >({});

  // Support both new and legacy prop names
  const getOpenPanelsState = () => props.openPanels ?? props.itemDetails;
  const getOnOpenChange = () => props.onOpenChange ?? props.setItemDetails;
  const getHighlightedKey = () => props.highlightedKey ?? props.searched;
  const getHighlightedClass = () => props.highlightedClass ?? props.searchedClass;
  const getIsSimple = () => props.isSimple ?? props.simple ?? true;

  const isControlled = createMemo(
    () => getOpenPanelsState() !== undefined && getOnOpenChange() !== undefined,
  );

  const panels = createMemo(() => props.panels ?? []);

  const getOpenState = (itemKey: string): boolean => {
    if (isControlled()) {
      return getOpenPanelsState()?.[itemKey] ?? false;
    }
    return internalOpenPanels[itemKey] ?? false;
  };

  const togglePanel = (itemKey: string): void => {
    const onOpenChange = getOnOpenChange();
    const isOpening = !getOpenState(itemKey);

    if (isControlled() && onOpenChange) {
      let newState: Record<string, boolean>;

      if (props.exclusive && isOpening) {
        // Close all panels and open only the clicked one
        newState = {};
        for (const panel of panels()) {
          newState[panel.itemKey] = panel.itemKey === itemKey;
        }
      } else {
        newState = { ...getOpenPanelsState() };
        newState[itemKey] = isOpening;
      }

      onOpenChange(newState);
    } else {
      if (props.exclusive && isOpening) {
        // Close all panels and open only the clicked one
        for (const panel of panels()) {
          setInternalOpenPanels(panel.itemKey, panel.itemKey === itemKey);
        }
      } else {
        setInternalOpenPanels(itemKey, (prev) => !prev);
      }
    }
  };

  const isSeparated = () => !!props.gap;

  return (
    <div
      class={twMerge(
        'w-full',
        isSeparated() && `flex flex-col gap-${props.gap}`,
        props.class,
      )}
    >
      <For each={panels()}>
        {(panel) => (
          <Panel
            panel={panel}
            isOpen={getOpenState(panel.itemKey)}
            toggle={() => togglePanel(panel.itemKey)}
            isSimple={getIsSimple()}
            isSeparated={isSeparated()}
            highlightedKey={getHighlightedKey()}
            highlightedClass={getHighlightedClass()}
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
  isSimple: boolean;
  isSeparated?: boolean;
  highlightedKey?: string;
  highlightedClass?: string;
}

const Panel = (props: PanelProps): JSX.Element => {
  const isHighlighted = createMemo(() => props.highlightedKey === props.panel.itemKey);
  const [panelContentElement, setPanelContentElement] = createSignal<HTMLDivElement>();
  const [panelElementHeight, setPanelElementHeight] = createSignal(0);

  // IDs for ARIA relationships (derived signals to maintain reactivity)
  const triggerId = () => `accordion-trigger-${props.panel.itemKey}`;
  const panelId = () => `accordion-panel-${props.panel.itemKey}`;
  const itemId = () => `accordion-item-${props.panel.itemKey}`;

  createEffect(() => {
    if (isHighlighted()) {
      const element = document.getElementById(triggerId());
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
        setPanelElementHeight(panelContentElement()?.offsetHeight ?? 0);
      });

      const resizeObserver = new ResizeObserver(() => {
        requestAnimationFrame(() =>
          setPanelElementHeight(panelContentElement()?.offsetHeight ?? 0),
        );
      });
      resizeObserver.observe(panelContentElement()!);

      onCleanup(() => resizeObserver?.disconnect());
    }
  });

  const handleKeyDown = (e: KeyboardEvent): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      props.toggle();
    }
  };

  return (
    <div
      class={twMerge(
        'border-gray-200 dark:border-neutral-800',
        props.isSeparated ? 'rounded-lg border' : 'border-b',
        !props.isSimple &&
          !props.isSeparated &&
          'border-x first:rounded-t-lg first:border-t last:rounded-b-lg',
        props.panel.class,
      )}
      id={itemId()}
    >
      {!props.isSimple && !props.isSeparated && (
        <style>
          {`
            #${itemId()}:first-child > button#${triggerId()} {
              border-top-right-radius: 7px;
              border-top-left-radius: 7px;
            }
            #${itemId()}:last-child > div#${panelId()} {
              border-bottom-right-radius: 7px;
              border-bottom-left-radius: 7px;
            }
            ${
              !props.isOpen
                ? `#${itemId()}:last-child > button#${triggerId()} {
              border-bottom-right-radius: 7px;
              border-bottom-left-radius: 7px;
            }`
                : ''
            }
          `}
        </style>
      )}

      <button
        type="button"
        id={triggerId()}
        onClick={() => props.toggle()}
        onKeyDown={handleKeyDown}
        aria-expanded={props.isOpen}
        aria-controls={panelId()}
        class={twMerge(
          'flex w-full cursor-pointer items-center justify-between p-3 text-left transition-all duration-200',
          props.isOpen && !props.isSimple && 'bg-gray-100/60 dark:bg-neutral-700',
          props.isSeparated && 'rounded-t-lg',
          props.isSeparated && !props.isOpen && 'rounded-b-lg',
          isHighlighted() && (props.highlightedClass ?? 'bg-teal-200 dark:bg-teal-800'),
          props.panel.titleClass,
        )}
      >
        <span class="flex w-full items-center">{props.panel.title}</span>
        <Show when={props.panel.content}>
          <span aria-hidden="true">
            <ChevronRightIcon
              class={twMerge(
                'size-3 transition-all duration-200',
                props.isOpen ? 'rotate-90' : '',
              )}
            />
          </span>
        </Show>
      </button>

      <Show when={isMounted()}>
        <div
          id={panelId()}
          role="region"
          aria-labelledby={triggerId()}
          class={twMerge(
            'overflow-hidden border-t border-gray-200 dark:border-neutral-800',
            !props.isSimple && 'dark:bg-neutral-900/50',
            props.isSeparated && 'rounded-b-lg',
            props.panel.contentClass,
          )}
          style={{
            height: isVisible() ? `${panelElementHeight()}px` : '0px',
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
