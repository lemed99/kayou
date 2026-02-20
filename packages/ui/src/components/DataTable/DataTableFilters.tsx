import {
  Accessor,
  For,
  Index,
  JSX,
  Match,
  Show,
  Switch,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
} from 'solid-js';

import {
  ChevronDownIcon,
  FilterFunnel01Icon,
  InfoCircleIcon,
  PlusIcon,
  XCloseIcon,
} from '@kayou/icons';
import { twMerge } from 'tailwind-merge';

import { type Option } from '../../shared';
import Alert from '../Alert';
import Button from '../Button';
import DatePicker from '../DatePicker';
import NumberInput from '../NumberInput';
import Popover from '../Popover';
import Select, { MultiSelect, SelectWithSearch } from '../Select';
import TextInput from '../TextInput';
import {
  ActiveFilter,
  FilterConfig,
  FilterOperator,
  FilterState,
  FilterValue,
  OPERATOR_LABELS,
} from './types';

export interface DataTableFiltersLabels {
  enterValue: string;
  min: string;
  max: string;
  enterNumber: string;
  select: string;
  search: string;
  selectDate: string;
  selectRange: string;
  noResultsFound: string;
  noFiltersApplied: string;
  and: string;
  addFilter: string;
  reset: string;
  filter: string;
  unsupportedFieldType: (type: string) => string;
  /** Override operator labels for i18n. Merged with OPERATOR_LABELS defaults. */
  operatorLabels?: Partial<Record<FilterOperator, string>>;
}

export const DEFAULT_DATA_TABLE_FILTERS_LABELS: DataTableFiltersLabels = {
  enterValue: 'Enter a value',
  min: 'Min',
  max: 'Max',
  enterNumber: 'Enter a number',
  select: 'Select',
  search: 'Search',
  selectDate: 'Select a date',
  selectRange: 'Select a range',
  noResultsFound: 'No results found',
  noFiltersApplied: 'No filters applied',
  and: 'And',
  addFilter: 'Add filter',
  reset: 'Reset',
  filter: 'Filter',
  unsupportedFieldType: (type: string) => `Unsupported field type: ${type}`,
};

export interface DataTableFiltersAriaLabels {
  column: string;
  operator: string;
  removeFilter: string;
}

export const DEFAULT_DATA_TABLE_FILTERS_ARIA_LABELS: DataTableFiltersAriaLabels = {
  column: 'Column',
  operator: 'Operator',
  removeFilter: 'Remove filter',
};

interface FilterInputProps<T> {
  config: FilterConfig<T>;
  filter: ActiveFilter;
  onChange: (value: FilterValue) => void;
  labels: DataTableFiltersLabels;
}

function FilterInput<T>(props: FilterInputProps<T>): JSX.Element {
  const betweenValues = createMemo((): [number | null, number | null] => {
    const v = props.filter.value;
    if (Array.isArray(v) && v.length === 2) return v as [number | null, number | null];
    return [null, null];
  });

  const dateRangeValues = createMemo((): [string, string] => {
    const v = props.filter.value;
    if (Array.isArray(v) && v.length === 2) {
      const toStr = (d: unknown): string => {
        if (d instanceof Date) return d.toISOString().split('T')[0];
        if (typeof d === 'string') return d;
        return '';
      };
      return [toStr(v[0]), toStr(v[1])];
    }
    return ['', ''];
  });

  const singleDateValue = createMemo((): string => {
    const v = props.filter.value;
    if (v instanceof Date) return v.toISOString().split('T')[0];
    if (typeof v === 'string') return v;
    return '';
  });

  const isDateType = createMemo(
    () =>
      props.config.fieldType === 'datepicker' || props.config.fieldType === 'dateRange',
  );

  const isEmptyOrNotEmptyOperators = createMemo(
    () => props.filter.operator === 'isNull' || props.filter.operator === 'isNotNull',
  );

  return (
    <Switch
      fallback={
        <span class="text-sm text-neutral-500 dark:text-neutral-400">
          {props.labels.unsupportedFieldType(props.config.fieldType)}
        </span>
      }
    >
      <Match when={props.config.fieldType === 'text' && !isEmptyOrNotEmptyOperators()}>
        <TextInput
          value={(props.filter.value as string) || ''}
          onInput={(e) => props.onChange(e.currentTarget.value)}
          placeholder={props.config.placeholder || props.labels.enterValue}
          sizing="sm"
          class="flex-1"
          disabled={props.filter.value === 'true'}
        />
      </Match>

      <Match when={isEmptyOrNotEmptyOperators()}>
        <TextInput
          value={'true'}
          placeholder={props.config.placeholder || props.labels.enterValue}
          sizing="sm"
          class="flex-1"
          disabled
        />
      </Match>

      <Match
        when={
          props.config.fieldType === 'number' &&
          props.filter.operator === 'between' &&
          !isEmptyOrNotEmptyOperators()
        }
      >
        <div class="flex flex-1 items-center gap-1 rounded-lg border border-neutral-300 bg-neutral-50 p-1 dark:border-neutral-700 dark:bg-neutral-800">
          <NumberInput
            value={betweenValues()[0] != null ? String(betweenValues()[0]) : ''}
            onValueChange={(v) => props.onChange([v ?? null, betweenValues()[1]])}
            placeholder={props.labels.min}
            sizing="sm"
            type={props.config.numberConfig?.type || 'integer'}
            class="w-[80px]"
            inputClass="border-0 bg-transparent dark:border-transparent dark:bg-transparent py-1 focus:outline-0 dark:outline-0"
          />
          <span class="text-neutral-500 dark:text-neutral-400">|</span>
          <NumberInput
            value={betweenValues()[1] != null ? String(betweenValues()[1]) : ''}
            onValueChange={(v) => props.onChange([betweenValues()[0], v ?? null])}
            placeholder={props.labels.max}
            sizing="sm"
            type={props.config.numberConfig?.type || 'integer'}
            class="w-[80px]"
            inputClass="border-0 bg-transparent dark:border-transparent dark:bg-transparent py-1 focus:outline-0 dark:outline-0"
          />
        </div>
      </Match>

      <Match
        when={
          props.config.fieldType === 'number' &&
          props.filter.operator !== 'between' &&
          !isEmptyOrNotEmptyOperators()
        }
      >
        <NumberInput
          value={(props.filter.value as number)?.toString() || ''}
          onValueChange={(v) => props.onChange(v)}
          placeholder={props.config.placeholder || props.labels.enterNumber}
          sizing="sm"
          type={props.config.numberConfig?.type || 'integer'}
          min={props.config.numberConfig?.min}
          max={props.config.numberConfig?.max}
          step={props.config.numberConfig?.step}
          class="flex-1"
        />
      </Match>

      <Match when={props.config.fieldType === 'select' && !isEmptyOrNotEmptyOperators()}>
        <Select
          options={props.config.options || []}
          value={(props.filter.value as string) || ''}
          onSelect={(option) => props.onChange(option?.value ?? null)}
          placeholder={props.config.placeholder || props.labels.select}
          sizing="sm"
          class="flex-1"
        />
      </Match>

      <Match
        when={props.config.fieldType === 'selectSearch' && !isEmptyOrNotEmptyOperators()}
      >
        <SelectWithSearch
          options={props.config.options || []}
          value={(props.filter.value as string) || ''}
          onSelect={(option) => props.onChange(option?.value ?? null)}
          placeholder={props.config.placeholder || props.labels.search}
          sizing="sm"
          class="flex-1"
        />
      </Match>

      <Match
        when={props.config.fieldType === 'multiSelect' && !isEmptyOrNotEmptyOperators()}
      >
        <MultiSelect
          options={props.config.options || []}
          values={(props.filter.value as string[]) || []}
          onMultiSelect={(options) => props.onChange(options?.map((o) => o.value) || [])}
          placeholder={props.config.placeholder || props.labels.select}
          sizing="sm"
          class="flex-1"
        />
      </Match>

      {/* Date types: operator determines single vs range input */}
      <Match
        when={
          isDateType() &&
          props.filter.operator === 'between' &&
          !isEmptyOrNotEmptyOperators()
        }
      >
        <DatePicker
          type="range"
          value={{
            startDate: dateRangeValues()[0],
            endDate: dateRangeValues()[1],
          }}
          onChange={(v) => {
            if (v.startDate && v.endDate) {
              props.onChange([v.startDate, v.endDate]);
            } else {
              props.onChange(null);
            }
          }}
          placeholder={props.config.placeholder || props.labels.selectRange}
          locale={props.config.dateConfig?.locale || 'en'}
          inputClass="min-w-[200px] flex-1"
        />
      </Match>

      <Match
        when={
          isDateType() &&
          props.filter.operator !== 'between' &&
          !isEmptyOrNotEmptyOperators()
        }
      >
        <DatePicker
          type="single"
          value={{ date: singleDateValue() }}
          onChange={(v) => props.onChange(v.date || null)}
          placeholder={props.config.placeholder || props.labels.selectDate}
          locale={props.config.dateConfig?.locale || 'en'}
          inputClass="min-w-[150px] flex-1"
        />
      </Match>
    </Switch>
  );
}

interface DraftFilter {
  key: string;
  operator: FilterOperator;
  value: FilterValue;
}

interface FilterRowProps<T> {
  filter: DraftFilter;
  filterConfigs: FilterConfig<T>[];
  /** Keys already used by other draft filter rows. */
  usedKeys: Set<string>;
  // onColumnChange: (key: string) => void;
  onOperatorChange: (operator: FilterOperator) => void;
  onValueChange: (value: FilterValue) => void;
  onRemove: () => void;
  getOperators: (key: string) => FilterOperator[];
  labels: DataTableFiltersLabels;
  ariaLabels: DataTableFiltersAriaLabels;
  operatorLabels: Record<FilterOperator, string>;
}

function FilterRow<T>(props: FilterRowProps<T>): JSX.Element {
  const config = createMemo(() =>
    props.filterConfigs.find((fc) => fc.key === props.filter.key),
  );

  // Show current column + columns not used by other rows
  // const columnOptions = createMemo<Option[]>(() =>
  //   props.filterConfigs
  //     .filter((fc) => fc.key === props.filter.key || !props.usedKeys.has(fc.key))
  //     .map((fc) => ({
  //       value: fc.key,
  //       label: fc.label,
  //     })),
  // );

  const operatorOptions = createMemo<Option[]>(() => {
    const operators = props.getOperators(props.filter.key || '');
    return operators.map((op) => ({
      value: op,
      label: props.operatorLabels[op],
    }));
  });

  // const needsInput = createMemo(
  //   () => props.filter.operator !== 'isEmpty' && props.filter.operator !== 'isNotEmpty',
  // );

  return (
    <div class="space-y-2">
      <h5 class="text-sm font-semibold capitalize">{props.filter.key}</h5>
      <div class="grid grid-cols-[1fr_1fr_28px] items-center gap-2">
        {/* Column selector */}

        {/* Operator selector */}
        <Select
          options={operatorOptions()}
          value={props.filter.operator}
          onSelect={(option) => {
            if (option?.value) {
              props.onOperatorChange(option.value as FilterOperator);
            }
          }}
          placeholder={props.ariaLabels.operator}
          sizing="sm"
          class=""
        />

        {/* Value input */}
        <Show when={config()} fallback={<div class="h-full" />}>
          <FilterInput
            config={config()!}
            filter={props.filter as ActiveFilter}
            onChange={props.onValueChange}
            labels={props.labels}
          />
        </Show>

        {/* Remove button */}
        <button
          type="button"
          onClick={() => props.onRemove()}
          class="shrink-0 rounded p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-neutral-500 dark:hover:bg-neutral-700 dark:hover:text-neutral-300"
          aria-label={props.ariaLabels.removeFilter}
        >
          <XCloseIcon class="size-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export interface DataTableFiltersProps<T> {
  /** Filter configurations. */
  filterConfigs: FilterConfig<T>[];
  /** Current active filters. */
  activeFilters: Accessor<FilterState>;
  /** Set or update a filter. */
  setFilter: (key: string, operator: FilterOperator, value: FilterValue) => void;
  /** Remove a filter by key. */
  removeFilter: (key: string) => void;
  /** Clear all filters. */
  clearFilters: () => void;
  /** Replace all filters at once (single update). */
  replaceAllFilters: (filters: FilterState) => void;
  /** Get available operators for a filter. */
  getOperators: (key: string) => FilterOperator[];
  /** Text for the "Filter" button label. */
  filterButtonText?: string;
  /** Text for the "Add filter" link. */
  addFilterText?: string;
  /** Text for the "Reset" button. */
  resetText?: string;
  /** Text for the "Apply filters" button. */
  applyText?: string;
  /** Text shown when no filters are applied. */
  noFiltersText?: string;
  /** Custom class for the container. */
  class?: string;
  /** Whether to show active filter chips inline next to the button. */
  showChips?: boolean;
  /** Maximum number of chips to show before overflow. @default 4 */
  maxVisibleChips?: number;
  /** Text for the "See more" overflow toggle. @default "See more" */
  seeMoreChipsText?: string;
  /** Text for the "See less" overflow toggle. @default "See less" */
  seeLessChipsText?: string;
  /** i18n labels for visible text in the DataTableFilters UI. */
  labels?: Partial<DataTableFiltersLabels>;
  /** i18n aria-labels for the DataTableFilters UI. */
  ariaLabels?: Partial<DataTableFiltersAriaLabels>;
}

export function DataTableFilters<T>(props: DataTableFiltersProps<T>): JSX.Element {
  const l = createMemo(() => ({ ...DEFAULT_DATA_TABLE_FILTERS_LABELS, ...props.labels }));
  const a = createMemo(() => ({
    ...DEFAULT_DATA_TABLE_FILTERS_ARIA_LABELS,
    ...props.ariaLabels,
  }));
  // Merge default operator labels with i18n overrides
  const opLabels = createMemo(
    () =>
      ({ ...OPERATOR_LABELS, ...l().operatorLabels }) as Record<FilterOperator, string>,
  );

  // Draft filters - local state for editing before submit
  const [draftFilters, setDraftFilters] = createSignal<DraftFilter[]>([]);
  const [isOpen, setIsOpen] = createSignal(false);
  const [popoverRef, setPopoverRef] = createSignal<HTMLDivElement | undefined>();

  // Track which columns are already used by draft rows
  const usedKeys = createMemo(() => new Set(draftFilters().map((f) => f.key)));

  // Track if all column have been used
  const maxColumns = () => props.filterConfigs.length;
  const allKeysAreUsed = () => draftFilters().length === maxColumns();

  const columnOptions = createMemo<Option[]>(() =>
    props.filterConfigs
      .filter((fc) => !usedKeys().has(fc.key))
      .map((fc) => ({
        value: fc.key,
        label: fc.label,
      })),
  );

  // Sync draft filters when popover opens
  const handlePopoverOpen = () => {
    const currentFilters = props.activeFilters();
    const draft: DraftFilter[] = [];
    currentFilters.forEach((filter) => {
      draft.push({
        key: filter.key,
        operator: filter.operator,
        value: filter.value,
      });
    });
    setDraftFilters(draft);
    setIsOpen(true);
  };

  // const handleAddFilter = () => {
  //   // Pick the first unused column
  //   const currentUsedKeys = usedKeys();
  //   const availableConfig = props.filterConfigs.find(
  //     (fc) => !currentUsedKeys.has(fc.key),
  //   );
  //   if (!availableConfig) return;

  //   // const operators = props.getOperators(availableConfig.key);
  //   // const defaultOperator = availableConfig.defaultOperator || operators[0] || 'equal';

  //   setDraftFilters((prev) => [
  //     ...prev,
  //     {
  //       key: '',
  //       operator: '',
  //       value: null,
  //     },
  //   ]);
  // };

  const handleColumnChange = (newKey: string) => {
    const config = props.filterConfigs.find((fc) => fc.key === newKey);
    if (!config) return;

    const operators = props.getOperators(newKey);
    const defaultOperator = config.defaultOperator || operators[0] || 'equal';

    setDraftFilters((prev) => {
      const updated = [...prev];
      updated.push({
        key: newKey,
        operator: defaultOperator,
        value: null,
      });
      return updated;
    });
  };

  const handleOperatorChange = (index: number, operator: FilterOperator) => {
    setDraftFilters((prev) => {
      const updated = [...prev];
      const current = updated[index];
      const noValue = operator === 'isNull' || operator === 'isNotNull';
      const wasBetween = current.operator === 'between';
      const isBetween = operator === 'between';
      // Reset value when switching to/from between (incompatible types) or to isEmpty/isNotEmpty
      const resetValue = noValue || wasBetween !== isBetween;
      updated[index] = {
        ...current,
        operator,
        value: resetValue ? null : current.value,
      };
      return updated;
    });
  };

  const handleValueChange = (index: number, value: FilterValue) => {
    setDraftFilters((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        value,
      };
      return updated;
    });
  };

  const handleRemoveFilter = (index: number) => {
    setDraftFilters((prev) => prev.filter((_, i) => i !== index));
  };

  const handleReset = () => {
    setDraftFilters([]);
    props.replaceAllFilters(new Map());
    setIsOpen(false);
  };

  const handleApply = () => {
    const newFilters: FilterState = new Map();
    draftFilters().forEach((filter) => {
      newFilters.set(filter.key, {
        key: filter.key,
        operator: filter.operator,
        value: filter.value,
      });
    });
    props.replaceAllFilters(newFilters);
    setIsOpen(false);
  };

  const activeFilterCount = createMemo(() => props.activeFilters().size);

  const handleToggle = () => {
    if (isOpen()) {
      setIsOpen(false);
    } else {
      handlePopoverOpen();
    }
  };

  // Handle click outside to close popover
  // We need custom handling because Select dropdowns render in Portals
  createEffect(() => {
    if (!isOpen()) return;

    const handleClickOutside = (event: PointerEvent) => {
      const target = event.target as HTMLElement;

      // Don't close if clicking inside a dropdown/listbox (Select options)
      if (target.closest('[role="listbox"]') || target.closest('[role="option"]')) {
        return;
      }

      // Don't close if clicking inside the popover content
      const popoverEl = popoverRef();
      if (popoverEl && popoverEl.contains(target)) {
        return;
      }

      // Don't close if clicking the trigger button
      if (target.closest('[data-filter-trigger]')) {
        return;
      }

      setIsOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    // Use setTimeout to avoid closing immediately on the same click that opened it
    const timeoutId = setTimeout(() => {
      document.addEventListener('pointerdown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }, 0);

    onCleanup(() => {
      clearTimeout(timeoutId);
      document.removeEventListener('pointerdown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    });
  });

  // Move focus into popover when it opens
  createEffect(() => {
    if (!isOpen()) return;
    const rafId = requestAnimationFrame(() => {
      const el = popoverRef();
      if (!el) return;
      const focusable = el.querySelector<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      focusable?.focus();
    });
    onCleanup(() => cancelAnimationFrame(rafId));
  });

  const popoverContentWithAttr = () => (
    <div
      ref={setPopoverRef}
      data-filter-popover
      class="max-w-[calc(100dvw-32px)] rounded-lg bg-white p-4 shadow-lg ring-1 ring-neutral-200 dark:bg-neutral-900 dark:ring-neutral-700"
    >
      <Alert color="info" class="mb-4">
        Filters refine your results all selected criteria must apply.
      </Alert>

      {/* Filter rows */}
      <div class="mb-4 space-y-3">
        <Show
          when={draftFilters().length > 0}
          fallback={
            <div class="flex items-center gap-2 py-2">
              <InfoCircleIcon
                class="size-5 text-neutral-400 dark:text-neutral-500"
                aria-hidden="true"
              />
              <span class="text-sm text-neutral-500 dark:text-neutral-400">
                {props.noFiltersText || l().noFiltersApplied}
              </span>
            </div>
          }
        >
          <Index each={draftFilters()}>
            {(filter, index) => (
              <>
                {/* <Show when={index > 0}>
                  <div class="flex items-center py-1">
                    <span class="rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                      {l().and.toUpperCase()}
                    </span>
                  </div>
                </Show> */}
                <FilterRow
                  filter={filter()}
                  filterConfigs={props.filterConfigs}
                  usedKeys={usedKeys()}
                  // onColumnChange={(key) => handleColumnChange(index, key)}
                  onOperatorChange={(op) => handleOperatorChange(index, op)}
                  onValueChange={(val) => handleValueChange(index, val)}
                  onRemove={() => handleRemoveFilter(index)}
                  getOperators={props.getOperators}
                  labels={l()}
                  ariaLabels={a()}
                  operatorLabels={opLabels()}
                />
              </>
            )}
          </Index>
        </Show>
      </div>

      {/* Footer with actions */}
      <div class="flex items-center justify-between border-t border-neutral-200 pt-4 dark:border-neutral-800">
        <Show when={!allKeysAreUsed()}>
          <Select
            options={columnOptions()}
            onSelect={(option) => {
              if (option?.value) {
                handleColumnChange(option.value);
              }
            }}
            placeholder={a().column}
            sizing="sm"
            class=""
            inputComponent={() => (
              <button
                type="button"
                // onClick={handleAddFilter}
                class="flex cursor-pointer items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <PlusIcon class="size-4" aria-hidden="true" />
                {props.addFilterText || l().addFilter}
              </button>
            )}
          />
          {/* <button
            type="button"
            onClick={handleAddFilter}
            class="flex cursor-pointer items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <PlusIcon class="size-4" aria-hidden="true" />
            {props.addFilterText || l().addFilter}
          </button> */}
        </Show>

        <div class="ml-auto flex items-center gap-2 justify-self-end">
          <Button size="sm" color="transparent" onClick={handleReset}>
            {props.resetText || l().reset}
          </Button>
          <Button size="sm" onClick={handleApply}>
            {props.applyText || l().filter}
          </Button>
        </div>
      </div>
    </div>
  );

  const maxChips = () => props.maxVisibleChips ?? 4;
  const [showAllChips, setShowAllChips] = createSignal(false);

  const activeFiltersList = createMemo(() => Array.from(props.activeFilters().values()));

  const visibleChips = createMemo(() => {
    const all = activeFiltersList();
    if (showAllChips() || all.length <= maxChips()) return all;
    return all.slice(0, maxChips());
  });

  const overflowCount = createMemo(() => {
    const all = activeFiltersList();
    if (all.length <= maxChips()) return 0;
    return all.length - maxChips();
  });

  const getChipLabel = (filter: ActiveFilter): string => {
    const config = props.filterConfigs.find((fc) => fc.key === filter.key);
    const label = config?.label || filter.key;
    const op = opLabels()[filter.operator];
    const value = filter.value;
    if (value === null || value === undefined) return `${label} ${op}`;
    if (Array.isArray(value)) return `${label} ${op} ${value.join(', ')}`;
    return `${label} ${op} ${String(value)}`;
  };

  return (
    <div class={twMerge('flex min-w-0 flex-wrap items-center gap-2', props.class)}>
      {/* Screen reader announcement for filter changes */}
      <div aria-live="polite" class="sr-only">
        {activeFilterCount() > 0
          ? `${activeFilterCount()} filter${activeFilterCount() !== 1 ? 's' : ''} applied`
          : 'No filters applied'}
      </div>

      <Popover position="bottom-start" content={popoverContentWithAttr} isOpen={isOpen()}>
        <div data-filter-trigger>
          <Button
            size="sm"
            color="transparent"
            icon={FilterFunnel01Icon}
            onClick={handleToggle}
            aria-expanded={isOpen()}
            aria-label={
              activeFilterCount() > 0
                ? `${props.filterButtonText || l().filter} (${activeFilterCount()})`
                : undefined
            }
          >
            {props.filterButtonText || l().filter}
            <Show when={activeFilterCount() > 0}>
              <span
                aria-hidden="true"
                class="ml-1.5 rounded-full bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300"
              >
                {activeFilterCount()}
              </span>
            </Show>
          </Button>
        </div>
      </Popover>

      {/* Inline filter chips */}
      <Show when={props.showChips && activeFilterCount() > 0}>
        <For each={visibleChips()}>
          {(filter) => {
            const chipConfig = () =>
              props.filterConfigs.find((fc) => fc.key === filter.key);
            return (
              <span class="inline-flex items-center gap-1 rounded-md border border-neutral-200 bg-white px-2 py-1 text-xs font-medium text-neutral-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                {getChipLabel(filter)}
                <button
                  type="button"
                  onClick={() => props.removeFilter(filter.key)}
                  class="ml-0.5 rounded-sm text-neutral-400 hover:text-neutral-600 focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 dark:text-neutral-500 dark:hover:text-neutral-300"
                  aria-label={`Remove ${chipConfig()?.label || filter.key} filter`}
                >
                  <XCloseIcon class="size-3" aria-hidden="true" />
                </button>
              </span>
            );
          }}
        </For>

        {/* Overflow toggle */}
        <Show when={overflowCount() > 0}>
          <button
            type="button"
            onClick={() => setShowAllChips((v) => !v)}
            class="inline-flex items-center gap-0.5 text-xs font-medium text-neutral-500 hover:text-neutral-700 focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 dark:text-neutral-400 dark:hover:text-neutral-200"
          >
            {showAllChips()
              ? (props.seeLessChipsText ?? 'See less')
              : (props.seeMoreChipsText ?? 'See more')}
            <ChevronDownIcon
              class={twMerge(
                'size-3 transition-transform',
                showAllChips() ? 'rotate-180' : '',
              )}
              aria-hidden="true"
            />
          </button>
        </Show>

        {/* Add shortcut */}
        <button
          type="button"
          onClick={() => {
            handlePopoverOpen();
          }}
          class="inline-flex items-center gap-0.5 text-xs font-medium text-neutral-500 hover:text-neutral-700 focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 dark:text-neutral-400 dark:hover:text-neutral-200"
        >
          {props.addFilterText || l().addFilter}
          <PlusIcon class="size-3" aria-hidden="true" />
        </button>
      </Show>
    </div>
  );
}
