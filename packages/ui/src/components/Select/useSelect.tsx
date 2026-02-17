import {
  Accessor,
  For,
  JSX,
  Show,
  createEffect,
  createMemo,
  createSignal,
  createUniqueId,
  onCleanup,
} from 'solid-js';
import { Portal } from 'solid-js/web';

import { type BackgroundScrollBehavior, useFloating } from '@kayou/hooks';
import { createPresence } from '@solid-primitives/presence';
import { twMerge } from 'tailwind-merge';

import { type Option } from '../../shared';
import HelperText from '../HelperText';
import Label from '../Label';
import { TextInputProps } from '../TextInput';
import { VirtualList } from '../VirtualList';
import {
  CTA,
  InfiniteScrollLoader,
  getScrollProgress,
  optionsContainerClass,
} from './selectUtils';

export interface SelectLabels {
  noResults: string;
  searchPlaceholder: string;
}

export const DEFAULT_SELECT_LABELS: SelectLabels = {
  noResults: 'No results found',
  searchPlaceholder: 'Search...',
};

export interface SelectAriaLabels {
  selectOptions: string;
  searchOptions: string;
}

export const DEFAULT_SELECT_ARIA_LABELS: SelectAriaLabels = {
  selectOptions: 'Select options',
  searchOptions: 'Search options',
};

interface MergedSelectProps
  extends Omit<TextInputProps, 'onSelect' | 'labels' | 'ariaLabels'> {
  options: Option[];
  value?: string;
  onSelect?: (option?: Option) => void;
  onMultiSelect?: (options?: Option[]) => void;
  values?: string[];
  clearValues?: boolean;
  withSearch?: boolean;
  clearValue?: boolean;
  autoFillSearchKey?: boolean;
  idValue?: string;
  optionRowHeight?: number;
  cta?: JSX.Element;
  isLoadingMore?: boolean;
  onLoadMore?: (scrollProgress: number) => void;
  /** How to handle background scroll when dropdown is open. @default 'close' */
  backgroundScrollBehavior?: BackgroundScrollBehavior;
  /** Custom class for the reference (trigger wrapper) element. */
  referenceClass?: string;
  /** Custom class for the floating (dropdown) element. */
  floatingClass?: string;
  labels?: Partial<SelectLabels>;
  ariaLabels?: Partial<SelectAriaLabels>;
}

const useSelect = <T extends MergedSelectProps>(
  props: T,
  type: 'select' | 'selectWithSearch' | 'multiSelect',
) => {
  const selectLabels = createMemo(() => ({ ...DEFAULT_SELECT_LABELS, ...props.labels }));
  const selectAriaLabels = createMemo(() => ({
    ...DEFAULT_SELECT_ARIA_LABELS,
    ...props.ariaLabels,
  }));

  const [searchKey, setSearchKey] = createSignal('');
  const [selectedOption, setSelectedOption] = createSignal<Option | null>(null);
  const [selectedOptions, setSelectedOptions] = createSignal<Option[]>([]);
  const [highlightedOption, setHighlightedOption] = createSignal<Option | null>(null);
  const [filteredOptions, setFilteredOptions] = createSignal<Option[]>([]);
  const [isOpen, setIsOpen] = createSignal(false);
  const [searchRef, setSearchRef] = createSignal<HTMLInputElement | undefined>();
  const [optionsContainerRef, setOptionsContainerRef] = createSignal<
    HTMLDivElement | undefined
  >();
  const [scrollTop, setScrollTop] = createSignal(0);
  const [typeaheadBuffer, setTypeaheadBuffer] = createSignal('');
  let typeaheadTimeout: ReturnType<typeof setTimeout>;

  const listboxId = createUniqueId();
  const searchInputId = createUniqueId();

  createEffect(() => {
    setFilteredOptions(props.options);
  });

  createEffect(() => {
    if (type === 'selectWithSearch') {
      if (props.idValue) {
        const opt = props.options.find((o) => o.value === props.idValue);
        if (opt) {
          if (props.autoFillSearchKey) setSearchKey(opt.label);
          setSelectedOption(opt);
          setHighlightedOption(opt);
        }
      } else if (props.value) {
        setSearchKey(props.value);
      }
    }
    if (type === 'multiSelect' && props.values) {
      const selected = props.options.filter((o) => props.values?.includes(o.value));
      setSelectedOptions(selected);
    }
    if (type === 'select') {
      if (props.value) {
        const opt = props.options.find((o) => o.value === props.value);
        if (opt) {
          setSelectedOption(opt);
          setHighlightedOption(opt);
        }
      }
    }
  });

  createEffect(() => {
    if (props.clearValue && type === 'selectWithSearch') {
      setSelectedOption(null);
      props.onSelect?.(undefined);
      setSearchKey('');
      setFilteredOptions(props.options);
      setHighlightedOption(null);
    }
    if (props.clearValues && type === 'multiSelect') {
      setSelectedOptions([]);
      props.onMultiSelect?.([]);
    }
  });

  const scrollToHighlightedOption = (index: number) => {
    const container = optionsContainerRef();
    if (!container) return;

    const rowHeight = props.optionRowHeight || 32; // 32 because it is the rowHeight we currently use
    const containerHeight = container.clientHeight;
    const scrollTop = container.scrollTop;

    const optionTop = index * rowHeight;
    const optionBottom = optionTop + rowHeight;

    if (optionTop < scrollTop) {
      container.scrollTop = index * rowHeight;
    } else if (optionBottom > scrollTop + containerHeight) {
      const rowsVisible = Math.floor(containerHeight / rowHeight);
      const targetIndex = index - rowsVisible + 1;
      container.scrollTop = Math.max(0, targetIndex * rowHeight);
    }
  };

  const handleSearchChange = (
    e: InputEvent & {
      currentTarget: HTMLInputElement;
      target: HTMLInputElement;
    },
  ) => {
    const value = e.target.value;
    setSearchKey(value);
    if (!value) {
      setFilteredOptions(props.options);
    } else {
      setFilteredOptions(
        props.options.filter((opt) =>
          opt.label.toLowerCase().includes(value.toLowerCase()),
        ),
      );
      setHighlightedOption(filteredOptions()[0]);
    }
    if (type === 'selectWithSearch') {
      if (!isOpen()) {
        setIsOpen(true);
        const container = optionsContainerRef();
        if (!container) return;
        container.scrollTop = scrollTop();
      }
    }
  };

  const findNextEnabledIndex = (fromIndex: number, direction: 1 | -1): number => {
    const options = filteredOptions();
    let index = fromIndex + direction;
    while (index >= 0 && index < options.length) {
      if (!options[index].disabled) return index;
      index += direction;
    }
    return -1;
  };

  const handleOptionClick = (option: Option) => {
    if (option.disabled) return;
    if (type === 'selectWithSearch' || type === 'select') {
      if (props.autoFillSearchKey && type === 'selectWithSearch')
        setSearchKey(option.label);
      setSelectedOption(option);
      props.onSelect?.(option);
      setIsOpen(false);
    }
    if (type === 'multiSelect') {
      const current = selectedOptions();
      const newSelected = current.some((o) => o.value === option.value)
        ? current.filter((o) => o.value !== option.value)
        : [...current, option];
      setSelectedOptions(newSelected);
      props.onMultiSelect?.(newSelected);
      if (props.withSearch === true) {
        (searchRef() as HTMLElement)?.focus();
      }
    }
    setHighlightedOption(option);
  };

  const handleInputClick = () => {
    if (!props.disabled) {
      if (isOpen()) {
        setIsOpen(false);
        return;
      }
      setIsOpen(true);
      const container = optionsContainerRef();
      if (!container) return;
      container.scrollTop = scrollTop();
      if (type === 'selectWithSearch' && !searchKey()) setFilteredOptions(props.options);
      if (type === 'multiSelect' && props.withSearch === true) {
        (searchRef() as HTMLElement)?.focus();
        if (!searchKey()) setFilteredOptions(props.options);
      }
    }
  };

  const { isVisible, isMounted } = createPresence(() => isOpen(), {
    transitionDuration: 200,
  });

  const { refs, floatingStyles, container } = useFloating({
    placement: 'bottom-start',
    isOpen: isMounted,
    offset: 4,
    backgroundScrollBehavior: props.backgroundScrollBehavior,
    onClose: () => setIsOpen(false),
  });

  createEffect(() => {
    const handleClickOutside = (event: PointerEvent) => {
      if (
        refs.floating() &&
        !refs.floating()?.contains(event.target as Node) &&
        refs.reference() &&
        !(refs.reference() as HTMLElement)?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('pointerdown', handleClickOutside);

    onCleanup(() => {
      document.removeEventListener('pointerdown', handleClickOutside);
      clearTimeout(typeaheadTimeout);
    });
  });

  createEffect(() => {
    if (type === 'selectWithSearch' || type === 'multiSelect') {
      const el = optionsContainerRef();
      if (!el) return;

      let lastScrollTop = el.scrollTop;
      let ticking = false;

      const handleInfiniteScroll = () => {
        const current = el.scrollTop;
        const isScrollingDown = current > lastScrollTop;
        lastScrollTop = current <= 0 ? 0 : current;

        if (!isScrollingDown || ticking) return;

        const progress = getScrollProgress(el);

        // Only trigger when near bottom (80%)
        if (progress < 80) return;

        ticking = true;
        requestAnimationFrame(() => {
          if (!props.isLoadingMore) {
            props.onLoadMore?.(progress);
          }
          ticking = false;
        });
      };

      el.addEventListener('scroll', handleInfiniteScroll, { passive: true });

      onCleanup(() => el.removeEventListener('scroll', handleInfiniteScroll));
    }
  });

  const handleKeyDown = (
    e: KeyboardEvent & {
      currentTarget: HTMLElement;
      target: Element;
    },
    copy = false,
  ) => {
    const { key } = e;

    // Open dropdown on Enter, Space, or ArrowDown when closed
    if (!isOpen()) {
      if (key === 'Enter' || key === ' ' || key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
        if (type === 'multiSelect' && props.withSearch === true) {
          (searchRef() as HTMLElement)?.focus();
          if (!searchKey()) setFilteredOptions(props.options);
        }
        if (type === 'selectWithSearch' && !searchKey()) {
          setFilteredOptions(props.options);
        }
        return;
      }
    }

    if (key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedOption((prev) => {
        const options = filteredOptions();
        if (options.length === 0) return null;
        if (!prev) {
          const lastEnabled = findNextEnabledIndex(options.length, -1);
          if (lastEnabled === -1) return null;
          scrollToHighlightedOption(lastEnabled);
          return options[lastEnabled];
        }
        const currentIndex = options.findIndex((o) => o.value === prev.value);
        if (currentIndex === -1) {
          const lastEnabled = findNextEnabledIndex(options.length, -1);
          if (lastEnabled === -1) return null;
          scrollToHighlightedOption(lastEnabled);
          return options[lastEnabled];
        }
        const newIndex = findNextEnabledIndex(currentIndex, -1);
        if (newIndex === -1) return prev;
        scrollToHighlightedOption(newIndex);
        return options[newIndex];
      });
      return;
    }

    if (key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedOption((prev) => {
        const options = filteredOptions();
        if (options.length === 0) return null;
        if (!prev) {
          const firstEnabled = findNextEnabledIndex(-1, 1);
          if (firstEnabled === -1) return null;
          scrollToHighlightedOption(firstEnabled);
          return options[firstEnabled];
        }
        const currentIndex = options.findIndex((o) => o.value === prev.value);
        if (currentIndex === -1) {
          const firstEnabled = findNextEnabledIndex(-1, 1);
          if (firstEnabled === -1) return null;
          scrollToHighlightedOption(firstEnabled);
          return options[firstEnabled];
        }
        const newIndex = findNextEnabledIndex(currentIndex, 1);
        if (newIndex === -1) return prev;
        scrollToHighlightedOption(newIndex);
        return options[newIndex];
      });
      return;
    }

    if (key === 'Enter') {
      e.preventDefault();
      const highlighted = highlightedOption();
      if (highlighted && !highlighted.disabled) {
        const currentIndex = filteredOptions().findIndex((o) => o.value === highlighted.value);
        if (currentIndex !== -1) {
          handleOptionClick(highlighted);
          return;
        }
      }
      const firstEnabled = filteredOptions().find((o) => !o.disabled);
      if (filteredOptions().filter((o) => !o.disabled).length === 1 && firstEnabled) {
        handleOptionClick(firstEnabled);
      }
      return;
    }

    if (key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      setIsOpen(false);
      // Return focus to the combobox trigger
      const ref = refs.reference();
      const el = ref instanceof HTMLElement ? ref : null;
      const combobox = el?.querySelector<HTMLElement>('[role="combobox"]') ?? el;
      combobox?.focus();
      return;
    }

    if (key === 'Home') {
      e.preventDefault();
      const firstEnabled = findNextEnabledIndex(-1, 1);
      if (firstEnabled !== -1) {
        setHighlightedOption(filteredOptions()[firstEnabled]);
        scrollToHighlightedOption(firstEnabled);
      }
      return;
    }

    if (key === 'End') {
      e.preventDefault();
      const lastEnabled = findNextEnabledIndex(filteredOptions().length, -1);
      if (lastEnabled !== -1) {
        setHighlightedOption(filteredOptions()[lastEnabled]);
        scrollToHighlightedOption(lastEnabled);
      }
      return;
    }

    if (key === 'Tab') {
      setIsOpen(false);
      return;
    }

    // Space selects the highlighted option in non-searchable selects
    if (key === ' ' && (type === 'select' || (type === 'multiSelect' && !copy))) {
      e.preventDefault();
      const highlighted = highlightedOption();
      if (highlighted && !highlighted.disabled) {
        const currentIndex = filteredOptions().findIndex((o) => o.value === highlighted.value);
        if (currentIndex !== -1) {
          handleOptionClick(highlighted);
          return;
        }
      }
      const firstEnabled = filteredOptions().find((o) => !o.disabled);
      if (filteredOptions().filter((o) => !o.disabled).length === 1 && firstEnabled) {
        handleOptionClick(firstEnabled);
      }
      return;
    }

    // Typeahead: jump to matching option in non-searchable selects
    if (
      (type === 'select' || (type === 'multiSelect' && !props.withSearch)) &&
      key.length === 1 &&
      !e.ctrlKey &&
      !e.metaKey
    ) {
      e.preventDefault();
      clearTimeout(typeaheadTimeout);
      const buffer = typeaheadBuffer() + key.toLowerCase();
      setTypeaheadBuffer(buffer);
      typeaheadTimeout = setTimeout(() => setTypeaheadBuffer(''), 500);

      const match = filteredOptions().find(
        (o) => !o.disabled && o.label.toLowerCase().startsWith(buffer),
      );
      if (match) {
        setHighlightedOption(match);
        const index = filteredOptions().indexOf(match);
        scrollToHighlightedOption(index);
      }
      return;
    }
  };

  const Layout = (layoutProps: {
    inputComponent: JSX.Element;
    optionsComponent: (option: Option, index: Accessor<number>) => JSX.Element;
    preOptionsComponent?: JSX.Element;
  }) => {
    return (
      <div class="w-full">
        <div class="relative w-full">
          <Show when={props.label}>
            <div class="mb-1 block">
              <Label value={props.label} color={props.color} />
              <Show when={props.required}>
                <span class="ml-0.5 font-medium text-red-500">*</span>
              </Show>
            </div>
          </Show>
          <div ref={refs.setReference} onClick={handleInputClick} class={twMerge('relative w-full', props.referenceClass)}>
            {layoutProps.inputComponent}
          </div>

          <Show when={isMounted()}>
            <Portal mount={container() ?? undefined}>
              <div
                ref={refs.setFloating}
                class={twMerge(
                  'z-100 w-fit rounded-lg border border-neutral-200 bg-white shadow dark:border-neutral-800 dark:bg-neutral-900',
                  props.floatingClass,
                )}
                style={
                  {
                    ...floatingStyles(),
                    opacity: isVisible() ? '1' : '0',
                    transform: isVisible() ? 'scale(1)' : 'scale(0.8)',
                    'transition-property': 'opacity, transform',
                    'transition-duration': '.2s',
                    'transition-timing-function': 'cubic-bezier(.32, .72, 0, 1)',
                  } as JSX.CSSProperties
                }
              >
                {layoutProps.preOptionsComponent}

                <Show
                  when={props.optionRowHeight}
                  fallback={
                    <div
                      ref={setOptionsContainerRef}
                      id={listboxId}
                      role="listbox"
                      aria-multiselectable={type === 'multiSelect' ? true : undefined}
                      aria-label={props.label || selectAriaLabels().selectOptions}
                      class={optionsContainerClass}
                      onScroll={(e: Event) => {
                        const el = e.target as HTMLElement;
                        if (el?.scrollTop !== undefined) {
                          setScrollTop(el.scrollTop);
                        }
                      }}
                    >
                      <For
                        each={filteredOptions()}
                        fallback={
                          <div class="whitespace-nowrap px-2 py-1.5 text-sm">
                            {selectLabels().noResults}
                          </div>
                        }
                      >
                        {layoutProps.optionsComponent}
                      </For>
                      <InfiniteScrollLoader isLoadingMore={props.isLoadingMore} />
                    </div>
                  }
                >
                  <VirtualList
                    items={filteredOptions}
                    rootHeight={200}
                    rowHeight={props.optionRowHeight!}
                    overscanCount={3}
                    setContainerRef={setOptionsContainerRef}
                    minWidth={props.withSearch ? 210 : undefined}
                    id={listboxId}
                    role="listbox"
                    aria-multiselectable={type === 'multiSelect' ? true : undefined}
                    aria-label={props.label || selectAriaLabels().selectOptions}
                    loading={<InfiniteScrollLoader isLoadingMore={props.isLoadingMore} />}
                    setScrollPosition={setScrollTop}
                    fallback={
                      <div class="whitespace-nowrap px-2 py-1.5 text-sm">
                        {selectLabels().noResults}
                      </div>
                    }
                  >
                    {layoutProps.optionsComponent}
                  </VirtualList>
                </Show>
                <CTA cta={props.cta} />
              </div>
            </Portal>
          </Show>
        </div>
        <Show when={props.helperText}>
          <HelperText content={props.helperText!} color={props.color} />
        </Show>
      </div>
    );
  };

  return {
    searchKey,
    setSearchKey,
    selectedOption,
    setSelectedOption,
    selectedOptions,
    setSelectedOptions,
    highlightedOption,
    setHighlightedOption,
    filteredOptions,
    setFilteredOptions,
    isOpen,
    listboxId,
    searchInputId,
    handleKeyDown,
    handleOptionClick,
    handleSearchChange,
    handleInputClick,
    searchRef,
    Layout,
    setSearchRef,
    selectLabels,
  };
};

export default useSelect;
