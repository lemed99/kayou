import { type JSX, Show, createSignal, onMount } from 'solid-js';

import { Tabs } from '@kayou/ui';

function Section(props: { id: string; title: string; children: JSX.Element }) {
  return (
    <section id={props.id} class="mb-10 border-b border-neutral-200 pb-8">
      <h2 class="mb-4 text-lg font-semibold">{props.title}</h2>
      {props.children}
    </section>
  );
}

// ── 1. Basic (uncontrolled, underline) ──────────────────────────────

function BasicTabs() {
  return (
    <Section id="basic" title="Basic Tabs (underline)">
      <Tabs
        tabs={[
          {
            key: 'tab1',
            label: 'General',
            content: <p data-testid="basic-content-1">General content</p>,
          },
          {
            key: 'tab2',
            label: 'Settings',
            content: <p data-testid="basic-content-2">Settings content</p>,
          },
          {
            key: 'tab3',
            label: 'Advanced',
            content: <p data-testid="basic-content-3">Advanced content</p>,
          },
        ]}
      />
    </Section>
  );
}

// ── 2. Controlled ───────────────────────────────────────────────────

function ControlledTabs() {
  const [active, setActive] = createSignal('ctrl-2');

  return (
    <Section id="controlled" title="Controlled Tabs">
      <p data-testid="controlled-active" class="mb-2 text-sm">
        Active: {active()}
      </p>
      <button
        type="button"
        class="mb-3 rounded bg-blue-600 px-3 py-1 text-sm text-white"
        onClick={() => setActive('ctrl-3')}
      >
        Switch to Tab 3
      </button>
      <Tabs
        activeTab={active()}
        onTabChange={setActive}
        tabs={[
          {
            key: 'ctrl-1',
            label: 'One',
            content: <p data-testid="ctrl-content-1">Content one</p>,
          },
          {
            key: 'ctrl-2',
            label: 'Two',
            content: <p data-testid="ctrl-content-2">Content two</p>,
          },
          {
            key: 'ctrl-3',
            label: 'Three',
            content: <p data-testid="ctrl-content-3">Content three</p>,
          },
        ]}
      />
    </Section>
  );
}

// ── 3. Disabled tabs ────────────────────────────────────────────────

function DisabledTabs() {
  return (
    <Section id="disabled" title="Disabled Tabs">
      <Tabs
        tabs={[
          {
            key: 'dis-1',
            label: 'Enabled 1',
            content: <p data-testid="dis-content-1">Enabled 1 content</p>,
          },
          {
            key: 'dis-2',
            label: 'Disabled',
            content: <p>Never shown</p>,
            disabled: true,
          },
          {
            key: 'dis-3',
            label: 'Enabled 2',
            content: <p data-testid="dis-content-3">Enabled 2 content</p>,
          },
        ]}
      />
    </Section>
  );
}

// ── 4. Pills variant ────────────────────────────────────────────────

function PillsTabs() {
  return (
    <Section id="pills" title="Pills Variant">
      <Tabs
        variant="pills"
        tabs={[
          {
            key: 'pill-1',
            label: 'Alpha',
            content: <p data-testid="pill-content-1">Alpha content</p>,
          },
          {
            key: 'pill-2',
            label: 'Beta',
            content: <p data-testid="pill-content-2">Beta content</p>,
          },
        ]}
      />
    </Section>
  );
}

// ── 5. Bordered variant ─────────────────────────────────────────────

function BorderedTabs() {
  return (
    <Section id="bordered" title="Bordered Variant">
      <Tabs
        variant="bordered"
        tabs={[
          {
            key: 'brd-1',
            label: 'First',
            content: <p data-testid="brd-content-1">First content</p>,
          },
          {
            key: 'brd-2',
            label: 'Second',
            content: <p data-testid="brd-content-2">Second content</p>,
          },
        ]}
      />
    </Section>
  );
}

// ── 6. Lazy rendering ───────────────────────────────────────────────

function LazyTabs() {
  return (
    <Section id="lazy" title="Lazy Rendering">
      <Tabs
        lazy
        tabs={[
          {
            key: 'lz-1',
            label: 'Loaded',
            content: <p data-testid="lazy-content-1">Lazy content 1</p>,
          },
          {
            key: 'lz-2',
            label: 'Deferred',
            content: () => <p data-testid="lazy-content-2">Lazy content 2</p>,
          },
        ]}
      />
    </Section>
  );
}

// ── 7. Sizes ────────────────────────────────────────────────────────

function SizeTabs() {
  return (
    <Section id="sizes" title="Sizes">
      <div class="flex flex-col gap-6">
        <div>
          <p class="mb-1 text-xs text-neutral-500">Small</p>
          <Tabs
            size="sm"
            tabs={[
              { key: 'sm-1', label: 'Tab A', content: <p>Small tab content</p> },
              { key: 'sm-2', label: 'Tab B', content: <p>Small tab B</p> },
            ]}
          />
        </div>
        <div>
          <p class="mb-1 text-xs text-neutral-500">Large</p>
          <Tabs
            size="lg"
            tabs={[
              { key: 'lg-1', label: 'Tab A', content: <p>Large tab content</p> },
              { key: 'lg-2', label: 'Tab B', content: <p>Large tab B</p> },
            ]}
          />
        </div>
      </div>
    </Section>
  );
}

// ── Page ─────────────────────────────────────────────────────────────

export default function TabsPreview() {
  const [mounted, setMounted] = createSignal(false);
  onMount(() => setMounted(true));

  return (
    <Show when={mounted()}>
      <div class="mx-auto max-w-2xl p-8">
        <h1 class="mb-8 text-2xl font-bold">Tabs E2E Test Fixture</h1>
        <BasicTabs />
        <ControlledTabs />
        <DisabledTabs />
        <PillsTabs />
        <BorderedTabs />
        <LazyTabs />
        <SizeTabs />
      </div>
    </Show>
  );
}
