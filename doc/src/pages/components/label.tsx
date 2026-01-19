import { Label } from '@exowpee/solidly';

import DocPage from '../../components/DocPage';

export default function LabelPage() {
  return (
    <DocPage
      title="Label"
      description="Form label with five color variants and support for custom content."
      keyConcepts={[
        {
          term: 'Semantic HTML',
          explanation:
            'Uses the native <label> element with the for attribute to create a programmatic association with inputs. This enables clicking labels to focus inputs and ensures assistive technologies announce labels correctly.',
        },
        {
          term: 'Color States',
          explanation:
            'Color variants provide visual feedback about field state. Use gray for normal fields, failure for invalid inputs, success for validated fields, and warning for inputs needing attention.',
        },
        {
          term: 'Flexible Content',
          explanation:
            'The value prop handles simple text labels. For custom content like required asterisks or inline icons, use children to render JSX elements within the label.',
        },
      ]}
      props={[
        {
          name: 'value',
          type: 'string',
          default: '-',
          description: 'Text value to display in the label',
        },
        {
          name: 'color',
          type: '"gray" | "info" | "failure" | "warning" | "success"',
          default: '"gray"',
          description: 'Color variant of the label',
        },
        {
          name: 'for',
          type: 'string',
          default: '-',
          description: 'ID of the form element this label is for',
        },
        {
          name: 'children',
          type: 'JSX.Element',
          default: '-',
          description: 'Alternative to value prop for label content',
        },
        {
          name: 'class',
          type: 'string',
          default: '-',
          description: 'Additional CSS classes',
        },
      ]}
      examples={[
        {
          title: 'Basic Label',
          description: 'Simple label with value prop.',
          code: `<Label value="Email" />
<Label value="Password" />`,
          component: () => (
            <div class="flex flex-col gap-2">
              <Label value="Email" />
              <Label value="Password" />
            </div>
          ),
        },
        {
          title: 'Color Variants',
          description: 'Five color variants for different states.',
          code: `<Label value="Default label" color="gray" />
<Label value="Info label" color="info" />
<Label value="Success label" color="success" />
<Label value="Warning label" color="warning" />
<Label value="Error label" color="failure" />`,
          component: () => (
            <div class="flex flex-col gap-2">
              <Label value="Default label" color="gray" />
              <Label value="Info label" color="info" />
              <Label value="Success label" color="success" />
              <Label value="Warning label" color="warning" />
              <Label value="Error label" color="failure" />
            </div>
          ),
        },
        {
          title: 'With Form Element',
          description: 'Label associated with an input using the for attribute.',
          code: `<div>
  <Label value="Username" for="username-input" />
  <input id="username-input" type="text" class="..." />
</div>`,
          component: () => (
            <div class="flex flex-col gap-1">
              <Label value="Username" for="username-input" />
              <input
                id="username-input"
                type="text"
                placeholder="Enter username"
                class="w-64 rounded-lg border border-gray-300 p-2.5 text-sm dark:border-gray-600 dark:bg-gray-700"
              />
            </div>
          ),
        },
        {
          title: 'Using Children',
          description: 'Using children instead of value prop.',
          code: `<Label for="email">
  Email Address <span class="text-red-500">*</span>
</Label>`,
          component: () => (
            <Label for="email">
              Email Address <span class="text-red-500">*</span>
            </Label>
          ),
        },
      ]}
      usage={`import { Label } from '@exowpee/solidly';

// Basic usage with value
<Label value="Email" />

// With for attribute
<Label value="Username" for="username-input" />
<input id="username-input" type="text" />

// With color variant
<Label value="Error field" color="failure" />

// Using children for custom content
<Label for="email">
  Email <span class="text-red-500">*</span>
</Label>`}
    />
  );
}
