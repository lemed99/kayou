import { JSX, Show, createEffect, createMemo, createSignal, splitProps } from 'solid-js';

import { SearchRefractionIcon } from '@kayou/icons';
import { twMerge } from 'tailwind-merge';

import { ChevronDownButton, ClearContentButton, type Option } from '../../shared';
import Checkbox from '../Checkbox';
import TextInput, { type TextInputProps } from '../TextInput';
import { groupHeaderClass, groupedOptionIndent, optionClass } from './selectUtils';
import useSelect, {
  DEFAULT_SELECT_ARIA_LABELS,
  type SelectAriaLabels,
  type SelectLabels,
} from './useSelect';

export interface MultiSelectProps
  extends Omit<TextInputProps, 'onSelect' | 'labels' | 'ariaLabels'> {
  /** Array of options to display in the dropdown */
  options: Option[];

  /** Callback fired when selection changes */
  onMultiSelect: (options?: Option[]) => void;

  /** When true, clears all selected values */
  clearValues?: boolean;

  /** Array of currently selected option values */
  values?: string[];

  /** Height in pixels for each option row (enables virtualization for large lists) */
  optionRowHeight?: number;

  /** Enable search/filter functionality in dropdown */
  withSearch?: boolean;

  /** Custom display value to show in the input (overrides computed value) */
  displayValue?: string;

  /** Custom element to render at the bottom of the dropdown */
  cta?: JSX.Element;

  /** Whether more items are currently being loaded (infinite scroll) */
  isLoadingMore?: boolean;

  /** Callback fired when user scrolls near the bottom of the list (infinite scroll) */
  onLoadMore?: (scrollProgress: number) => void;

  /** i18n labels for visible texts */
  labels?: Partial<SelectLabels>;

  /** i18n aria labels for screen-reader-only texts */
  ariaLabels?: Partial<SelectAriaLabels>;

  /** Custom class for the reference (trigger wrapper) element. */
  referenceClass?: string;
  /** Custom class for the floating (dropdown) element. */
  floatingClass?: string;
}

export default function MultiSelect(props: MultiSelectProps): JSX.Element {
  const [local, otherProps] = splitProps(props, [
    'options',
    'onMultiSelect',
    'clearValues',
    'style',
    'values',
    'optionRowHeight',
    'withSearch',
    'displayValue',
    'cta',
    'isLoadingMore',
    'onLoadMore',
    'helperText',
    'label',
    'required',
    'labels',
    'ariaLabels',
  ]);

  const a = createMemo(() => ({ ...DEFAULT_SELECT_ARIA_LABELS, ...local.ariaLabels }));

  const [inputRef, setInputRef] = createSignal<HTMLInputElement | undefined>();

  const {
    Layout,
    highlightedOption,
    handleOptionClick,
    handleGroupToggle,
    setHighlightedOption,
    selectedOptions,
    handleKeyDown,
    searchRef,
    searchKey,
    handleSearchChange,
    setFilteredOptions,
    setSelectedOptions,
    setSearchKey,
    setSearchRef,
    isOpen,
    listboxId,
    searchInputId,
    selectLabels,
  } = useSelect(local, 'multiSelect');

  const getOptionId = (option: Option | null) =>
    option ? `${listboxId}-option-${option.value}` : undefined;

  const displayValue = createMemo(() => {
    const selected = selectedOptions();
    if (selected.length === 0) return '';
    return selected
      .map((o) => o.label)
      .reverse()
      .join(' • ');
  });

  return (
    <Layout
      inputComponent={
        <>
          <TextInput
            {...otherProps}
            ref={setInputRef}
            title={displayValue()}
            disabled={props.disabled}
            value={local.displayValue ?? displayValue()}
            placeholder={props.placeholder}
            class="w-full"
            required={local.required}
            onKeyDown={handleKeyDown}
            role="combobox"
            aria-haspopup="listbox"
            aria-expanded={isOpen()}
            aria-controls={listboxId}
            aria-activedescendant={getOptionId(highlightedOption())}
            inputMode="none"
            autocomplete="off"
            style={{
              'caret-color': 'transparent',
              'padding-right': '36px',
              cursor: props.disabled || props.isLoading ? 'not-allowed' : 'pointer',
              ...(typeof local.style === 'object' && local.style !== null
                ? local.style
                : {}),
            }}
          />
          <Show
            when={
              !local.displayValue && displayValue() && !props.disabled && !props.isLoading
            }
            fallback={
              <ChevronDownButton
                onFocus={() => {
                  (inputRef() as HTMLElement)?.focus();
                }}
                disabled={props.disabled || props.isLoading}
              />
            }
          >
            <ClearContentButton
              onClick={(e: Event) => {
                setSelectedOptions([]);
                local.onMultiSelect([]);
                if (local.withSearch === true) (searchRef() as HTMLElement)?.focus();
                else (inputRef() as HTMLElement)?.focus();
                e.stopPropagation();
              }}
            />
          </Show>
        </>
      }
      preOptionsComponent={
        <Show when={local.withSearch === true}>
          <div class="relative flex min-w-[210px] items-center border-b border-neutral-200 px-3 dark:border-neutral-800">
            <SearchRefractionIcon
              class="size-4 text-neutral-400 dark:text-neutral-500"
              aria-hidden="true"
            />
            <label for={searchInputId} class="sr-only">
              {a().searchOptions}
            </label>
            <input
              id={searchInputId}
              ref={setSearchRef}
              value={searchKey()}
              onInput={handleSearchChange}
              placeholder={selectLabels().searchPlaceholder}
              onFocus={(e) => e.target.select()}
              class="w-full max-w-xs bg-transparent py-3 pl-2 text-sm outline-none dark:text-white"
              onKeyDown={(e) => handleKeyDown(e, true)}
              aria-label={a().searchOptions}
              aria-controls={listboxId}
              aria-activedescendant={getOptionId(highlightedOption())}
            />
            <Show when={searchKey() && !props.disabled && !props.isLoading}>
              <ClearContentButton
                onClick={() => {
                  setSearchKey('');
                  setFilteredOptions(local.options);
                  setHighlightedOption(null);
                  (searchRef() as HTMLElement)?.focus();
                }}
                class="ml-3 h-full cursor-pointer text-neutral-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:text-neutral-500"
              />
            </Show>
          </div>
        </Show>
      }
      groupHeaderComponent={(group, groupOpts, headerId) => {
        const enabled = () => groupOpts.filter((o) => !o.disabled);
        const selectedCount = () =>
          enabled().filter((o) => selectedOptions().some((s) => s.value === o.value))
            .length;
        const allSelected = () =>
          enabled().length > 0 && selectedCount() === enabled().length;
        const someSelected = () => selectedCount() > 0 && !allSelected();

        return (
          <div id={headerId} class={groupHeaderClass}>
            <Checkbox
              ref={(el: HTMLInputElement) => {
                createEffect(() => {
                  el.indeterminate = someSelected();
                });
              }}
              color="dark"
              checked={allSelected()}
              onChange={() => handleGroupToggle(groupOpts)}
              label={group}
              labelClass="w-full font-normal cursor-pointer"
              labelSpanClass="text-neutral-400 dark:text-neutral-500"
            />
          </div>
        );
      }}
      optionsComponent={(option) => (
        <div
          id={getOptionId(option)}
          role="option"
          aria-selected={selectedOptions().some((o) => o.value === option.value)}
          aria-disabled={option.disabled || undefined}
          class={twMerge(optionClass(option, highlightedOption()), 'p-0')}
          onMouseEnter={() => !option.disabled && setHighlightedOption(option)}
        >
          <Checkbox
            labelClass={twMerge(
              'px-2 py-1.5 w-full font-normal',
              option.group != null && groupedOptionIndent,
            )}
            class="flex items-center"
            onChange={() => handleOptionClick(option)}
            checked={selectedOptions().some((o) => o.value === option.value)}
            disabled={option.disabled}
            label={option.labelWrapper ? option.labelWrapper(option.label) : option.label}
          />
        </div>
      )}
      groupSpacerClass="h-3"
    />
  );
}
