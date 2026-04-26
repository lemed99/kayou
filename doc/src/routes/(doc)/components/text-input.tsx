import { createSignal } from 'solid-js';

import { TextInput } from '@kayou/ui';

import DocPage from '../../../components/DocPage';

function TextInputExamples() {
  const [controlledValue, setControlledValue] = createSignal('');

  return (
    <section id="examples" class="mb-8 scroll-mt-20">
      <h2 class="mb-4 text-2xl font-medium">Examples</h2>
      <div class="grid gap-6 xl:grid-cols-2">
        <div
          id="basic-input"
          class="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"
        >
          <h3 class="text-base font-medium text-neutral-900 dark:text-white">
            Basic Input
          </h3>
          <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Standard single-line text entry with placeholder support.
          </p>
          <div class="mt-4">
            <TextInput placeholder="Enter your name" />
          </div>
        </div>

        <div
          id="with-label-and-helper-text"
          class="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"
        >
          <h3 class="text-base font-medium text-neutral-900 dark:text-white">
            With Label and Helper Text
          </h3>
          <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Labels and helper text stay linked through generated accessibility IDs.
          </p>
          <div class="mt-4">
            <TextInput
              label="Email Address"
              placeholder="you@example.com"
              helperText="We'll never share your email."
            />
          </div>
        </div>

        <div
          id="size-variants"
          class="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"
        >
          <h3 class="text-base font-medium text-neutral-900 dark:text-white">
            Size Variants
          </h3>
          <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            `TextInput` keeps the same structure across compact and regular sizes.
          </p>
          <div class="mt-4 space-y-3">
            <TextInput sizing="xs" placeholder="Extra Small" />
            <TextInput sizing="sm" placeholder="Small" />
            <TextInput sizing="md" placeholder="Medium" />
          </div>
        </div>

        <div
          id="validation-states"
          class="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"
        >
          <h3 class="text-base font-medium text-neutral-900 dark:text-white">
            Validation States
          </h3>
          <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Color variants control validation styling while preserving the same input API.
          </p>
          <div class="mt-4 space-y-3">
            <TextInput
              color="failure"
              value="Invalid input"
              helperText="Please check this field"
            />
            <TextInput color="success" value="Valid input" helperText="Looks good" />
          </div>
        </div>

        <div
          id="with-addon"
          class="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"
        >
          <h3 class="text-base font-medium text-neutral-900 dark:text-white">
            With Addon
          </h3>
          <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Left addons remain the default for prefix-style values.
          </p>
          <div class="mt-4">
            <TextInput addon="https://" placeholder="example.com" />
          </div>
        </div>

        <div
          id="with-right-addon"
          class="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"
        >
          <h3 class="text-base font-medium text-neutral-900 dark:text-white">
            With Right Addon
          </h3>
          <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Set `addonPosition=&quot;right&quot;` for suffix-style values.
          </p>
          <div class="mt-4">
            <TextInput addon=".com" addonPosition="right" placeholder="example" />
          </div>
        </div>

        <div
          id="loading-state"
          class="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"
        >
          <h3 class="text-base font-medium text-neutral-900 dark:text-white">
            Loading State
          </h3>
          <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Loading disables the field and swaps the leading icon slot for a spinner.
          </p>
          <div class="mt-4">
            <TextInput isLoading placeholder="Loading..." />
          </div>
        </div>

        <div
          id="disabled-state"
          class="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"
        >
          <h3 class="text-base font-medium text-neutral-900 dark:text-white">
            Disabled State
          </h3>
          <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Disabled inputs keep their value visible while blocking interaction.
          </p>
          <div class="mt-4">
            <TextInput disabled value="Disabled input" />
          </div>
        </div>

        <div
          id="required-field"
          class="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"
        >
          <h3 class="text-base font-medium text-neutral-900 dark:text-white">
            Required Field
          </h3>
          <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Required fields preserve native form semantics and add a visual indicator.
          </p>
          <div class="mt-4">
            <TextInput label="Required Field" placeholder="Required value" required />
          </div>
        </div>

        <div
          id="controlled-input"
          class="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"
        >
          <h3 class="text-base font-medium text-neutral-900 dark:text-white">
            Controlled Input
          </h3>
          <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Controlled usage keeps the displayed value and surrounding UI in sync.
          </p>
          <div class="mt-4">
            <TextInput
              label="Controlled Input"
              placeholder="Type here"
              value={controlledValue()}
              onInput={(event) => setControlledValue(event.currentTarget.value)}
            />
            <p class="mt-3 text-xs text-neutral-500">You typed: {controlledValue()}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function TextInputPage() {
  return (
    <DocPage
      title="TextInput"
      description="Text input with labels, helper text, icons, addons, and validation states."
      dependencies={[
        {
          name: 'tailwind-merge',
          url: 'https://github.com/dcastil/tailwind-merge',
          usage: 'Merges Tailwind CSS classes without conflicts',
        },
      ]}
      keyConcepts={[
        {
          term: 'Validation States',
          explanation: 'Color prop shows status: success, warning, or failure.',
        },
        {
          term: 'Icons and Addons',
          explanation:
            'Icons stay inside the field; addons can attach to the left or right edge.',
        },
        {
          term: 'Accessibility',
          explanation: 'Labels and helper text are properly linked for screen readers.',
        },
      ]}
      props={[
        {
          name: 'sizing',
          type: '"xs" | "sm" | "md"',
          default: '"md"',
          description: 'Input size variant',
        },
        {
          name: 'color',
          type: '"gray" | "info" | "failure" | "warning" | "success"',
          default: '"gray"',
          description: 'Color variant for styling and validation states',
        },
        {
          name: 'label',
          type: 'string',
          default: '-',
          description: 'Label text displayed above the input',
        },
        {
          name: 'helperText',
          type: 'string',
          default: '-',
          description: 'Helper text displayed below the input',
        },
        {
          name: 'icon',
          type: '(props: { class: string }) => JSX.Element',
          default: '-',
          description: 'Icon component rendered inside the input',
        },
        {
          name: 'addon',
          type: 'JSX.Element',
          default: '-',
          description: 'Addon element displayed beside the input',
        },
        {
          name: 'addonPosition',
          type: '"left" | "right"',
          default: '"left"',
          description: 'Controls whether the addon renders before or after the input',
        },
        {
          name: 'isLoading',
          type: 'boolean',
          default: 'false',
          description: 'Shows loading spinner and disables input',
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: 'Disables the input',
        },
        {
          name: 'required',
          type: 'boolean',
          default: 'false',
          description: 'Marks the input as required with visual indicator',
        },
        {
          name: 'showArrows',
          type: 'boolean',
          default: 'false',
          description: 'Shows increment/decrement arrow buttons',
        },
        {
          name: 'onArrowUp',
          type: '(event: MouseEvent) => void',
          default: '-',
          description: 'Fired when the increment arrow is pressed (mousedown)',
        },
        {
          name: 'onArrowDown',
          type: '(event: MouseEvent) => void',
          default: '-',
          description: 'Fired when the decrement arrow is pressed (mousedown)',
        },
        {
          name: 'onArrowUpMouseUp',
          type: '(event: MouseEvent) => void',
          default: '-',
          description: 'Fired when the increment arrow is released (mouseup)',
        },
        {
          name: 'onArrowDownMouseUp',
          type: '(event: MouseEvent) => void',
          default: '-',
          description: 'Fired when the decrement arrow is released (mouseup)',
        },
        {
          name: 'upBtnRef',
          type: '(el: HTMLButtonElement) => void',
          default: '-',
          description: 'Ref callback for the increment button element',
        },
        {
          name: 'downBtnRef',
          type: '(el: HTMLButtonElement) => void',
          default: '-',
          description: 'Ref callback for the decrement button element',
        },
        {
          name: 'fitContent',
          type: 'boolean',
          default: 'false',
          description: 'Adjusts input width to fit content',
        },
        {
          name: 'ariaLabels',
          type: 'Partial<TextInputAriaLabels>',
          default: '{ increase: "Increase value", decrease: "Decrease value" }',
          description: 'Accessibility labels for screen readers',
        },
      ]}
      subComponents={[
        {
          name: 'TextInputAriaLabels',
          kind: 'type',
          description: 'Aria labels for the TextInput component',
          props: [
            {
              name: 'increase',
              type: 'string',
              default: '"Increase value"',
              description: 'Label for the increase arrow button',
            },
            {
              name: 'decrease',
              type: 'string',
              default: '"Decrease value"',
              description: 'Label for the decrease arrow button',
            },
          ],
        },
      ]}
      playground={`
        import { TextInput } from '@kayou/ui';

        export default function Example() {
          return (
            <div class="flex flex-col gap-6 w-72">
              {/* With label and helper text */}
              <TextInput
                label="Email Address"
                placeholder="you@example.com"
                helperText="We'll never share your email."
              />

              {/* With left addon */}
              <TextInput addon="https://" placeholder="example.com" />

              {/* With right addon */}
              <TextInput
                addon=".com"
                addonPosition="right"
                placeholder="example"
              />
            </div>
          );
        }
      `}
      usage={`
        import { TextInput } from '@kayou/ui';

        <TextInput placeholder="Enter text" />
        <TextInput label="Email" helperText="We'll never share your email." />
        <TextInput color="failure" label="Password" helperText="Invalid password" />
        <TextInput addon="https://" placeholder="example.com" />
        <TextInput addon=".com" addonPosition="right" placeholder="example" />
      `}
    >
      <TextInputExamples />
    </DocPage>
  );
}
