import {
  Accessor,
  For,
  JSX,
  Show,
  createEffect,
  createSignal,
  createUniqueId,
  onCleanup,
} from 'solid-js';
import { Portal } from 'solid-js/web';

import { createPresence } from '@solid-primitives/presence';
import { twMerge } from 'tailwind-merge';

import HelperText from '../components/HelperText';
import Label from '../components/Label';
import { TextInputProps } from '../components/TextInput';
import { VirtualList } from '../components/VirtualList';
import { getScrollProgress } from '../helpers';
import {
  CTA,
  LazyLoading,
  type Option,
  optionsContainerClass,
} from '../helpers/selectUtils';
import { useFloating } from './useFloating';

interface MergedSelectProps extends Omit<TextInputProps, 'onSelect'> {
  options: Option[];
  value?: string;
  onSelect?: (option?: Option) => void;
  onMultiSelect?: (options?: Option[]) => void;
  values?: string[];
  clearValues?: boolean;
  withSearch?: boolean;
  searchPlaceholder?: string;
  clearValue?: boolean;
  autoFillSearchKey?: boolean;
  idValue?: string;
  optionRowHeight?: number;
  noSearchResultPlaceholder?: string;
  cta?: JSX.Element;
  isLazyLoading?: boolean;
  onLazyLoad?: (scrollProgress: number) => void;
}

const useSelect = <T extends MergedSelectProps>(
  props: T,
  type: 'select' | 'selectWithSearch' | 'multiSelect',
) => {
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

  const listboxId = createUniqueId();
  const searchInputId = createUniqueId();

  createEffect(() => {
    setFilteredOptions(props.options);
  });

  createEffect(() => {
    if (type === 'selectWithSearch') {
      if (props.idValue) {
        const opt = props.options.find((o) => o.value == props.idValue);
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
        const opt = props.options.find((o) => o.value == props.value);
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

  const handleOptionClick = (option: Option) => {
    if (type === 'selectWithSearch' || type === 'select') {
      if (props.autoFillSearchKey && type === 'selectWithSearch')
        setSearchKey(option.label);
      setSelectedOption(option);
      props.onSelect?.(option);
      setIsOpen(false);
    }
    if (type === 'multiSelect') {
      setSelectedOptions((prev) => {
        if (prev.some((o) => o.value === option.value)) {
          return prev.filter((o) => o.value !== option.value);
        }
        return [...prev, option];
      });
      props.onMultiSelect?.(selectedOptions());
      if (props.withSearch === true) {
        (searchRef() as HTMLElement)?.focus();
      }
    }
    setHighlightedOption(option);
  };

  const handleInputClick = () => {
    if (!props.disabled) {
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
  });

  createEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        refs.floating() &&
        !refs.floating()?.contains(event.target as Node) &&
        refs.reference() &&
        !(refs.reference() as HTMLElement)?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    onCleanup(() => document.removeEventListener('mousedown', handleClickOutside));
  });

  createEffect(() => {
    if (type === 'selectWithSearch' || type === 'multiSelect') {
      const el = optionsContainerRef();
      if (!el) return;

      let lastScrollTop = el.scrollTop;
      let dir: 'up' | 'down' | 'none' = 'none';

      const handleLazyLoading = () => {
        const current = el.scrollTop;
        dir = current > lastScrollTop ? 'down' : current < lastScrollTop ? 'up' : 'none';
        lastScrollTop = current <= 0 ? 0 : current;
        const progress = getScrollProgress(el);
        if (props.isLazyLoading) return;
        if (dir !== 'down') return;
        props.onLazyLoad?.(progress);
      };

      el.addEventListener('scroll', handleLazyLoading);

      onCleanup(() => el.removeEventListener('scroll', handleLazyLoading));
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
    if ((type === 'select' || type === 'multiSelect') && !copy) e.preventDefault();

    if (key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedOption((prev) => {
        if (filteredOptions().length === 0) return null;
        const lastOptionIndex = filteredOptions().length - 1;
        if (!prev) {
          scrollToHighlightedOption(lastOptionIndex);
          return filteredOptions()[lastOptionIndex];
        }
        const currentIndex = filteredOptions().findIndex((o) => o.value === prev.value);
        if (currentIndex === 0) {
          return prev;
        }
        if (currentIndex === -1) {
          scrollToHighlightedOption(lastOptionIndex);
          return filteredOptions()[lastOptionIndex];
        }
        const newIndex = currentIndex - 1;
        scrollToHighlightedOption(newIndex);
        return filteredOptions()[newIndex];
      });
      return;
    }

    if (key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedOption((prev) => {
        if (filteredOptions().length === 0) return null;
        if (!prev) {
          scrollToHighlightedOption(0);
          return filteredOptions()[0];
        }
        const currentIndex = filteredOptions().findIndex((o) => o.value === prev.value);
        if (currentIndex === filteredOptions().length - 1) {
          return prev;
        }
        if (currentIndex === -1) {
          scrollToHighlightedOption(0);
          return filteredOptions()[0];
        }
        const newIndex = currentIndex + 1;
        scrollToHighlightedOption(newIndex);
        return filteredOptions()[newIndex];
      });
      return;
    }

    if (key === 'Enter') {
      e.preventDefault();
      const currentIndex = highlightedOption()
        ? filteredOptions().findIndex((o) => o.value === highlightedOption()?.value)
        : -1;
      if (highlightedOption() && currentIndex !== -1) {
        handleOptionClick(highlightedOption()!);
      } else if (filteredOptions().length === 1) {
        handleOptionClick(filteredOptions()[0]);
      }
      return;
    }

    if (key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      return;
    }

    if (key === 'Home') {
      e.preventDefault();
      if (filteredOptions().length > 0) {
        setHighlightedOption(filteredOptions()[0]);
        scrollToHighlightedOption(0);
      }
      return;
    }

    if (key === 'End') {
      e.preventDefault();
      const lastIndex = filteredOptions().length - 1;
      if (lastIndex >= 0) {
        setHighlightedOption(filteredOptions()[lastIndex]);
        scrollToHighlightedOption(lastIndex);
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
          <div ref={refs.setReference} onClick={handleInputClick} class="relative w-full">
            {layoutProps.inputComponent}
          </div>

          <Show when={isMounted()}>
            <Portal mount={container()}>
              <div
                ref={refs.setFloating}
                class={twMerge(
                  'z-100 w-fit rounded-lg border border-gray-200 bg-white shadow dark:bg-gray-700',
                )}
                style={{
                  ...floatingStyles(),
                  opacity: isVisible() ? '1' : '0',
                  scale: isVisible() ? 1 : 0.8,
                  'transition-property': 'opacity, scale',
                  'transition-duration': '.2s',
                  'transition-timing-function': 'cubic-bezier(.32, .72, 0, 1)',
                }}
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
                      aria-label={props.label || 'Select options'}
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
                          <div class="px-2 py-1.5 text-sm whitespace-nowrap">
                            {props.noSearchResultPlaceholder || 'No results found'}
                          </div>
                        }
                      >
                        {layoutProps.optionsComponent}
                      </For>
                      <LazyLoading isLazyLoading={props.isLazyLoading} />
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
                    aria-label={props.label || 'Select options'}
                    loading={<LazyLoading isLazyLoading={props.isLazyLoading} />}
                    setScrollPosition={setScrollTop}
                    fallback={
                      <div class="px-2 py-1.5 text-sm whitespace-nowrap">
                        {props.noSearchResultPlaceholder || 'No results found'}
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
  };
};

export default useSelect;
