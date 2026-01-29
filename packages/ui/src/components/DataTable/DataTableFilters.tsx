import {
  Accessor,
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

import { FilterFunnel01Icon, InfoCircleIcon, PlusIcon, XCloseIcon } from '@kayou/icons';
import { twMerge } from 'tailwind-merge';

import { type Option } from '../../shared';
import Button from '../Button';
import DatePicker from '../DatePicker';
import NumberInput from '../NumberInput';
import Popover from '../Popover';
import Select, { MultiSelect, SelectWithSearch } from '../Select';
import TextInput from '../TextInput';
import {
  ActiveFilter,
  DEFAULT_OPERATORS,
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
  const dateValues = createMemo(() => props.filter.value as [Date, Date] | null);
  const betweenValues = createMemo(
    () => (props.filter.value as [number, number]) || [null, null],
  );

  return (
    <Switch
      fallback={
        <span class="text-sm text-gray-500 dark:text-neutral-400">
          {props.labels.unsupportedFieldType(props.config.fieldType)}
        </span>
      }
    >
      <Match when={props.config.fieldType === 'text'}>
        <TextInput
          value={(props.filter.value as string) || ''}
          onInput={(e) => props.onChange(e.currentTarget.value)}
          placeholder={props.config.placeholder || props.labels.enterValue}
          sizing="sm"
          class="min-w-[150px] flex-1"
        />
      </Match>

      <Match
        when={props.config.fieldType === 'number' && props.filter.operator === 'between'}
      >
        <div class="flex flex-1 items-center gap-1">
          <NumberInput
            value={betweenValues()[0]?.toString() || ''}
            onValueChange={(v) => props.onChange([v ?? 0, betweenValues()[1] ?? 0])}
            placeholder={props.labels.min}
            sizing="sm"
            type={props.config.numberConfig?.type || 'integer'}
            class="w-[80px]"
          />
          <span class="text-gray-500 dark:text-neutral-400">-</span>
          <NumberInput
            value={betweenValues()[1]?.toString() || ''}
            onValueChange={(v) => props.onChange([betweenValues()[0] ?? 0, v ?? 0])}
            placeholder={props.labels.max}
            sizing="sm"
            type={props.config.numberConfig?.type || 'integer'}
            class="w-[80px]"
          />
        </div>
      </Match>

      <Match
        when={props.config.fieldType === 'number' && props.filter.operator !== 'between'}
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
          class="min-w-[100px] flex-1"
        />
      </Match>

      <Match when={props.config.fieldType === 'select'}>
        <Select
          options={props.config.options || []}
          value={(props.filter.value as string) || ''}
          onSelect={(option) => props.onChange(option?.value || null)}
          placeholder={props.config.placeholder || props.labels.select}
          sizing="sm"
          class="min-w-[150px] flex-1"
        />
      </Match>

      <Match when={props.config.fieldType === 'selectSearch'}>
        <SelectWithSearch
          options={props.config.options || []}
          value={(props.filter.value as string) || ''}
          onSelect={(option) => props.onChange(option?.value || null)}
          placeholder={props.config.placeholder || props.labels.search}
          sizing="sm"
          class="min-w-[150px] flex-1"
        />
      </Match>

      <Match when={props.config.fieldType === 'multiSelect'}>
        <MultiSelect
          options={props.config.options || []}
          values={(props.filter.value as string[]) || []}
          onMultiSelect={(options) => props.onChange(options?.map((o) => o.value) || [])}
          placeholder={props.config.placeholder || props.labels.select}
          sizing="sm"
          class="min-w-[180px] flex-1"
        />
      </Match>

      <Match when={props.config.fieldType === 'datepicker'}>
        <DatePicker
          type="single"
          value={{ date: (props.filter.value as string) || '' }}
          onChange={(v) => props.onChange(v.date || null)}
          placeholder={props.config.placeholder || props.labels.selectDate}
          locale={props.config.dateConfig?.locale || 'en'}
          inputClass="min-w-[150px] flex-1"
        />
      </Match>

      <Match when={props.config.fieldType === 'dateRange'}>
        <DatePicker
          type="range"
          value={{
            startDate: dateValues()?.[0]?.toISOString().split('T')[0] || '',
            endDate: dateValues()?.[1]?.toISOString().split('T')[0] || '',
          }}
          onChange={(v) => {
            const start = v.startDate ? new Date(v.startDate) : null;
            const end = v.endDate ? new Date(v.endDate) : null;
            if (start && end) {
              props.onChange([start, end]);
            } else {
              props.onChange(null);
            }
          }}
          placeholder={props.config.placeholder || props.labels.selectRange}
          locale={props.config.dateConfig?.locale || 'en'}
          inputClass="min-w-[200px] flex-1"
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
  onColumnChange: (key: string) => void;
  onOperatorChange: (operator: FilterOperator) => void;
  onValueChange: (value: FilterValue) => void;
  onRemove: () => void;
  getOperators: (key: string) => FilterOperator[];
  labels: DataTableFiltersLabels;
  ariaLabels: DataTableFiltersAriaLabels;
}

function FilterRow<T>(props: FilterRowProps<T>): JSX.Element {
  const config = createMemo(() =>
    props.filterConfigs.find((fc) => fc.key === props.filter.key),
  );

  const columnOptions = createMemo<Option[]>(() =>
    props.filterConfigs.map((fc) => ({
      value: fc.key,
      label: fc.label,
    })),
  );

  const operatorOptions = createMemo<Option[]>(() => {
    const operators = props.getOperators(props.filter.key);
    return operators.map((op) => ({
      value: op,
      label: OPERATOR_LABELS[op],
    }));
  });

  const needsInput = createMemo(
    () => props.filter.operator !== 'isEmpty' && props.filter.operator !== 'isNotEmpty',
  );

  return (
    <div class="flex items-center gap-2">
      {/* Column selector */}
      <Select
        options={columnOptions()}
        value={props.filter.key}
        onSelect={(option) => {
          if (option?.value) {
            props.onColumnChange(option.value);
          }
        }}
        placeholder={props.ariaLabels.column}
        sizing="sm"
        class="w-[140px]"
      />

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
        class="w-[140px]"
      />

      {/* Value input */}
      <Show when={needsInput() && config()}>
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
        class="shrink-0 rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-neutral-500 dark:hover:bg-neutral-700 dark:hover:text-neutral-300"
        aria-label={props.ariaLabels.removeFilter}
      >
        <XCloseIcon class="size-5" aria-hidden="true" />
      </button>
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
  // Draft filters - local state for editing before submit
  const [draftFilters, setDraftFilters] = createSignal<DraftFilter[]>([]);
  const [isOpen, setIsOpen] = createSignal(false);

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

  const handleAddFilter = () => {
    const firstConfig = props.filterConfigs[0];
    if (!firstConfig) return;

    const operators = props.getOperators(firstConfig.key);
    const defaultOperator = firstConfig.defaultOperator || operators[0] || 'equal';

    setDraftFilters((prev) => [
      ...prev,
      {
        key: firstConfig.key,
        operator: defaultOperator,
        value: null,
      },
    ]);
  };

  const handleColumnChange = (index: number, newKey: string) => {
    const config = props.filterConfigs.find((fc) => fc.key === newKey);
    if (!config) return;

    const operators = props.getOperators(newKey);
    const defaultOperator = config.defaultOperator || operators[0] || 'equal';

    setDraftFilters((prev) => {
      const updated = [...prev];
      updated[index] = {
        key: newKey,
        operator: defaultOperator,
        value: null,
      };
      return updated;
    });
  };

  const handleOperatorChange = (index: number, operator: FilterOperator) => {
    setDraftFilters((prev) => {
      const updated = [...prev];
      const current = updated[index];
      updated[index] = {
        ...current,
        operator,
        value: operator === 'isEmpty' || operator === 'isNotEmpty' ? null : current.value,
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
  };

  const handleApply = () => {
    // Clear existing filters
    props.clearFilters();

    // Apply draft filters
    draftFilters().forEach((filter) => {
      props.setFilter(filter.key, filter.operator, filter.value);
    });

    setIsOpen(false);
  };

  const activeFilterCount = createMemo(() => props.activeFilters().size);

  const getLocalOperators = (key: string): FilterOperator[] => {
    const config = props.filterConfigs.find((fc) => fc.key === key);
    if (!config) return [];
    return config.operators ?? DEFAULT_OPERATORS[config.dataType] ?? [];
  };

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

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      // Don't close if clicking inside a dropdown/listbox (Select options)
      if (target.closest('[role="listbox"]') || target.closest('[role="option"]')) {
        return;
      }

      // Don't close if clicking inside the popover content
      if (target.closest('[data-filter-popover]')) {
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
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }, 0);

    onCleanup(() => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    });
  });

  const popoverContentWithAttr = (
    <div
      data-filter-popover
      class="w-[520px] max-w-[calc(100vw-32px)] rounded-lg bg-white p-4 shadow-lg ring-1 ring-gray-200 dark:bg-neutral-900 dark:ring-neutral-700"
    >
      {/* Filter rows */}
      <div class="mb-4 space-y-3">
        <Show
          when={draftFilters().length > 0}
          fallback={
            <div class="flex items-center gap-2 py-2">
              <InfoCircleIcon
                class="size-5 text-gray-400 dark:text-neutral-500"
                aria-hidden="true"
              />
              <span class="text-sm text-gray-500 dark:text-neutral-400">
                {props.noFiltersText || l().noFiltersApplied}
              </span>
            </div>
          }
        >
          <Index each={draftFilters()}>
            {(filter, index) => (
              <>
                <Show when={index > 0}>
                  <div class="flex items-center py-1">
                    <span class="rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                      {l().and.toUpperCase()}
                    </span>
                  </div>
                </Show>
                <FilterRow
                  filter={filter()}
                  filterConfigs={props.filterConfigs}
                  onColumnChange={(key) => handleColumnChange(index, key)}
                  onOperatorChange={(op) => handleOperatorChange(index, op)}
                  onValueChange={(val) => handleValueChange(index, val)}
                  onRemove={() => handleRemoveFilter(index)}
                  getOperators={getLocalOperators}
                  labels={l()}
                  ariaLabels={a()}
                />
              </>
            )}
          </Index>
        </Show>
      </div>

      {/* Footer with actions */}
      <div class="flex items-center justify-between border-t border-gray-200 pt-4 dark:border-neutral-800">
        <button
          type="button"
          onClick={handleAddFilter}
          class="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <PlusIcon class="size-4" aria-hidden="true" />
          {props.addFilterText || l().addFilter}
        </button>

        <div class="flex items-center gap-2">
          <Button size="sm" color="gray" onClick={handleReset}>
            {props.resetText || l().reset}
          </Button>
          <Button size="sm" color="blue" onClick={handleApply}>
            {props.applyText || l().filter}
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div class={twMerge('inline-flex', props.class)}>
      <Popover position="bottom-start" content={popoverContentWithAttr} isOpen={isOpen()}>
        <div data-filter-trigger onClick={handleToggle}>
          <Button size="sm" color="gray">
            <FilterFunnel01Icon class="mr-1.5 size-4" aria-hidden="true" />
            {props.filterButtonText || l().filter}
            <Show when={activeFilterCount() > 0}>
              <span class="ml-1.5 rounded-full bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                {activeFilterCount()}
              </span>
            </Show>
          </Button>
        </div>
      </Popover>
    </div>
  );
}
