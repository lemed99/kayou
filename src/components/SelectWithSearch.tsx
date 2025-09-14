import { For, Show, createEffect, createSignal, onCleanup } from 'solid-js';

import { twMerge } from 'tailwind-merge';

import TextInput from './TextInput';

export interface SelectWithSearchProps {
  options: Array<{ value: any; label: string }>;
  onSelect: (option: any) => void;
  onClear?: () => void;
  target?: string;
  autoFillSearchKey?: boolean;
  idValue?: string;
  value?: string;
  reset?: boolean;
  setResetInput?: (state: boolean) => void;
  placeholder?: string;
  classNames?: {
    resultsContainer?: string;
    wrapper?: string;
  };
}

export default function SelectWithSearch(props: SelectWithSearchProps) {
  const [searchKey, setSearchKey] = createSignal('');
  const [selectedOption, setSelectedOption] = createSignal(null);
  const [filteredOptions, setFilteredOptions] = createSignal(props.options);
  const [isPopoverVisible, setIsPopoverVisible] = createSignal(true);
  const [barcodeScanned, setBarcodeScanned] = createSignal(false);

  let inputRef;

  const handleClickOutside = (e) => {
    const container = document.querySelector('[data-select-results]');
    if (container && !container.contains(e.target) && !inputRef.contains(e.target)) {
      setIsPopoverVisible(false);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  onCleanup(() => {
    document.removeEventListener('mousedown', handleClickOutside);
  });

  createEffect(() => {
    if (props.idValue && !props.reset) {
      const opt = props.options.find((o) => o.value == props.idValue);
      if (opt) setSearchKey(opt.label);
    } else if (props.value && !props.reset) {
      setSearchKey(props.value);
    } else if (props.reset) {
      setSearchKey('');
      props.setResetInput?.(false);
    }
  });

  createEffect(() => {
    if (barcodeScanned()) {
      setTimeout(() => setBarcodeScanned(false), 1000);
    }
  });

  const handleSearchChange = (e) => {
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
    }
    setSelectedOption(null);
    if (!isPopoverVisible()) setIsPopoverVisible(true);
  };

  const handleOptionClick = (option) => {
    if (props.autoFillSearchKey) setSearchKey(option.label);
    setSelectedOption(option);
    props.onSelect(option);
    setIsPopoverVisible(false);
  };

  return (
    <div class={twMerge('relative max-w-96', props.classNames?.wrapper)}>
      <TextInput
        ref={inputRef}
        type="search"
        value={searchKey()}
        onInput={handleSearchChange}
        placeholder={props.placeholder}
        onClick={() => {
          setIsPopoverVisible(true);
          if (!searchKey()) setFilteredOptions(props.options);
        }}
        onBlur={() => {
          if (!searchKey() && props.onClear) props.onClear();
          props.onSelect({ value: '', label: searchKey() });
        }}
        onFocus={(e) => e.target.select()}
        class="w-full"
        {...props}
      />

      <Show when={isPopoverVisible()}>
        <div
          data-select-results
          class={twMerge(
            'absolute top-full right-0 left-0 z-10 mt-1',
            'box-border max-h-[200px] overflow-y-auto rounded-lg border border-gray-300 bg-gray-50 shadow-xl',
            'scrollbar-thin scrollbar-track-gray-50 scrollbar-thumb-gray-400 dark:scrollbar-track-gray-700 dark:scrollbar-thumb-gray-500 dark:bg-gray-700',
            props.classNames?.resultsContainer,
          )}
        >
          <For
            each={filteredOptions()}
            fallback={<div class="px-2.5 text-sm">Aucun resultat</div>}
          >
            {(option) => (
              <div
                class={twMerge(
                  'cursor-default px-2.5 py-1 text-sm hover:bg-blue-500 hover:text-white',
                  selectedOption()?.value == option.value ? 'bg-blue-500 text-white' : '',
                )}
                onClick={() => handleOptionClick(option)}
              >
                {option.label}
              </div>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
}
