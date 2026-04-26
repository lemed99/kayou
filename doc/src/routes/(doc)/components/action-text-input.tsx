import { createSignal } from 'solid-js';

import { Save01Icon, SearchSmIcon } from '@kayou/icons';
import { ActionTextInput } from '@kayou/ui';

import DocPage from '../../../components/DocPage';

function ActionTextInputExamples() {
  const [searchKey, setSearchKey] = createSignal('');
  const [searchClicks, setSearchClicks] = createSignal(0);
  const [draftName, setDraftName] = createSignal('Rouge');
  const [submittedName, setSubmittedName] = createSignal('Rouge');
  const [hiddenValue, setHiddenValue] = createSignal('');
  const submitFormId = 'action-text-input-submit-form';

  return (
    <section id="examples" class="mb-8 scroll-mt-20">
      <h2 class="mb-4 text-2xl font-medium">Examples</h2>
      <div class="grid gap-6 xl:grid-cols-2">
        <div
          id="basic-action-input"
          class="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"
        >
          <h3 class="text-base font-medium text-neutral-900 dark:text-white">
            Basic Action Input
          </h3>
          <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Use an icon CTA inside the field chrome for compact search or command-style
            actions.
          </p>
          <div class="mt-4">
            <ActionTextInput
              label="Search"
              placeholder="Find an option"
              value={searchKey()}
              onInput={(event) => setSearchKey(event.currentTarget.value)}
              helperText={`Action pressed: ${searchClicks()} time${searchClicks() === 1 ? '' : 's'}`}
              actionIcon={SearchSmIcon}
              actionLabel="Run search"
              onActionClick={() => setSearchClicks((current) => current + 1)}
            />
          </div>
        </div>

        <div
          id="submit-action"
          class="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"
        >
          <h3 class="text-base font-medium text-neutral-900 dark:text-white">
            Submit Action
          </h3>
          <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            The in-input CTA can submit a surrounding form through `actionType` and
            `actionForm`.
          </p>
          <div class="mt-4">
            <form
              id={submitFormId}
              onSubmit={(event) => {
                event.preventDefault();
                setSubmittedName(draftName());
              }}
            >
              <ActionTextInput
                label="Option name"
                placeholder='Ex: "Couleur"'
                value={draftName()}
                onInput={(event) => setDraftName(event.currentTarget.value)}
                actionIcon={Save01Icon}
                actionLabel="Save changes"
                actionType="submit"
                actionForm={submitFormId}
              />
            </form>
            <p data-testid="submitted-name" class="mt-3 text-xs text-neutral-500">
              Submitted value: {submittedName()}
            </p>
          </div>
        </div>

        <div
          id="hidden-action"
          class="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"
        >
          <h3 class="text-base font-medium text-neutral-900 dark:text-white">
            Hidden Action
          </h3>
          <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Hide the CTA when the field should behave like a standard text input.
          </p>
          <div class="mt-4">
            <ActionTextInput
              label="Notes"
              placeholder="No inline action here"
              value={hiddenValue()}
              onInput={(event) => setHiddenValue(event.currentTarget.value)}
              actionIcon={Save01Icon}
              actionLabel="Hidden action"
              actionVisible={false}
            />
          </div>
        </div>

        <div
          id="loading-action"
          class="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"
        >
          <h3 class="text-base font-medium text-neutral-900 dark:text-white">
            Loading Action
          </h3>
          <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Action loading swaps the icon for a spinner and disables the CTA.
          </p>
          <div class="mt-4">
            <ActionTextInput
              label="Saving"
              placeholder="Saving changes"
              value="Bordeaux"
              actionIcon={Save01Icon}
              actionLabel="Saving"
              actionLoading={true}
            />
          </div>
        </div>

        <div
          id="disabled-action"
          class="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"
        >
          <h3 class="text-base font-medium text-neutral-900 dark:text-white">
            Disabled Action
          </h3>
          <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Disabled fields automatically disable the in-input CTA as well.
          </p>
          <div class="mt-4">
            <ActionTextInput
              label="Archived option"
              value="Legacy color"
              disabled={true}
              actionIcon={Save01Icon}
              actionLabel="Disabled action"
            />
          </div>
        </div>

        <div
          id="validation-state"
          class="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"
        >
          <h3 class="text-base font-medium text-neutral-900 dark:text-white">
            Validation State
          </h3>
          <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Validation colors apply to both the field and the embedded CTA.
          </p>
          <div class="mt-4">
            <ActionTextInput
              label="Option value"
              value="Rouge"
              color="failure"
              helperText="Please resolve the duplicate name."
              actionIcon={Save01Icon}
              actionLabel="Retry save"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ActionTextInputPage() {
  return (
    <DocPage
      title="ActionTextInput"
      description="Text input with a right-side icon CTA rendered inside the input chrome so the action stays inside the visible field boundary."
      keyConcepts={[
        {
          term: 'In-Input Action',
          explanation:
            'The CTA is overlaid inside the input surface instead of being rendered as an addon.',
        },
        {
          term: 'Form Compatible',
          explanation:
            'Use `actionType` and `actionForm` to submit an external form from the in-input CTA.',
        },
        {
          term: 'Shared Input States',
          explanation:
            'The component inherits TextInput sizing, validation colors, helper text, and disabled/loading behavior.',
        },
      ]}
      props={[
        {
          name: 'actionIcon',
          type: '(props: IconProps) => JSX.Element',
          default: '-',
          description: 'Icon rendered in the in-input CTA button',
        },
        {
          name: 'actionLabel',
          type: 'string',
          default: '-',
          description: 'Accessible label and tooltip content for the CTA button',
        },
        {
          name: 'onActionClick',
          type: '(event: MouseEvent) => void',
          default: '-',
          description: 'Callback fired when the CTA button is clicked',
        },
        {
          name: 'actionType',
          type: '"button" | "submit" | "reset"',
          default: '"button"',
          description: 'Native button type used by the CTA',
        },
        {
          name: 'actionForm',
          type: 'string',
          default: '-',
          description: 'Form id associated with the CTA button',
        },
        {
          name: 'actionDisabled',
          type: 'boolean',
          default: 'false',
          description: 'Disables the CTA button',
        },
        {
          name: 'actionLoading',
          type: 'boolean',
          default: 'false',
          description: 'Shows a spinner in the CTA and disables it',
        },
        {
          name: 'actionVisible',
          type: 'boolean',
          default: 'true',
          description: 'Controls whether the CTA is rendered',
        },
        {
          name: 'actionColor',
          type: '"info" | "danger" | "anti-theme" | "gray"',
          default: '"info"',
          description: 'Sets the color of the action button.',
        },
        {
          name: 'actionVariant',
          type: '"solid" | "outline" | "transparent"',
          default: '"solid"',
          description: 'Visual style of the action button.',
        },
        {
          name: 'actionClass',
          type: 'string',
          default: '-',
          description: 'Additional CSS class for the CTA button',
        },
        {
          name: 'actionWrapperClass',
          type: 'string',
          default: '-',
          description: 'Additional CSS class for the CTA wrapper',
        },
      ]}
      playground={`
        import { Save01Icon, SearchSmIcon } from '@kayou/icons';
        import { ActionTextInput } from '@kayou/ui';

        export default function Example() {
          return (
            <div class="flex w-80 flex-col gap-6">
              <ActionTextInput
                label="Search"
                placeholder="Find an option"
                actionIcon={SearchSmIcon}
                actionLabel="Run search"
              />

              <ActionTextInput
                label="Option name"
                value="Couleur"
                actionIcon={Save01Icon}
                actionLabel="Save changes"
                actionType="submit"
                actionForm="demo-form"
              />
            </div>
          );
        }
      `}
      usage={`
        import { Save01Icon, SearchSmIcon } from '@kayou/icons';
        import { ActionTextInput } from '@kayou/ui';

        <ActionTextInput
          label="Search"
          actionIcon={SearchSmIcon}
          actionLabel="Run search"
          onActionClick={() => console.log('search')}
        />

        <ActionTextInput
          label="Option name"
          actionIcon={Save01Icon}
          actionLabel="Save changes"
          actionType="submit"
          actionForm="option-form"
        />
      `}
    >
      <ActionTextInputExamples />
    </DocPage>
  );
}
