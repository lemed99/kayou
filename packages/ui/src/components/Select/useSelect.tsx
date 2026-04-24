import {
  Accessor,
  For,
  Index,
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

import { capitalizeFirstWord } from '../../helpers';
import { type Option } from '../../shared';
import { DynamicVirtualList, type DynamicVirtualListHandle } from '../DynamicVirtualList';
import HelperText from '../HelperText';
import Label from '../Label';
import { TextInputProps } from '../TextInput';
import { VirtualList } from '../VirtualList';
import {
  CTA,
  InfiniteScrollLoader,
  type SelectCTA,
  type VirtualGroupItem,
  buildVirtualGroupItems,
  getScrollProgress,
  groupHeaderClass,
  groupOptions,
  groupSpacerClass,
  hasGroups,
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

interface MergedSelectProps extends Omit<
  TextInputProps,
  'onSelect' | 'labels' | 'ariaLabels'
> {
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
  cta?: SelectCTA;
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
          if (props.autoFillSearchKey) setSearchKey(capitalizeFirstWord(opt.label));
          setSelectedOption(opt);
          setHighlightedOption(opt);
        }
      } else if (props.value) {
        setSearchKey(capitalizeFirstWord(props.value));
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

  let dynamicVirtualHandle: DynamicVirtualListHandle | undefined;
  // Reverse lookup map: flatIndex (option index) → virtual item index.
  // Maintained by Layout's virtualItems memo so scrollToHighlightedOption
  // doesn't need to rebuild the list on every arrow key press.
  let flatToVirtualIndex: Map<number, number> | undefined;

  const scrollToHighlightedOption = (index: number) => {
    const container = optionsContainerRef();
    if (!container) return;

    // For non-virtual mode, use DOM-based scrolling so group headers are
    // accounted for automatically.
    if (!props.optionRowHeight) {
      const options = filteredOptions();
      const option = options[index];
      if (!option) return;
      const optionId = `${listboxId}-option-${option.value}`;
      const el = container.querySelector(`[id="${CSS.escape(optionId)}"]`);
      if (el) {
        el.scrollIntoView({ block: 'nearest' });
        return;
      }
    }

    // Grouped virtual scroll: use DynamicVirtualList handle which knows
    // actual measured row heights (headers, spacers, options differ).
    if (dynamicVirtualHandle && flatToVirtualIndex) {
      const virtualIdx = flatToVirtualIndex.get(index);
      if (virtualIdx !== undefined) {
        dynamicVirtualHandle.scrollToIndex(virtualIdx);
      }
      return;
    }

    // Non-grouped virtual scroll: fixed row height calculation.
    const rowHeight = props.optionRowHeight || 32;
    const containerHeight = container.clientHeight;
    const currentScrollTop = container.scrollTop;

    const optionTop = index * rowHeight;
    const optionBottom = optionTop + rowHeight;

    if (optionTop < currentScrollTop) {
      container.scrollTop = index * rowHeight;
    } else if (optionBottom > currentScrollTop + containerHeight) {
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
        setSearchKey(capitalizeFirstWord(option.label));
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
    if (!isOpen()) return;

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
    onCleanup(() => document.removeEventListener('pointerdown', handleClickOutside));
  });

  onCleanup(() => clearTimeout(typeaheadTimeout));

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
        const currentIndex = filteredOptions().findIndex(
          (o) => o.value === highlighted.value,
        );
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
        const currentIndex = filteredOptions().findIndex(
          (o) => o.value === highlighted.value,
        );
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

  const handleGroupToggle = (groupOpts: Option[]) => {
    if (type !== 'multiSelect') return;
    const current = selectedOptions();
    const enabled = groupOpts.filter((o) => !o.disabled);
    const allSelected = enabled.every((o) => current.some((s) => s.value === o.value));

    let newSelected: Option[];
    if (allSelected) {
      const groupValues = new Set(enabled.map((o) => o.value));
      newSelected = current.filter((o) => !groupValues.has(o.value));
    } else {
      const currentValues = new Set(current.map((o) => o.value));
      const toAdd = enabled.filter((o) => !currentValues.has(o.value));
      newSelected = [...current, ...toAdd];
    }

    setSelectedOptions(newSelected);
    props.onMultiSelect?.(newSelected);
  };

  const Layout = (layoutProps: {
    inputComponent: JSX.Element;
    optionsComponent: (option: Option, index: Accessor<number>) => JSX.Element;
    preOptionsComponent?: JSX.Element;
    groupHeaderComponent?: (
      group: string,
      options: Option[],
      headerId: string,
    ) => JSX.Element;
    groupSpacerClass?: string;
  }) => {
    const grouped = createMemo(() => hasGroups(filteredOptions()));

    const virtualItems = createMemo<VirtualGroupItem[]>(() => {
      const opts = filteredOptions();
      if (!grouped()) {
        flatToVirtualIndex = undefined;
        return opts.map((o, i) => ({
          _type: 'option' as const,
          option: o,
          flatIndex: i,
        }));
      }
      const items = buildVirtualGroupItems(opts, listboxId);
      // Build reverse lookup for scrollToHighlightedOption
      const lookup = new Map<number, number>();
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item._type === 'option') {
          lookup.set(item.flatIndex, i);
        }
      }
      flatToVirtualIndex = lookup;
      return items;
    });

    const renderVirtualItem = (item: VirtualGroupItem) => {
      if (item._type === 'spacer') {
        return (
          <div
            role="separator"
            class={layoutProps.groupSpacerClass ?? groupSpacerClass}
          />
        );
      }
      if (item._type === 'header') {
        return (
          <Show
            when={layoutProps.groupHeaderComponent}
            fallback={
              <div id={item.headerId} role="presentation" class={groupHeaderClass}>
                {item.group}
              </div>
            }
          >
            {layoutProps.groupHeaderComponent!(item.group, item.options, item.headerId)}
          </Show>
        );
      }
      return layoutProps.optionsComponent(item.option, () => item.flatIndex);
    };

    return (
      <div class="w-full">
        <div class="relative w-full">
          <Show when={props.label}>
            <div class="mb-1 block">
              <Label
                value={props.label}
                color={props.color}
                capitalizeFirstWord={props.capitalizeFirstWord}
              />
              <Show when={props.required}>
                <span class="ml-0.5 font-medium text-red-500">*</span>
              </Show>
            </div>
          </Show>
          <div
            ref={refs.setReference}
            onClick={handleInputClick}
            class={twMerge('relative w-full', props.referenceClass)}
          >
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
                      <Show
                        when={grouped()}
                        fallback={
                          <For
                            each={filteredOptions()}
                            fallback={
                              <div class="px-2 py-1.5 text-sm whitespace-nowrap">
                                {selectLabels().noResults}
                              </div>
                            }
                          >
                            {layoutProps.optionsComponent}
                          </For>
                        }
                      >
                        {(() => {
                          const groups = createMemo(() =>
                            groupOptions(filteredOptions()),
                          );
                          return (
                            <Show
                              when={filteredOptions().length > 0}
                              fallback={
                                <div class="px-2 py-1.5 text-sm whitespace-nowrap">
                                  {selectLabels().noResults}
                                </div>
                              }
                            >
                              <Index each={groups()}>
                                {(entry, groupIdx) => (
                                  <>
                                    <Show when={groupIdx > 0}>
                                      <div
                                        role="separator"
                                        class={
                                          layoutProps.groupSpacerClass ?? groupSpacerClass
                                        }
                                      />
                                    </Show>
                                    <Show
                                      when={entry().group !== null}
                                      fallback={
                                        <For each={entry().options}>
                                          {layoutProps.optionsComponent}
                                        </For>
                                      }
                                    >
                                      <div
                                        role="group"
                                        aria-labelledby={`${listboxId}-group-${groupIdx}`}
                                      >
                                        <Show
                                          when={layoutProps.groupHeaderComponent}
                                          fallback={
                                            <div
                                              id={`${listboxId}-group-${groupIdx}`}
                                              role="presentation"
                                              class={groupHeaderClass}
                                            >
                                              {entry().group}
                                            </div>
                                          }
                                        >
                                          {layoutProps.groupHeaderComponent!(
                                            entry().group!,
                                            entry().options,
                                            `${listboxId}-group-${groupIdx}`,
                                          )}
                                        </Show>
                                        <For each={entry().options}>
                                          {layoutProps.optionsComponent}
                                        </For>
                                      </div>
                                    </Show>
                                  </>
                                )}
                              </Index>
                            </Show>
                          );
                        })()}
                      </Show>
                      <InfiniteScrollLoader isLoadingMore={props.isLoadingMore} />
                    </div>
                  }
                >
                  <Show
                    when={grouped()}
                    fallback={
                      <VirtualList
                        items={virtualItems}
                        rootHeight={200}
                        rowHeight={props.optionRowHeight!}
                        overscanCount={3}
                        containerWidth={
                          props.withSearch || props.cta ? '100%' : undefined
                        }
                        setContainerRef={setOptionsContainerRef}
                        minWidth={props.withSearch ? 210 : undefined}
                        id={listboxId}
                        role="listbox"
                        aria-multiselectable={type === 'multiSelect' ? true : undefined}
                        aria-label={props.label || selectAriaLabels().selectOptions}
                        loading={
                          <InfiniteScrollLoader isLoadingMore={props.isLoadingMore} />
                        }
                        setScrollPosition={setScrollTop}
                        fallback={
                          <div class="px-2 py-1.5 text-sm whitespace-nowrap">
                            {selectLabels().noResults}
                          </div>
                        }
                      >
                        {(item) => renderVirtualItem(item)}
                      </VirtualList>
                    }
                  >
                    <DynamicVirtualList
                      items={virtualItems}
                      rootHeight={200}
                      estimatedRowHeight={props.optionRowHeight!}
                      overscanCount={3}
                      containerWidth={props.withSearch || props.cta ? '100%' : undefined}
                      minWidth={props.withSearch ? 210 : undefined}
                      setContainerRef={setOptionsContainerRef}
                      id={listboxId}
                      role="listbox"
                      aria-multiselectable={type === 'multiSelect' ? true : undefined}
                      aria-label={props.label || selectAriaLabels().selectOptions}
                      loading={
                        <InfiniteScrollLoader isLoadingMore={props.isLoadingMore} />
                      }
                      setScrollPosition={setScrollTop}
                      fallback={
                        <div class="px-2 py-1.5 text-sm whitespace-nowrap">
                          {selectLabels().noResults}
                        </div>
                      }
                      ref={(handle) => {
                        dynamicVirtualHandle = handle;
                      }}
                    >
                      {(item) => renderVirtualItem(item)}
                    </DynamicVirtualList>
                  </Show>
                </Show>
                <CTA
                  cta={props.cta}
                  controls={{
                    closeDropdown: () => setIsOpen(false),
                  }}
                />
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
    handleGroupToggle,
    handleSearchChange,
    handleInputClick,
    searchRef,
    Layout,
    setSearchRef,
    selectLabels,
  };
};

export default useSelect;
