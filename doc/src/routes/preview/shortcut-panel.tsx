import { type JSX, Show, createSignal, onMount } from 'solid-js';

import { ShortcutProvider, useShortcut } from '@kayou/hooks';
import { ShortcutPanel } from '@kayou/ui';

function Section(props: { id: string; title: string; children: JSX.Element }) {
  return (
    <section id={props.id} class="mb-10 border-b border-neutral-200 pb-8">
      <h2 class="mb-4 text-lg font-semibold">{props.title}</h2>
      {props.children}
    </section>
  );
}

// ── 1. Basic shortcuts with panel ───────────────────────────────────

function ActionRegistrar() {
  const [triggered, setTriggered] = createSignal<string | null>(null);

  useShortcut('save', {
    shortcut: 'Ctrl+S',
    handler: () => setTriggered('save'),
    label: 'Save',
    description: 'Save the current document',
    category: 'File',
  });

  useShortcut('open', {
    shortcut: 'Ctrl+O',
    handler: () => setTriggered('open'),
    label: 'Open',
    description: 'Open a document',
    category: 'File',
  });

  useShortcut('find', {
    shortcut: 'Ctrl+F',
    handler: () => setTriggered('find'),
    label: 'Find',
    description: 'Search in document',
    category: 'Edit',
  });

  useShortcut('undo', {
    shortcut: 'Ctrl+Z',
    handler: () => setTriggered('undo'),
    label: 'Undo',
    description: 'Undo last action',
    category: 'Edit',
  });

  return (
    <>
      <Show when={triggered()}>
        <p
          data-testid="triggered-action"
          class="mb-3 rounded bg-green-100 p-2 text-sm text-green-800"
        >
          Triggered: {triggered()}
        </p>
      </Show>
      <button
        type="button"
        class="mb-3 rounded bg-neutral-200 px-3 py-1 text-sm"
        onClick={() => setTriggered(null)}
      >
        Clear
      </button>
      <ShortcutPanel />
    </>
  );
}

function BasicShortcuts() {
  return (
    <Section id="basic-shortcuts" title="Basic Shortcuts">
      <ShortcutProvider namespace="e2e-basic">
        <ActionRegistrar />
      </ShortcutProvider>
    </Section>
  );
}

// ── 2. Input interaction (ignoreInputs) ─────────────────────────────

function InputRegistrar() {
  const [triggered, setTriggered] = createSignal<string | null>(null);

  useShortcut('action-ignore', {
    shortcut: 'Ctrl+K',
    handler: () => setTriggered('ignored-in-input'),
    label: 'Ignored in input',
    description: 'Should not fire when typing in input',
    category: 'Test',
    ignoreInputs: true,
  });

  useShortcut('action-always', {
    shortcut: 'Ctrl+J',
    handler: () => setTriggered('always-fires'),
    label: 'Always fires',
    description: 'Fires even when input is focused',
    category: 'Test',
    ignoreInputs: false,
  });

  return (
    <>
      <Show when={triggered()}>
        <p
          data-testid="input-triggered"
          class="mb-3 rounded bg-green-100 p-2 text-sm text-green-800"
        >
          Triggered: {triggered()}
        </p>
      </Show>
      <button
        type="button"
        class="mb-3 rounded bg-neutral-200 px-3 py-1 text-sm"
        onClick={() => setTriggered(null)}
        data-testid="input-clear"
      >
        Clear
      </button>
      <input
        type="text"
        class="mb-3 block w-full rounded border border-neutral-300 px-3 py-1.5 text-sm"
        placeholder="Focus here and test shortcuts"
        data-testid="shortcut-input"
      />
      <ShortcutPanel />
    </>
  );
}

function InputInteraction() {
  return (
    <Section id="input-interaction" title="Input Interaction">
      <ShortcutProvider namespace="e2e-input">
        <InputRegistrar />
      </ShortcutProvider>
    </Section>
  );
}

// ── 3. Conflict detection ───────────────────────────────────────────

function ConflictRegistrar() {
  useShortcut('action-a', {
    shortcut: 'Ctrl+M',
    handler: () => {},
    label: 'Action A',
    description: 'First action on Ctrl+M',
    category: 'Conflicts',
  });

  useShortcut('action-b', {
    shortcut: 'Ctrl+M',
    handler: () => {},
    label: 'Action B',
    description: 'Second action on Ctrl+M (conflict)',
    category: 'Conflicts',
  });

  useShortcut('action-c', {
    shortcut: 'Ctrl+N',
    handler: () => {},
    label: 'Action C',
    description: 'No conflict',
    category: 'Conflicts',
  });

  return <ShortcutPanel />;
}

function ConflictDetection() {
  return (
    <Section id="conflicts" title="Conflict Detection">
      <ShortcutProvider namespace="e2e-conflicts">
        <ConflictRegistrar />
      </ShortcutProvider>
    </Section>
  );
}

// ── Page ─────────────────────────────────────────────────────────────

export default function ShortcutPanelPreview() {
  const [mounted, setMounted] = createSignal(false);
  onMount(() => setMounted(true));

  return (
    <Show when={mounted()}>
      <div class="mx-auto max-w-2xl p-8">
        <h1 class="mb-8 text-2xl font-bold">ShortcutPanel E2E Test Fixture</h1>
        <BasicShortcuts />
        <InputInteraction />
        <ConflictDetection />
      </div>
    </Show>
  );
}
