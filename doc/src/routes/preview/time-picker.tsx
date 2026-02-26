import { type JSX, Show, createSignal, onMount } from 'solid-js';

import { TimePicker, type TimeValue } from '@kayou/ui';

function Section(props: { id: string; title: string; children: JSX.Element }) {
  return (
    <section id={props.id} class="mb-10 border-b border-neutral-200 pb-8">
      <h2 class="mb-4 text-lg font-semibold">{props.title}</h2>
      {props.children}
    </section>
  );
}

// ── 1. Basic 24h ────────────────────────────────────────────────────

function Basic24h() {
  const [time, setTime] = createSignal<TimeValue>({ hour: 14, minute: 30, second: 0 });

  return (
    <Section id="basic-24h" title="Basic 24h Format">
      <TimePicker
        label="Start Time"
        value={time()}
        onChange={setTime}
      />
      <p data-testid="basic-24h-value" class="mt-2 text-sm text-neutral-500">
        {`${time().hour}:${time().minute}:${time().second}`}
      </p>
    </Section>
  );
}

// ── 2. 12h Format ───────────────────────────────────────────────────

function Format12h() {
  const [time, setTime] = createSignal<TimeValue>({ hour: 9, minute: 0, second: 0 });

  return (
    <Section id="format-12h" title="12h Format with AM/PM">
      <TimePicker
        label="Meeting Time"
        format="12h"
        value={time()}
        onChange={setTime}
      />
      <p data-testid="format-12h-value" class="mt-2 text-sm text-neutral-500">
        {`${time().hour}:${time().minute}:${time().second}`}
      </p>
    </Section>
  );
}

// ── 3. With Seconds ─────────────────────────────────────────────────

function WithSeconds() {
  const [time, setTime] = createSignal<TimeValue>({ hour: 0, minute: 0, second: 0 });

  return (
    <Section id="with-seconds" title="With Seconds">
      <TimePicker
        label="Precise Time"
        showSeconds
        value={time()}
        onChange={setTime}
      />
      <p data-testid="with-seconds-value" class="mt-2 text-sm text-neutral-500">
        {`${time().hour}:${time().minute}:${time().second}`}
      </p>
    </Section>
  );
}

// ── 4. Step Control ─────────────────────────────────────────────────

function StepControl() {
  const [time, setTime] = createSignal<TimeValue>({ hour: 10, minute: 0, second: 0 });

  return (
    <Section id="step-control" title="15-Minute Steps">
      <TimePicker
        label="Appointment"
        minuteStep={15}
        value={time()}
        onChange={setTime}
      />
      <p data-testid="step-value" class="mt-2 text-sm text-neutral-500">
        {`${time().hour}:${time().minute}`}
      </p>
    </Section>
  );
}

// ── 5. Disabled ─────────────────────────────────────────────────────

function Disabled() {
  return (
    <Section id="disabled" title="Disabled">
      <TimePicker
        label="Disabled"
        disabled
        value={{ hour: 10, minute: 0, second: 0 }}
      />
    </Section>
  );
}

// ── 6. Loading ──────────────────────────────────────────────────────

function Loading() {
  return (
    <Section id="loading" title="Loading">
      <TimePicker
        label="Loading"
        isLoading
      />
    </Section>
  );
}

// ── 7. Validation Colors ────────────────────────────────────────────

function ValidationColors() {
  return (
    <Section id="validation" title="Validation Colors">
      <div class="flex flex-col gap-4">
        <TimePicker
          label="Error"
          color="failure"
          helperText="Time is required"
          required
        />
        <TimePicker
          label="Warning"
          color="warning"
          helperText="Outside business hours"
        />
        <TimePicker
          label="Success"
          color="success"
          helperText="Time is valid"
        />
        <TimePicker
          label="Info"
          color="info"
          helperText="Select a preferred time"
        />
      </div>
    </Section>
  );
}

// ── 8. Sizing ───────────────────────────────────────────────────────

function Sizing() {
  return (
    <Section id="sizing" title="Sizing">
      <div class="flex flex-col gap-4">
        <TimePicker label="Extra Small" sizing="xs" />
        <TimePicker label="Small" sizing="sm" />
        <TimePicker label="Medium (default)" sizing="md" />
      </div>
    </Section>
  );
}

// ── Page ─────────────────────────────────────────────────────────────

export default function TimePickerPreview() {
  const [mounted, setMounted] = createSignal(false);
  onMount(() => setMounted(true));

  return (
    <Show when={mounted()}>
      <div class="mx-auto max-w-2xl p-8">
        <h1 class="mb-8 text-2xl font-bold">TimePicker E2E Test Fixture</h1>
        <Basic24h />
        <Format12h />
        <WithSeconds />
        <StepControl />
        <Disabled />
        <Loading />
        <ValidationColors />
        <Sizing />
      </div>
    </Show>
  );
}
