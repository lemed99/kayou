import { createSignal } from 'solid-js';

import { TagInput } from '@kayou/ui';

import DocPage from '../../../components/DocPage';

function TagInputExamples() {
  const [controlledTags, setControlledTags] = createSignal(['solid', 'ui']);

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
            Type a value and press comma, semicolon, enter, or blur to create a tag.
          </p>
          <div class="mt-4">
            <TagInput
              label="Topics"
              placeholder="Add a topic"
              helperText="Use comma or semicolon to separate tags."
            />
          </div>
        </div>

        <div
          id="separator-support"
          class="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"
        >
          <h3 class="text-base font-medium text-neutral-900 dark:text-white">
            Separator Support
          </h3>
          <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Pasting a comma or semicolon separated list splits it into individual tags.
          </p>
          <div class="mt-4">
            <TagInput
              label="Recipients"
              placeholder="alice@example.com"
              defaultValue={['team@example.com']}
            />
          </div>
        </div>

        <div
          id="controlled-value"
          class="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"
        >
          <h3 class="text-base font-medium text-neutral-900 dark:text-white">
            Controlled Value
          </h3>
          <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            This example mirrors `NumberInput`: control the committed tags through `value`
            and `onValueChange`.
          </p>
          <div class="mt-4">
            <TagInput
              label="Frameworks"
              placeholder="Add a framework"
              value={controlledTags()}
              onValueChange={setControlledTags}
            />
            <p data-testid="controlled-tags" class="mt-3 text-xs text-neutral-500">
              Tags: {controlledTags().join(', ') || '[empty]'}
            </p>
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
            Validation colors and helper text behave the same way as `TextInput`.
          </p>
          <div class="mt-4">
            <TagInput
              label="Required Skills"
              placeholder="Add at least one skill"
              color="failure"
              helperText="Please add at least one skill."
            />
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
            Disabled inputs keep existing tags visible and block removal.
          </p>
          <div class="mt-4">
            <TagInput
              label="Locked Tags"
              value={['readonly', 'archived']}
              disabled
              placeholder="Disabled"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function TagInputPage() {
  return (
    <DocPage
      title="TagInput"
      description="Text input for creating removable tags, with the same input styling and configuration model as TextInput."
      keyConcepts={[
        {
          term: 'Shared Input API',
          explanation:
            'Supports the same sizing, color, label, helper, icon, and addon props as TextInput.',
        },
        {
          term: 'Tag Creation',
          explanation:
            'Comma, semicolon, enter, blur, and pasted lists can all commit tags.',
        },
        {
          term: 'Accessible Tag List',
          explanation:
            'Tags render in a labeled list with dedicated remove buttons and live status updates.',
        },
      ]}
      props={[
        {
          name: 'value',
          type: 'string[]',
          default: '-',
          description: 'Controlled list of tags',
        },
        {
          name: 'defaultValue',
          type: 'string[]',
          default: '[]',
          description: 'Initial tag list for uncontrolled usage',
        },
        {
          name: 'onValueChange',
          type: '(value: string[]) => void',
          default: '-',
          description: 'Called whenever the tag list changes',
        },
        {
          name: 'allowDuplicates',
          type: 'boolean',
          default: 'false',
          description: 'Allows the same tag to be added multiple times',
        },
        {
          name: 'maxTags',
          type: 'number',
          default: '-',
          description: 'Maximum number of tags that can be added',
        },
        {
          name: 'badgeColor',
          type: '"gray" | "failure" | "warning" | "success" | "dark" | "default"',
          default: '"default"',
          description: 'Badge color used for each rendered tag',
        },
        {
          name: 'badgeSize',
          type: '"xs" | "sm"',
          default: '"xs"',
          description: 'Badge size used for each rendered tag',
        },
        {
          name: 'helperText',
          type: 'string',
          default: '-',
          description: 'Helper text displayed below the tag list',
        },
        {
          name: 'ariaLabels',
          type: 'Partial<TagInputAriaLabels>',
          default:
            '{ removeTag: "Remove tag", tagList: "Selected tags", tagStatus: "Tag input status" }',
          description: 'Accessibility labels for the tag list and remove buttons',
        },
      ]}
      subComponents={[
        {
          name: 'TagInputAriaLabels',
          kind: 'type',
          description: 'Aria labels for the TagInput component',
          props: [
            {
              name: 'removeTag',
              type: 'string',
              default: '"Remove tag"',
              description: 'Prefix used for tag removal button labels',
            },
            {
              name: 'tagList',
              type: 'string',
              default: '"Selected tags"',
              description: 'Accessible label for the rendered tag list',
            },
            {
              name: 'tagStatus',
              type: 'string',
              default: '"Tag input status"',
              description: 'Accessible label for the live status region',
            },
          ],
        },
      ]}
      playground={`
        import { TagInput } from '@kayou/ui';

        export default function Example() {
          return (
            <div class="flex w-80 flex-col gap-6">
              <TagInput
                label="Topics"
                placeholder="Add a topic"
                helperText="Use comma or semicolon to separate tags."
              />

              <TagInput
                label="Recipients"
                defaultValue={['team@example.com']}
                placeholder="alice@example.com"
              />
            </div>
          );
        }
      `}
      usage={`
        import { TagInput } from '@kayou/ui';

        <TagInput placeholder="Add a tag" />
        <TagInput defaultValue={['solid', 'ui']} helperText="Use comma or semicolon." />
        <TagInput value={tags} onValueChange={setTags} />
      `}
    >
      <TagInputExamples />
    </DocPage>
  );
}
