import { JSX, Show, createEffect, createSignal, onCleanup } from 'solid-js';

import { autoPlacement, createFloating, offset } from 'floating-ui-solid';
import { twMerge } from 'tailwind-merge';

import HelperText from '../components/HelperText';
import { TextInputProps } from '../components/TextInput';
import { getScrollProgress } from '../helpers';
import {
  CTA,
  LazyLoading,
  type Option,
  optionsContainerClass,
} from '../helpers/selectUtils';

interface MergedSelectProps extends Omit<TextInputProps, 'onSelect'> {
  options: Option[];
  helperText?: string;
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
    if (type === 'multiSelect' && props.values && props.values.length > 0) {
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
      setSelectedOption(null);
      if (!isOpen()) setIsOpen(true);
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
      if (type === 'selectWithSearch' && !searchKey()) setFilteredOptions(props.options);
      if (type === 'multiSelect' && props.withSearch === true) {
        (searchRef() as HTMLElement)?.focus();
        if (!searchKey()) setFilteredOptions(props.options);
      }
    }
  };

  const { refs, placement: finalPlacement } = createFloating({
    isOpen: isOpen,
    middleware: [
      offset(4),
      autoPlacement({
        allowedPlacements: ['top-start', 'bottom-start', 'top-end', 'bottom-end'],
      }),
    ],
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
      currentTarget: HTMLInputElement;
      target: Element;
    },
  ) => {
    const { key } = e;

    if (key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedOption((prev) => {
        if (filteredOptions().length === 0) return null;
        if (!prev) return filteredOptions()[filteredOptions().length - 1];
        const currentIndex = filteredOptions().findIndex((o) => o.value === prev.value);
        if (currentIndex === 0) {
          return prev;
        }
        if (currentIndex === -1) {
          return filteredOptions()[filteredOptions().length - 1];
        }
        return filteredOptions()[currentIndex - 1];
      });
      return;
    }

    if (key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedOption((prev) => {
        if (filteredOptions().length === 0) return null;
        if (!prev) return filteredOptions()[0];
        const currentIndex = filteredOptions().findIndex((o) => o.value === prev.value);
        if (currentIndex === filteredOptions().length - 1) {
          return prev;
        }
        if (currentIndex === -1) {
          return filteredOptions()[0];
        }
        return filteredOptions()[currentIndex + 1];
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
  };

  const getFloatingClass = () => {
    switch (finalPlacement()) {
      case 'top-start':
        return 'bottom-full mb-1';
      case 'bottom-start':
        return 'top-full mt-1';
      case 'top-end':
        return 'right-0 bottom-full mb-1';
      case 'bottom-end':
        return 'top-full right-0 mt-1';
      default:
        return '';
    }
  };

  const Layout = (layoutProps: {
    inputComponent: JSX.Element;
    optionsComponent: JSX.Element;
    preOptionsComponent?: JSX.Element;
  }) => {
    return (
      <div class="w-full">
        <div class="relative w-full">
          <div ref={refs.setReference} onClick={handleInputClick} class="relative w-full">
            {layoutProps.inputComponent}
          </div>

          <Show when={isOpen()}>
            <div
              ref={refs.setFloating}
              class={twMerge(
                'absolute z-50 w-fit rounded-lg border border-gray-200 bg-white shadow dark:bg-gray-700',
                getFloatingClass(),
              )}
            >
              {layoutProps.preOptionsComponent}
              <div ref={setOptionsContainerRef} class={optionsContainerClass}>
                {layoutProps.optionsComponent}
                <LazyLoading isLazyLoading={props.isLazyLoading} />
              </div>
              <CTA cta={props.cta} />
            </div>
          </Show>
        </div>
        <Show when={props.helperText}>
          <HelperText content={props.helperText as string} color={props.color} />
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
