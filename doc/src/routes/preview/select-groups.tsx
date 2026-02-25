import { type JSX, createSignal } from 'solid-js';

import { MultiSelect, Select, SelectWithSearch } from '@kayou/ui';

/** Wrapper for each test section. */
function Section(props: { id: string; title: string; children: JSX.Element }) {
  return (
    <section id={props.id} class="mb-10 border-b border-neutral-200 pb-8">
      <h2 class="mb-4 text-lg font-semibold">{props.title}</h2>
      {props.children}
    </section>
  );
}

// ── Data ──────────────────────────────────────────────────────────────

const foodOptions = [
  { value: 'apple', label: 'Apple', group: 'Fruits' },
  { value: 'banana', label: 'Banana', group: 'Fruits' },
  { value: 'cherry', label: 'Cherry', group: 'Fruits' },
  { value: 'carrot', label: 'Carrot', group: 'Vegetables' },
  { value: 'broccoli', label: 'Broccoli', group: 'Vegetables' },
  { value: 'spinach', label: 'Spinach', group: 'Vegetables' },
];

const countryOptions = [
  { value: 'us', label: 'United States', group: 'Americas' },
  { value: 'ca', label: 'Canada', group: 'Americas' },
  { value: 'br', label: 'Brazil', group: 'Americas' },
  { value: 'uk', label: 'United Kingdom', group: 'Europe' },
  { value: 'de', label: 'Germany', group: 'Europe' },
  { value: 'fr', label: 'France', group: 'Europe' },
  { value: 'jp', label: 'Japan', group: 'Asia' },
  { value: 'au', label: 'Australia', group: 'Oceania' },
];

const frameworkOptions = [
  { value: 'react', label: 'React', group: 'JavaScript' },
  { value: 'solid', label: 'SolidJS', group: 'JavaScript' },
  { value: 'vue', label: 'Vue', group: 'JavaScript' },
  { value: 'django', label: 'Django', group: 'Python' },
  { value: 'flask', label: 'Flask', group: 'Python' },
  { value: 'rails', label: 'Rails', group: 'Ruby' },
];

const virtualizedFrameworkOptions = [
  ...['React', 'SolidJS', 'Vue', 'Angular', 'Svelte', 'Preact', 'Lit', 'Qwik'].map((f) => ({
    value: f.toLowerCase(),
    label: f,
    group: 'JavaScript',
  })),
  ...['Django', 'Flask', 'FastAPI', 'Tornado', 'Pyramid', 'Bottle', 'Sanic', 'Starlette'].map(
    (f) => ({ value: f.toLowerCase(), label: f, group: 'Python' }),
  ),
  ...['Rails', 'Sinatra', 'Hanami', 'Roda', 'Grape', 'Padrino'].map((f) => ({
    value: f.toLowerCase(),
    label: f,
    group: 'Ruby',
  })),
];

// ── 1. Select — Grouped ──────────────────────────────────────────────

function GroupedSelect() {
  return (
    <div class="w-72">
      <Select
        options={foodOptions}
        label="Select food"
        placeholder="Select food"
        onSelect={() => {}}
      />
    </div>
  );
}

// ── 2. SelectWithSearch — Grouped ────────────────────────────────────

function GroupedSelectWithSearch() {
  return (
    <div class="w-72">
      <SelectWithSearch
        options={countryOptions}
        placeholder="Search countries..."
        label="Search countries"
        autoFillSearchKey
        onSelect={() => {}}
      />
    </div>
  );
}

// ── 3. MultiSelect — Grouped ─────────────────────────────────────────

function GroupedMultiSelect() {
  return (
    <div class="w-72">
      <MultiSelect
        options={frameworkOptions}
        label="Select frameworks"
        placeholder="Select frameworks"
        onMultiSelect={() => {}}
      />
    </div>
  );
}

// ── 4. MultiSelect — Virtualized Grouped ─────────────────────────────

function VirtualizedGroupedMultiSelect() {
  return (
    <div class="w-72">
      <MultiSelect
        options={virtualizedFrameworkOptions}
        label="Virtualized frameworks"
        placeholder="Select frameworks"
        optionRowHeight={32}
        onMultiSelect={() => {}}
      />
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────

export default function SelectGroupsPreview() {
  return (
    <div class="mx-auto max-w-2xl p-8">
      <h1 class="mb-8 text-2xl font-bold">Select Groups — E2E Preview</h1>

      <Section id="grouped-select" title="Select — Grouped">
        <GroupedSelect />
      </Section>

      <Section id="grouped-search" title="SelectWithSearch — Grouped">
        <GroupedSelectWithSearch />
      </Section>

      <Section id="grouped-multi" title="MultiSelect — Grouped">
        <GroupedMultiSelect />
      </Section>

      <Section id="virtualized-multi" title="MultiSelect — Virtualized Grouped">
        <VirtualizedGroupedMultiSelect />
      </Section>
    </div>
  );
}
